const mongoose = require("mongoose");

/**
 * @model User
 * @description Stores user information - can be student or admin
 */
const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    fullName: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      index: true,
    },
    institution: {
      type: String,
    },
    profileImage: {
      type: String, // URL to profile image
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    certificateCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
