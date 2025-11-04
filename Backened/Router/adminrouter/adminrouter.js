const express = require("express");

const adminrouter = express.Router();
const multer =require("multer");
const { adminregister, adminlogin, getadminprofile, updateadminprofile } = require("../../Controller/Adminregister");
const adminprotect = require("../../middlewear/adminmiddile");
const { addHome, getAllHomes, getHomesByAdmin, updatehomesadmin } = require("../../Controller/Adminhomeregister");

 const storage = multer.memoryStorage();
const upload = multer({ storage });
 
adminrouter.post("/register",  adminregister);
adminrouter.post("/login",adminlogin)
adminrouter.get("/getadmin",adminprotect,getadminprofile)
adminrouter.put("/updateadminprofile",adminprotect,updateadminprofile)
adminrouter.post("/registerhome",adminprotect,upload.single("userImage"),addHome)
adminrouter.get("/getregisterhome",adminprotect,getHomesByAdmin)
adminrouter.put("/update/:homeId",adminprotect,updatehomesadmin)

module.exports = adminrouter;