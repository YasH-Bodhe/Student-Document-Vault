const db = require("../inMemoryDB");
const crypto = require("crypto");

// Get blockchain instances from app context
let contract = null;
let signer = null;

const initializeBlockchain = (c, s) => {
  contract = c;
  signer = s;
};

module.exports.initializeBlockchain = initializeBlockchain;

/**
 * Validate Ethereum address format
 */
const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Issue a new certificate (Admin only)
 */
exports.issueCertificate = async (req, res) => {
  try {
    const {
      studentAddress,
      studentName,
      courseName,
      issuerName,
      certificateHash,
      qrCodeData,
    } = req.body;

    // Validation
    if (
      !studentAddress ||
      !studentName ||
      !courseName ||
      !issuerName ||
      !certificateHash
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!isValidAddress(studentAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    let blockchainTxHash = null;
    let certificateId = null;
    let blockNumber = null;

    // **WRITE TO BLOCKCHAIN** if contract is available
    if (contract && signer) {
      try {
        console.log("📝 Writing certificate to blockchain...");
        const contractWithSigner = contract.connect(signer);
        
        const tx = await contractWithSigner.issueCertificate(
          studentAddress,
          studentName,
          courseName,
          issuerName,
          certificateHash
        );

        console.log(`  ⏳ Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        blockchainTxHash = receipt.hash || receipt.transactionHash || tx.hash;
        blockNumber = receipt.blockNumber;
        
        // Parse the CertificateIssued event to get the certificate ID
        const certificateIssuedEvent = receipt.logs
          .map(log => {
            try {
              return contract.interface.parseLog(log);
            } catch (e) {
              return null;
            }
          })
          .find(event => event && event.name === 'CertificateIssued');

        if (certificateIssuedEvent) {
          certificateId = certificateIssuedEvent.args.certificateId;
          console.log(`✅ Certificate ID: ${certificateId}`);
        } else {
          throw new Error('CertificateIssued event not found in transaction');
        }
        
        console.log(`✅ Certificate written to blockchain in block ${receipt.blockNumber}`);
      } catch (blockchainError) {
        console.error("❌ Blockchain write failed:", blockchainError.message);
        return res.status(400).json({ 
          error: "Failed to write certificate to blockchain: " + blockchainError.message 
        });
      }
    } else {
      return res.status(400).json({ 
        error: "Blockchain not initialized. Cannot issue certificate." 
      });
    }

    // Save to in-memory database with blockchain details using the correct certificate ID
    const certificate = db.saveCertificate({
      certificateId,
      studentAddress,
      studentName,
      courseName,
      issuerName,
      certificateHash,
      blockchainTxHash,
      blockNumber,
      qrCodeData: qrCodeData || `https://verify.vault/${certificateId}`,
      issuerAddress: signer.address,
    });

    res.status(201).json({
      success: true,
      message: "Certificate issued on blockchain successfully",
      data: {
        ...certificate,
        blockchainTxHash,
        blockNumber,
      },
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    res.status(500).json({ error: "Failed to issue certificate" });
  }
};

/**
 * Revoke an existing certificate (Admin only)
 */
exports.revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID required" });
    }

    // Check if certificate exists in database
    const metadata = await CertificateMetadata.findOne({ certificateId });
    if (!metadata) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    try {
      let transactionHash = null;
      let blockNumber = null;

      // If blockchain is initialized, revoke on blockchain
      if (contract && signer) {
        const tx = await contract.connect(signer).revokeCertificate(certificateId);
        const receipt = await tx.wait();
        transactionHash = receipt.transactionHash;
        blockNumber = receipt.blockNumber;
      }

      // Update database record
      metadata.isValid = false;
      await metadata.save();

      res.json({
        success: true,
        message: "Certificate revoked successfully",
        data: {
          certificateId,
          transactionHash: transactionHash || null,
          blockNumber: blockNumber || null,
        },
      });
    } catch (blockchainError) {
      console.error("Blockchain error:", blockchainError);
      res.status(400).json({
        error: "Failed to revoke certificate on blockchain",
        details: blockchainError.message,
      });
    }
  } catch (error) {
    console.error("Error revoking certificate:", error);
    res.status(500).json({ error: "Failed to revoke certificate" });
  }
};

/**
 * Get pending certificates (not yet synced)
 */
exports.getPendingCertificates = async (req, res) => {
  try {
    const certificates = await CertificateMetadata.find().limit(20);

    res.json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
};

/**
 * Get dashboard statistics for admin
 */
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get blockchain statistics (if available)
    let blockchainStats = null;
    if (contract) {
      try {
        const totalCertificates = await contract.getTotalCertificates();
        blockchainStats = {
          totalIssued: totalCertificates.toString(),
        };
      } catch (err) {
        console.error("Error fetching blockchain stats:", err.message);
      }
    }

    // Get database statistics
    const dbCertificates = await CertificateMetadata.countDocuments();

    const validCertificates = await CertificateMetadata.countDocuments({
      isValid: true,
    });
    const revokedCertificates = await CertificateMetadata.countDocuments({
      isValid: false,
    });

    const uniqueStudents = await CertificateMetadata.distinct("studentAddress");
    const recentCertificates = await CertificateMetadata.find()
      .sort({ issueDate: -1 })
      .limit(10);

    res.json({
      success: true,
      dashboard: {
        blockchain: blockchainStats,
        database: {
          totalCertificates: dbCertificates,
          validCertificates: validCertificates,
          revokedCertificates: revokedCertificates,
          uniqueStudents: uniqueStudents.length,
        },
        recentCertificates: recentCertificates,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
};

/**
 * Generate QR code data
 */
exports.generateQRCode = async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID required" });
    }

    // Generate verification URL
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationUrl = `${baseUrl}/verify?certId=${certificateId}`;

    res.json({
      success: true,
      qrCodeData: verificationUrl,
      message: "QR code data generated successfully",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
};
