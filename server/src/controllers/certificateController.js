const db = require("../inMemoryDB");
const { ethers } = require("ethers");
const generatePremiumCertificatePDF = require("../utils/generatePremiumCertificatePDF");

/**
 * @controller CertificateController
 * @description Handles certificate-related operations
 */

/**
 * Fetch all certificates for a student
 */
exports.getStudentCertificates = async (req, res) => {
  try {
    const { studentAddress } = req.params;

    // Validate Ethereum address
    if (!ethers.isAddress(studentAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    const certificates = db.getCertificatesByStudent(studentAddress);

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
 * Get a single certificate by ID
 */
exports.getCertificateDetails = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = db.getCertificateById(certificateId);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Error fetching certificate details:", error);
    res.status(500).json({ error: "Failed to fetch certificate details" });
  }
};

/**
 * Store certificate metadata after blockchain issuance
 */
exports.storeCertificateMetadata = async (req, res) => {
  try {
    const {
      certificateId,
      studentAddress,
      studentName,
      courseName,
      issuerAddress,
      issuerName,
      certificateHash,
      qrCodeData,
    } = req.body;

    // Validation
    if (!certificateId || !studentAddress || !studentName || !courseName || !issuerAddress || !issuerName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if already exists
    const existing = db.getCertificateById(certificateId);
    if (existing) {
      return res.status(400).json({ error: "Certificate already stored" });
    }

    // Create new metadata record
    const metadata = db.saveCertificate({
      certificateId,
      studentAddress: studentAddress.toLowerCase(),
      studentName,
      courseName,
      issuerAddress: issuerAddress.toLowerCase(),
      issuerName,
      certificateHash,
      qrCodeData,
      isValid: true,
    });

    res.status(201).json({
      success: true,
      message: "Certificate metadata stored successfully",
      data: metadata,
    });
  } catch (error) {
    console.error("Error storing certificate metadata:", error);
    res.status(500).json({ error: "Failed to store certificate metadata" });
  }
};

/**
 * Get all certificates issued by a specific issuer
 */
exports.getIssuerCertificates = async (req, res) => {
  try {
    const { issuerAddress } = req.params;

    if (!ethers.isAddress(issuerAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    const allCerts = db.getAllCertificates();
    const certificates = allCerts.filter(c => c.issuerAddress.toLowerCase() === issuerAddress.toLowerCase());

    res.json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    console.error("Error fetching issuer certificates:", error);
    res.status(500).json({ error: "Failed to fetch issuer certificates" });
  }
};

/**
 * Get statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const stats = db.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

/**
 * Download certificate as PDF (professional, print-ready)
 */
exports.downloadCertificate = async (req, res) => {
  try {
    let { certificateId } = req.params;

    // Decode URL-encoded certificate ID
    certificateId = decodeURIComponent(certificateId);

    console.log('📥 Download request received for certificate ID:', certificateId);
    console.log('📊 ID length:', certificateId.length, 'characters');
    console.log('🔍 Looking up certificate in database...');
    
    const certificate = db.getCertificateById(certificateId);

    if (!certificate) {
      console.log('❌ Certificate not found');
      const allCerts = db.getAllCertificates();
      console.log('📋 Available certificates:', allCerts.map(c => ({ id: c.certificateId, name: c.studentName })));
      return res.status(404).json({ error: "Certificate not found" });
    }

    console.log('✅ Certificate found:', certificate.certificateId, certificate.studentName);

    // Generate premium PDF certificate
    const pdfBuffer = await generatePremiumCertificatePDF(certificate);

    console.log('✅ PDF generated successfully. Size:', pdfBuffer.length, 'bytes');

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf"`
    );
    
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Error downloading certificate:", error);
    res.status(500).json({ error: "Failed to download certificate" });
  }
};
