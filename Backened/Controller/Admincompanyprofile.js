const Companyschema = require("../mongo/Admin/AdminCompanyprofile");

const registerCompanyProfile = async (req, res) => {
  try {
    const { companyName, type, location, imageBase64 } = req.body;
    const admin = req.admin._id;

    if (!companyName || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let userImage;

    if (req.file) {
      userImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else if (imageBase64) {
      userImage = imageBase64.startsWith("data:image")
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;
    } else {
      return res.status(400).json({ error: "Image is required" });
    }

    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    const newCompany = new Companyschema({
      admin,
      companyName,
      type,
      location: parsedLocation,
      image: userImage,
    });

    const savedCompany = await newCompany.save();

    res.status(201).json({
      message: "Company profile created successfully",
      company: savedCompany,
    });
  } catch (error) {
    console.error("❌ Error creating company profile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getCompanyProfiles = async (req, res) => {
  try {
    const admin = req.admin._id;

    const companies = await Companyschema.find({ admin }).sort({ createdAt: -1 });

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "No company profiles found" });
    }

    res.status(200).json({
      message: "✅ Company profiles fetched successfully",
      companies,
    });
  } catch (error) {
    console.error("❌ Error fetching company profiles:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerCompanyProfile, getCompanyProfiles };
