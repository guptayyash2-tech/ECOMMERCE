const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures only one OTP entry per email
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, // store hashed password temporarily
  },
  otp: {
    type: String,
    required: true, // store hashed OTP
  },
  otpExpires: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000, // expires in 5 minutes
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Automatically delete expired OTPs (optional but recommended)
otpSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
