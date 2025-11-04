require("dotenv").config(); // ✅ Load .env at the very top

const bcrypt = require("bcryptjs");
const Otp = require("../mongo/Admin/otp");
const Admin = require("../mongo/Admin/admin");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");

// ✅ Check environment variables
console.log("🔍 TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("🔍 TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("🔍 TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

// ✅ Initialize Twilio client safely
let client;
try {
  client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} catch (err) {
  console.error("❌ Failed to initialize Twilio:", err.message);
}

// ✅ JWT token generator
const generateToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment variables");
  }
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "25d",
  });
};

// ✅ STEP 1: REGISTER - Send OTP
const adminRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Delete old OTP entries for same email
    await Otp.deleteOne({ email });

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password & OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);

    // Save OTP document
    const otpDoc = new Otp({
      name,
      email,
      phone,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 mins expiry
    });

    await otpDoc.save();

    // ✅ Try sending OTP via Twilio
    try {
      const message = await client.messages.create({
        body: `Your Admin registration OTP is: ${generatedOtp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      console.log("✅ Twilio SMS sent:", message.sid);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. It will expire in 5 minutes.",
        email,
      });
    } catch (smsError) {
      console.error("❌ Twilio SMS Error:", smsError.message);

      // Fallback for development/testing
      return res.status(200).json({
        success: true,
        message:
          "⚠️ Twilio SMS failed — OTP generated (showing for testing only)",
        testOtp: generatedOtp, // ⚠️ remove this in production
        email,
      });
    }
  } catch (error) {
    console.error("❌ Error in adminRegister:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
      error: error.message,
    });
  }
};

// ✅ STEP 2: VERIFY - Confirm OTP & Register Admin
const adminVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpData = await Otp.findOne({ email });
    if (!otpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if OTP expired
    if (otpData.otpExpires < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Compare OTP entered with hashed one
    const isMatch = await bcrypt.compare(otp, otpData.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Create new admin
    const newAdmin = new Admin({
      username: otpData.name,
      email: otpData.email,
      phone: otpData.phone,
      password: otpData.password, // already hashed
      role: "admin",
    });

    await newAdmin.save();

    // Delete OTP document after successful registration
    await Otp.deleteOne({ email });

    // Generate JWT token
    const token = generateToken(newAdmin._id);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        phone: newAdmin.phone,
      },
    });
  } catch (error) {
    console.error("❌ Error in adminVerify:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
      error: error.message,
    });
  }
};

module.exports = { adminRegister, adminVerify };
