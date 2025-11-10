const mongoose = require("mongoose");

const UserpersonalSchema = new mongoose.Schema(
  {
    // 🔗 Reference to main user document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // name must match your main User model
      required: true,
    },

    // 🧍‍♂️ Full name (optional since it's also in User)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 🏠 Multiple address lines
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    address3: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"],
    },

    // 📞 Contact numbers
    mobileNumber1: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    mobileNumber2: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Userpersonal", UserpersonalSchema);
