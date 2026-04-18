require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Middleware
const { authenticateAdmin } = require("./middleware/authMiddleware");

// Route imports
const certificateRoutes = require("./routes/certificates");
const verificationRoutes = require("./routes/verification");
const adminRoutes = require("./routes/admin");
const adminController = require("./controllers/adminController");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Logging
app.use(morgan("dev"));

// ===== DATABASE CONNECTION =====

// Using in-memory database - no MongoDB required
console.log("✅ In-Memory Database Ready");

// ===== BLOCKCHAIN INITIALIZATION =====

const initializeBlockchain = async () => {
  try {
    // Load deployment info
    const deploymentPath = path.join(
      __dirname,
      "../../blockchain/scripts/deployment.json"
    );
    const abiPath = path.join(
      __dirname,
      "../../blockchain/scripts/CertificateVault_ABI.json"
    );

    if (!fs.existsSync(deploymentPath) || !fs.existsSync(abiPath)) {
      console.warn(
        "⚠️  Blockchain files not found. Contract interaction disabled."
      );
      return;
    }

    const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
    const contractABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

    // Create provider and signer
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const adminPrivateKey =
      process.env.ADMIN_PRIVATE_KEY ||
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers.Wallet(adminPrivateKey, provider);

    // Create contract instance
    const contract = new ethers.Contract(
      deploymentData.contractAddress,
      contractABI,
      signer
    );

    // Initialize admin controller with contract and signer
    const adminControllerSimple = require("./controllers/adminController-simple");
    adminControllerSimple.initializeBlockchain(contract, signer);

    // Initialize verification controller with contract
    const verificationController = require("./controllers/verificationController");
    verificationController.initializeContract(contract);

    // Store in app locals
    app.locals.contract = contract;
    app.locals.signer = signer;

    console.log("✅ Blockchain initialized");
    console.log(`📝 Contract Address: ${deploymentData.contractAddress}`);
    console.log(`👤 Admin Address: ${signer.address}`);
  } catch (error) {
    console.warn("⚠️  Blockchain Initialization Error:", error.message);
    console.log("⏭️  Continuing without blockchain - metadata only mode");
  }
};

initializeBlockchain();

// ===== ROUTES =====

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "✅ Server is running", 
    database: "in-memory",
    blockchain: app.locals.contract ? "connected" : "not connected",
    timestamp: new Date().toISOString() 
  });
});

// Certificate routes
app.use("/api/certificates", certificateRoutes);

// Verification routes
app.use("/api/verify", verificationRoutes);

// Admin routes (with authentication)
app.use("/api/admin", authenticateAdmin, adminRoutes);

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔴 Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    status: err.status || 500,
  });
});

// ===== START SERVER =====

app.listen(PORT, () => {
  console.log(`
    🚀 Server running on port ${PORT}
    📍 Environment: ${process.env.NODE_ENV || "development"}
    🗄️  Database: in-memory (no MongoDB required)
  `);
});

module.exports = app;
