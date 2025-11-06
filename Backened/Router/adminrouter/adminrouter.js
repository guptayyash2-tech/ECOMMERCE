const express = require("express");
const multer = require("multer");
const adminrouter = express.Router();

const adminprotect = require("../../middlewear/adminmiddile");
const { postlogin, getAdmin, updateAdmin } = require("../../Controller/Login");
const { registerCompanyProfile, getCompanyProfiles } = require("../../Controller/Admincompanyprofile");

// Setup Multer to store files in memory (so we can convert to Base64)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Admin routes
adminrouter.post("/loginadmin", postlogin);
adminrouter.get("/getadmin", adminprotect, getAdmin);
adminrouter.put("/updateadmin", adminprotect, updateAdmin);

// ✅ Register company profile with image upload support
// 'image' is the field name in your form-data (frontend or Postman)
adminrouter.post(
  "/registercompanyprofile",
  adminprotect,
  upload.single("image"),
  registerCompanyProfile
);
adminrouter.get("/getcompanyprofile",adminprotect,getCompanyProfiles);

module.exports = adminrouter;
