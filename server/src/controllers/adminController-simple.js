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
 * Generate certificate ID
 */
const generateCertificateId = (studentAddress, courseName) => {
  return crypto
    .createHash("sha256")
    .update(`${studentAddress}-${courseName}-${Date.now()}`)
    .digest("hex");
};

/**
 * Issue a new certificate
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

    if (!studentAddress || !studentName || !courseName || !issuerName || !certificateHash) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!isValidAddress(studentAddress)) {
      return res.status(400).json({ error: "Invalid student Ethereum address" });
    }

    const certificateId = generateCertificateId(studentAddress, courseName);
    let blockchainTxHash = null;
    let blockchainCertId = null;

    // Write to blockchain if available
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

        console.log(`  Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        blockchainTxHash = tx.hash || receipt.transactionHash;
        
        console.log(`✅ Certificate written to blockchain: ${blockchainTxHash}`);
      } catch (blockchainError) {
        console.warn("⚠️ Blockchain write failed:", blockchainError.message);
        // Continue with in-memory storage as fallback
      }
    }

    const issueDate = new Date();
    const certificateData = {
      certificateId,
      studentAddress: studentAddress.toLowerCase(),
      studentName,
      courseName,
      issuerName,
      certificateHash,
      qrCodeData: qrCodeData || `https://verify.vault.io/cert/${certificateId}`,
      issuerAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      blockchainTxHash,
      blockchainCertId,
      issueDate: issueDate,
      isValid: true,
      verificationCount: 0,
    };

    const certificate = db.saveCertificate(certificateData);
    console.log(`✅ Certificate issued to ${studentName}`);

    return res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: {
        certificateId,
        studentName,
        courseName,
        issueDate: issueDate,
        qrCodeData: certificateData.qrCodeData,
        blockchainTxHash,
        onBlockchain: !!blockchainTxHash,
      },
    });
  } catch (error) {
    console.error("Error issuing certificate:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to issue certificate",
      success: false,
    });
  }
};

/**
 * Revoke a certificate
 */
exports.revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID is required" });
    }

    let blockchainTxHash = null;

    // Revoke on blockchain if available
    if (contract && signer) {
      try {
        console.log("🔴 Revoking certificate on blockchain...");
        const contractWithSigner = contract.connect(signer);
        
        const tx = await contractWithSigner.revokeCertificate(certificateId);
        const receipt = await tx.wait();
        blockchainTxHash = receipt.transactionHash;
        
        console.log(`✅ Certificate revoked on blockchain: ${blockchainTxHash}`);
      } catch (blockchainError) {
        console.warn("⚠️ Blockchain revoke failed:", blockchainError.message);
        // Continue with in-memory revocation
      }
    }

    const success = db.revokeCertificate(certificateId);
    if (success) {
      console.log(`✅ Certificate revoked: ${certificateId}`);
      return res.status(200).json({
        success: true,
        message: "Certificate revoked successfully",
        data: {
          certificateId,
          blockchainTxHash,
        },
      });
    }

    return res.status(404).json({ error: "Certificate not found", success: false });
  } catch (error) {
    console.error("Error revoking certificate:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to revoke certificate",
      success: false,
    });
  }
};

/**
 * Get admin dashboard
 */
exports.getAdminDashboard = async (req, res) => {
  try {
    const stats = db.getStats();
    const recentCertificates = db.getRecentCertificates(10).map(cert => ({
      _id: cert.certificateId,
      studentName: cert.studentName,
      courseName: cert.courseName,
      issueDate: cert.createdAt,
      certificateId: cert.certificateId.substring(0, 20) + "...",
      isValid: cert.isValid,
    }));

    return res.status(200).json({
      success: true,
      dashboard: {
        database: stats,
        recentCertificates,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to fetch dashboard",
      success: false,
    });
  }
};

/**
 * Get certificate statistics
 */
exports.getStats = async (req, res) => {
  try {
    const stats = db.getStats();
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to fetch statistics",
      success: false,
    });
  }
};
