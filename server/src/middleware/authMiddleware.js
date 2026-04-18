/**
 * Admin Authentication Middleware
 * Validates that only authorized admin addresses can issue/revoke certificates
 */

// List of authorized admin addresses (can be modified)
const AUTHORIZED_ADMINS = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", // Default Hardhat admin
  process.env.ADMIN_ADDRESS?.toLowerCase(),
].filter(Boolean);

/**
 * Middleware to authenticate admin requests
 * Admin address must be provided in request headers or body
 */
const authenticateAdmin = (req, res, next) => {
  try {
    // Get admin address from header or request body
    const adminAddress = (
      req.headers["x-admin-address"] ||
      req.body.adminAddress ||
      req.query.adminAddress
    )?.toLowerCase();

    if (!adminAddress) {
      return res.status(401).json({
        error: "Unauthorized: Admin address is required (via header x-admin-address or body)",
        success: false,
      });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(adminAddress)) {
      return res.status(400).json({
        error: "Invalid admin address format",
        success: false,
      });
    }

    // Check if address is authorized
    if (!AUTHORIZED_ADMINS.includes(adminAddress)) {
      return res.status(403).json({
        error: "Forbidden: This address is not authorized to perform this action",
        success: false,
        authorizedAdmins: process.env.NODE_ENV !== "production" ? AUTHORIZED_ADMINS : undefined,
      });
    }

    // Attach admin address to request object for later use
    req.adminAddress = adminAddress;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Authentication error",
      success: false,
    });
  }
};

module.exports = { authenticateAdmin };
