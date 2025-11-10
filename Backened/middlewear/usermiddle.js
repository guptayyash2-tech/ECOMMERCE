const jwt = require("jsonwebtoken");
const User = require("../mongo/user/user"); // not ../../


// 🔒 Middleware: Protect routes using JWT
const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check if token is provided in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 2️⃣ Check environment config
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET not defined in .env file");
        return res.status(500).json({ message: "Server misconfiguration" });
      }

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Get user data (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found or no longer exists" });
      }

      // 5️⃣ Continue to next middleware or route
      return next();

    } catch (error) {
      console.error("❌ Token verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
  }

  // 6️⃣ If no token found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;
