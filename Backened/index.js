const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


const otprouter = require("./Router/Router");
const MongoStore = require("connect-mongodb-session")(session);

dotenv.config();

const index = express();

// ✅ Allow larger JSON and URL-encoded bodies (fix for PayloadTooLargeError)
index.use(express.json({ limit: "50mb" })); // increase if needed
index.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Enable CORS
index.use(cors());

// ✅ View engine setup (optional)
index.set("views", "ejs");
index.set("view engine", "ejs");

// ✅ Routes

index.use("/otp",otprouter)

// ✅ MongoDB connection string
const DB_PATH =
  "mongodb+srv://homeregister:pMgp4PUS8csyrnYC@group8.mwqmfsy.mongodb.net/ECOMMERCE?retryWrites=true&w=majority";

const PORT = 3019;

// ✅ Connect to MongoDB
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    index.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error while connecting to MongoDB:", err);
  });
