const mongoose = require("mongoose");

const adminCompanyProfileSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminSchema",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "",
    },

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },

    image: {
      type: String,
      required: true,
    },

    listedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Export the model with a proper name and schema reference
module.exports = mongoose.model("AdminCompanyProfile", adminCompanyProfileSchema);
