const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
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
   
    password: {
      type: String,
      required: true, // already hashed before saving
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user", // default role for your admin registration flow
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("User", UserSchema);
