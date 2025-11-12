require("dotenv").config(); // Load .env FIRST

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const Otp = require("../mongo/Admin/otp");
const Admin = require("../mongo/Admin/admin");

// ✅ Check environment variables on startup
if (!process.env.JWT_SECRET) console.warn("⚠️ Missing JWT_SECRET in .env");
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN)
  console.warn("⚠️ Missing Twilio credentials in .env");

// ✅ Initialize Twilio client
let client;
try {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log("✅ Twilio client initialized");
} catch (err) {
  console.error("❌ Failed to initialize Twilio client:", err.message);
}

// ✅ Generate JWT token
const generateToken = (adminId) =>
  jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "25d",
  });

// ===================================================
// 🪄 STEP 1: ADMIN REGISTER → SEND OTP
// ===================================================
const adminRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 🧩 Delete any previous OTP for this email
    await Otp.deleteOne({ email });

    // 🧩 Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🧩 Hash password and OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);

    // 🧩 Save OTP entry
    const otpDoc = new Otp({
      name,
      email,
      phone,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
    });
    await otpDoc.save();

    // 🧩 Try sending SMS via Twilio
    try {
      const msg = await client.messages.create({
        body: `Your Admin OTP is ${generatedOtp}. It expires in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      console.log("✅ Twilio message sent:", msg.sid);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. It will expire in 5 minutes.",
        email,
      });
    } catch (err) {
      console.error("❌ Twilio SMS Error:", err.message);

      // ⚠️ fallback for testing/dev only
      return res.status(200).json({
        success: true,
        message: "⚠️ Twilio failed — showing OTP for testing (remove in prod)",
        testOtp: generatedOtp,
        email,
      });
    }
  } catch (err) {
    console.error("❌ Error in adminRegister:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: err.message,
    });
  }
};

// ===================================================
// 🧩 STEP 2: VERIFY OTP → CREATE ADMIN ACCOUNT
// ===================================================
const adminVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    // Expiry check
    if (otpRecord.otpExpires < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Validate OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Create Admin
    const newAdmin = new Admin({
      username: otpRecord.name,
      email: otpRecord.email,
      phone: otpRecord.phone,
      password: otpRecord.password, // already hashed
      role: "admin",
    });

    await newAdmin.save();
    await Otp.deleteOne({ email }); // cleanup

    // Generate Token
    const token = generateToken(newAdmin._id);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully ✅",
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        phone: newAdmin.phone,
      },
    });
  } catch (err) {
    console.error("❌ Error in adminVerify:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
      error: err.message,
    });
  }
};

module.exports = { adminRegister, adminVerify };
