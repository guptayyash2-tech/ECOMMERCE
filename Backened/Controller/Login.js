const admin = require("../mongo/Admin/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment variables");
  }
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "25d",
  });
};

// ✅ LOGIN
const postlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ✅ GET ADMIN (by ID or all)
const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const user = await admin.findById(id).select("-password");
      if (!user) return res.status(404).json({ message: "Admin not found" });
      return res.status(200).json(user);
    }

    // if no ID → return all admins
    const users = await admin.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ✅ UPDATE ADMIN
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, phone } = req.body;

    const updates = { username, email, phone };

    // If password provided → hash it
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updated = await admin.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin updated successfully",
      admin: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { postlogin, getAdmin, updateAdmin };
