const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

/**
 * @route GET /api/certificates/student/:studentAddress
 * @description Get all certificates for a specific student
 * @access Public
 */
router.get("/student/:studentAddress", certificateController.getStudentCertificates);

/**
 * @route GET /api/certificates/issuer/:issuerAddress
 * @description Get all certificates issued by an issuer
 * @access Public
 */
router.get("/issuer/:issuerAddress", certificateController.getIssuerCertificates);

/**
 * @route GET /api/certificates/statistics
 * @description Get system statistics
 * @access Public
 */
router.get("/statistics", certificateController.getStatistics);

/**
 * @route GET /api/certificates/:certificateId/download
 * @description Download certificate as HTML/PDF
 * @access Public
 */
router.get("/:certificateId/download", certificateController.downloadCertificate);

/**
 * @route GET /api/certificates/:certificateId
 * @description Get details of a specific certificate
 * @access Public
 */
router.get("/:certificateId", certificateController.getCertificateDetails);

/**
 * @route POST /api/certificates/metadata
 * @description Store certificate metadata
 * @access Public (should be restricted in production)
 */
router.post("/metadata", certificateController.storeCertificateMetadata);

module.exports = router;
