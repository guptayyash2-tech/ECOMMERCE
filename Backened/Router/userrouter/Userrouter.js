const express  =require("express");
const protect = require("../../middlewear/usermiddle");
const { postuser, postuserlogin } = require("../../Controller/User/Usercontroller");
const userrouter = express.Router();

userrouter.post("/registeruser",postuser)
userrouter.post("/loginuser",postuserlogin)
module.exports = userrouter;