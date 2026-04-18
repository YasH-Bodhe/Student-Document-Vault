const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");

/**
 * @route POST /api/verify/certificate
 * @description Verify certificate by ID
 * @access Public
 */
router.post("/certificate", verificationController.verifyCertificateById);

/**
 * @route POST /api/verify/qr
 * @description Verify certificate via QR code
 * @access Public
 */
router.post("/qr", verificationController.verifyCertificateViaQR);

/**
 * @route GET /api/verify/:certificateId
 * @description Get verification details
 * @access Public
 */
router.get("/:certificateId", verificationController.getVerificationDetails);

/**
 * @route POST /api/verify/batch
 * @description Batch verify multiple certificates
 * @access Public
 */
router.post("/batch", verificationController.batchVerify);

// Initialize contract (called from main app)
router.post("/init", (req, res) => {
  res.json({ message: "Contract initialization handled by server" });
});

module.exports = router;
