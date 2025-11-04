const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false, // optional but useful if using Twilio
    },
    password: {
      type: String,
      required: true, // already hashed before saving
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin", // default role for your admin registration flow
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Admin", AdminSchema);
