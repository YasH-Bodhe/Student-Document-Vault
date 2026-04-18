const db = require("../inMemoryDB");
const { ethers } = require("ethers");

/**
 * @controller VerificationController
 * @description Handles certificate verification operations
 */

// Get blockchain contract from app context
let contract = null;

const initializeContract = (c) => {
  contract = c;
};

module.exports.initializeContract = initializeContract;

/**
 * Verify certificate via certificate ID
 */
exports.verifyCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID required" });
    }

    const metadata = db.getCertificateById(certificateId);
    let blockchainStatus = null;
    let blockchainData = null;

    // Try to verify on blockchain first
    if (contract) {
      try {
        blockchainData = await contract.verifyCertificate(certificateId);
        const isValid = await contract.isCertificateValid(certificateId);
        blockchainStatus = isValid ? "VALID" : "REVOKED";
        
        console.log(`✅ Certificate verified on blockchain: ${blockchainStatus}`);
      } catch (blockchainError) {
        console.log("ℹ️ Certificate not on blockchain");
        blockchainStatus = "NOT_ON_BLOCKCHAIN";
      }
    }
    
    if (!metadata) {
      return res.json({
        success: true,
        isValid: false,
        status: "NOT_FOUND",
        message: "Certificate not found",
        blockchain: blockchainStatus,
      });
    }

    // Update verification count
    if (metadata) {
      metadata.verificationCount = (metadata.verificationCount || 0) + 1;
      metadata.lastVerifiedAt = new Date();
      db.updateCertificate(certificateId, metadata);
    }

    res.json({
      success: true,
      isValid: metadata.isValid && blockchainStatus !== "REVOKED",
      certificate: {
        certificateId: metadata.certificateId,
        studentName: metadata.studentName,
        courseName: metadata.courseName,
        issueDate: metadata.createdAt,
        issuerName: metadata.issuerName,
        studentAddress: metadata.studentAddress,
        status: metadata.isValid && blockchainStatus !== "REVOKED" ? "VALID" : "INVALID/REVOKED",
        verifications: metadata.verificationCount,
      },
      blockchain: blockchainStatus,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

/**
 * Verify certificate via QR code data
 */
exports.verifyCertificateViaQR = async (req, res) => {
  try {
    const { qrCodeData } = req.body;

    if (!qrCodeData) {
      return res.status(400).json({ error: "QR code data required" });
    }

    // Extract certificate ID from QR code data
    let certificateId = qrCodeData;
    
    if (qrCodeData.includes("?")) {
      const params = new URLSearchParams(qrCodeData.split("?")[1]);
      certificateId = params.get("certId") || qrCodeData;
    }

    const metadata = db.getCertificateById(certificateId);
    
    if (!metadata) {
      return res.json({
        success: true,
        isValid: false,
        status: "FAKE",
        message: "This certificate is FAKE or has been revoked",
      });
    }

    // Update verification count
    metadata.verificationCount = (metadata.verificationCount || 0) + 1;
    metadata.lastVerifiedAt = new Date();
    db.updateCertificate(certificateId, metadata);

    res.json({
      success: true,
      isValid: metadata.isValid,
      certificate: {
        certificateId: metadata.certificateId,
        studentName: metadata.studentName,
        courseName: metadata.courseName,
        issueDate: metadata.createdAt,
        issuerName: metadata.issuerName,
        status: metadata.isValid ? "VALID" : "INVALID/REVOKED",
      },
    });
  } catch (error) {
    console.error("Error verifying QR code:", error);
    res.status(500).json({ error: "QR verification failed" });
  }
};

/**
 * Get verification details
 */
exports.getVerificationDetails = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const metadata = db.getCertificateById(certificateId);

    if (!metadata) {
      return res.status(404).json({ error: "Certificate metadata not found" });
    }

    res.json({
      success: true,
      verification: {
        isValid: metadata.isValid,
        blockchainStatus: metadata.isValid ? "VALID" : "REVOKED",
        verificationHistory: {
          totalVerifications: metadata.verificationCount || 0,
          lastVerifiedAt: metadata.lastVerifiedAt,
        },
        certificate: {
          studentName: metadata.studentName,
          courseName: metadata.courseName,
          issueDate: metadata.createdAt,
          issuerName: metadata.issuerName,
          issuerAddress: metadata.issuerAddress,
          certificateHash: metadata.certificateHash,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching verification details:", error);
    res.status(500).json({ error: "Failed to fetch verification details" });
  }
};

/**
 * Batch verify multiple certificates
 */
exports.batchVerify = async (req, res) => {
  try {
    const { certificateIds } = req.body;

    if (!Array.isArray(certificateIds) || certificateIds.length === 0) {
      return res.status(400).json({ error: "Certificate IDs array required" });
    }

    const results = certificateIds.map(certId => {
      const metadata = db.getCertificateById(certId);
      
      if (metadata) {
        metadata.verificationCount = (metadata.verificationCount || 0) + 1;
        metadata.lastVerifiedAt = new Date();
        db.updateCertificate(certId, metadata);
      }

      return {
        certificateId: certId,
        isValid: metadata ? metadata.isValid : false,
        status: metadata ? (metadata.isValid ? "VALID" : "INVALID") : "NOT_FOUND",
      };
    });

    res.json({
      success: true,
      verifications: results,
      summary: {
        total: results.length,
        valid: results.filter((r) => r.isValid).length,
        invalid: results.filter((r) => !r.isValid).length,
      },
    });
  } catch (error) {
    console.error("Error batch verifying:", error);
    res.status(500).json({ error: "Batch verification failed" });
  }
};
