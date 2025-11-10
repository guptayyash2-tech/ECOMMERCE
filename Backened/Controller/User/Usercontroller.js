const User = require("../../mongo/user/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔑 Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment variables");
  }
  return jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "25d",
  });
};

// 🧾 POST /api/users/register
const postuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
      token: generateToken(savedUser._id),
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// 🔓 POST /api/users/login
const postuserlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};


// 👤 GET /api/users/me  → Get logged-in user info
const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
// ✏️ PUT /api/users/me → Update logged-in user info
const updateuser = async (req, res) => {
  try {
    const { name, email} = req.body;

    // 🔐 Find the current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 🧩 Update only provided fields
    if (name) user.name = name;
    if (email) user.email = email;
   

    // 💾 Save updated data
    const updatedUser = await user.save();

    // 🧼 Remove password before sending back
    const { password, ...userData } = updatedUser.toObject();

    res.status(200).json({
      message: "✅ User profile updated successfully.",
      user: userData,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};


module.exports = { postuser, postuserlogin, getuser,updateuser };
