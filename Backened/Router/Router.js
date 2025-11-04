const express = require("express");
const { adminRegister, adminVerify } = require("../Controller/registerotp");
const otprouter = express.Router();

otprouter.post("/otpsend",adminRegister);
otprouter.post("/verifyotp",adminVerify)

module.exports = otprouter;