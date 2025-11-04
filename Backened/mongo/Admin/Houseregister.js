const mongoose = require("mongoose");

const adminHomeRegisterSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminRegister",
      required: true,
    },

    houseName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },
    priceType: {
      type: String,
      enum: ["day", "night"],
      required: true,
      default: "day",
    },

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },

    // 🏠 Room details
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    livingRooms: { type: Number, default: 0 },
    kitchens: { type: Number, default: 0 },
    diningRooms: { type: Number, default: 0 },
    balconies: { type: Number, default: 0 },
    garages: { type: Number, default: 0 },
    sizeSqft: { type: Number, default: 0 },

    amenities: [{ type: String }], // e.g. WiFi, Parking, Garden

    available: {
      type: Boolean,
      default: true,
    },
    userImage:{
      type :String,
    },
    listedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminHomeRegister", adminHomeRegisterSchema);
