const db = require("../inMemoryDB");

/**
 * @controller AdminController
 * @description Handles admin operations for certificate management
 * Simplified version using in-memory database (no MongoDB required)
 */

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

    // Save to in-memory database
    const certificate = db.saveCertificate({
      studentAddress,
      studentName,
      courseName,
      issuerName,
      certificateHash,
      issuerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      qrCodeData: `https://verify.vault/${studentAddress.substring(0, 10)}`,
    });

    res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: certificate,
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
