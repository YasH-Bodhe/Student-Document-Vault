const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController-simple");

/**
 * @route GET /api/admin/info
 * @description Get admin information (requires admin auth)
 * @access Admin only
 */
router.get("/info", (req, res) => {
  res.json({
    success: true,
    adminAddress: req.adminAddress,
    message: "Admin authenticated successfully",
  });
});

/**
 * @route POST /api/admin/issue-certificate
 * @description Issue a new certificate (Admin only)
 * @access Restricted
 */
router.post("/issue-certificate", adminController.issueCertificate);

/**
 * @route POST /api/admin/revoke-certificate
 * @description Revoke a certificate (Admin only)
 * @access Restricted
 */
router.post("/revoke-certificate", adminController.revokeCertificate);

/**
 * @route GET /api/admin/dashboard
 * @description Get admin dashboard statistics
 * @access Restricted
 */
router.get("/dashboard", adminController.getAdminDashboard);

/**
 * @route GET /api/admin/stats
 * @description Get certificate statistics
 * @access Restricted
 */
router.get("/stats", adminController.getStats);

module.exports = router;
