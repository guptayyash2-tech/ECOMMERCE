const Product = require("../mongo/Companyitemmongo"); // your Product model

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
      imageBase64Array,
    } = req.body;

    const admin = req.admin._id; // assuming admin is authenticated

    // 🧩 Validate required fields
    if (!name || !category || !price || !stock || !sku) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let images = [];

    // 📂 Case 1: Uploaded using multipart/form-data (via multer)
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      });
    }


    // 🚨 Validate at least 4 images
    if (images.length < 4) {
      return res
        .status(400)
        .json({ error: "At least 4 images are required for a product." });
    }

    // 🧠 Parse tags (if sent as string)
    const parsedTags =
      typeof tags === "string" ? JSON.parse(tags) : tags || [];

    // 💾 Create product
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

module.exports = { registerProduct };
