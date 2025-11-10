const express  =require("express");
const protect = require("../../middlewear/usermiddle");
const { postuser, postuserlogin, getuser, updateuser } = require("../../Controller/User/Usercontroller");
const { createUserpersonal, getUserpersonal, updateUserpersonal, deleteUserpersonal } = require("../../Controller/User/Userpersonal");
const userrouter = express.Router();

userrouter.post("/registeruser",postuser)
userrouter.post("/loginuser",postuserlogin)
userrouter.get("/getuser",protect,getuser)
userrouter.put("/updateuser",protect,updateuser)
userrouter.post("/createpersonaluser",protect,createUserpersonal)
userrouter.get("/getpersonaluser",protect,getUserpersonal)
userrouter.put("/updatepersonaluser",protect,updateUserpersonal)
userrouter.delete("/deletepersonaluser",protect,deleteUserpersonal)
module.exports = userrouter;