const mongoose = require("mongoose");

/**
 * @model CertificateMetadata
 * @description Stores metadata and additional information about certificates
 */
const certificateMetadataSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    studentAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      lowercase: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    issuerAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    issuerName: {
      type: String,
      required: true,
    },
    certificateHash: {
      type: String,
      required: true,
    },
    qrCodeData: {
      type: String, // URL or hash for QR code
    },
    isValid: {
      type: Boolean,
      default: true,
      index: true,
    },
    verificationCount: {
      type: Number,
      default: 0,
    },
    lastVerifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for common queries
certificateMetadataSchema.index({ studentAddress: 1, isValid: 1 });
certificateMetadataSchema.index({ issuerAddress: 1 });

module.exports = mongoose.model("CertificateMetadata", certificateMetadataSchema);
