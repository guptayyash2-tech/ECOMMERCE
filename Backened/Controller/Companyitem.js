const Product = require("../mongo/Admin/Comapnyitemmongo"); // Product model

// 🧩 Register a new product
const registerProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      sku,
      tags,
      imageBase64Array, // optional if frontend sends base64 images
    } = req.body;

    const admin = req.admin?._id; // assuming admin middleware adds req.admin

    // ✅ Validate required fields
    if (!name || !category || !price || !stock || !sku) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let images = [];

    // 📂 Case 1: Uploaded via multer (multipart/form-data)
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => 
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );
    }

    // 📂 Case 2: Sent as Base64 strings (from frontend)
    else if (imageBase64Array) {
      if (typeof imageBase64Array === "string") {
        try {
          images = JSON.parse(imageBase64Array);
        } catch (e) {
          return res.status(400).json({ error: "Invalid imageBase64Array format" });
        }
      } else if (Array.isArray(imageBase64Array)) {
        images = imageBase64Array;
      }
    }

    // 🚨 Require at least 4 images
    if (!images || images.length < 4) {
      return res.status(400).json({
        error: "At least 4 images are required for a product.",
      });
    }

    // 🧠 Parse tags
    const parsedTags =
      typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : tags || [];

    // 💾 Create and save product
    const newProduct = new Product({
      adminid: admin,
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      sku,
      tags: parsedTags,
      images,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "✅ Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🧾 Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// 🔍 Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id) return res.status(400).json({ error: "Product ID is required" });

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

module.exports = { registerProduct, getProducts, getProductById };
