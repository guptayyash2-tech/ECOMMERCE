const Userpersonal =  require("../../mongo/user/Userpersonal");

// ➕ Create or Add Personal Info
const createUserpersonal = async (req, res) => {
  try {
    const existing = await Userpersonal.findOne({ user: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Personal info already exists. Please update instead." });
    }

    const newProfile = new Userpersonal({
      user: req.user.id,
      name: req.body.name,
      address1: req.body.address1,
      address2: req.body.address2,
      address3: req.body.address3,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      mobileNumber1: req.body.mobileNumber1,
      mobileNumber2: req.body.mobileNumber2,
    });

    await newProfile.save();
    res.status(201).json({
      message: "User personal info created successfully!",
      data: newProfile,
    });
  } catch (error) {
    console.error("❌ Error creating personal info:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// 📄 Get Logged-in User Personal Info
const getUserpersonal = async (req, res) => {
  try {
    const profile = await Userpersonal.findOne({ user: req.user.id }).populate("user", "name email role");
    if (!profile) {
      return res.status(404).json({ message: "Personal info not found." });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error fetching personal info:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// 🔄 Update User Personal Info
const updateUserpersonal = async (req, res) => {
  try {
    const updatedProfile = await Userpersonal.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          name: req.body.name,
          address1: req.body.address1,
          address2: req.body.address2,
          address3: req.body.address3,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          mobileNumber1: req.body.mobileNumber1,
          mobileNumber2: req.body.mobileNumber2,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Personal info not found." });
    }

    res.status(200).json({
      message: "User personal info updated successfully!",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Error updating personal info:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// 🗑️ Delete Personal Info (optional)
const deleteUserpersonal = async (req, res) => {
  try {
    const deletedProfile = await Userpersonal.findOneAndDelete({ user: req.user.id });
    if (!deletedProfile) {
      return res.status(404).json({ message: "Personal info not found." });
    }
    res.status(200).json({ message: "Personal info deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting personal info:", error);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  createUserpersonal,
  getUserpersonal,
  updateUserpersonal,
  deleteUserpersonal,
};
