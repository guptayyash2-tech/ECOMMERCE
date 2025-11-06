const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // who added the product
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Electronics",
      "Fashion",
      "Home",
      "Beauty",
      "Books",
      "Sports",
      "Toys",
      "Groceries",
      "Other",
    ],
    default: "Other",
  },

  brand: {
    type: String,
    trim: true,
  },

  images: {
    type: [String], // array of image URLs
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  discountPrice: {
    type: Number,
    default: 0,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  sku: {
    type: String, // unique product code
    unique: true,
    required: true,
  },

  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },

  tags: {
    type: [String],
    default: [],
  },

  shipping: {
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    freeShipping: { type: Boolean, default: false },
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // auto adds createdAt and updatedAt
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
