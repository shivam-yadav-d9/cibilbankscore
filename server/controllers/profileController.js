import Profile from "../models/profilemodel.js";

// Create or Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { email, name, phoneNumber, pan, aadhar, dob, state, address, city, pincode, creditScore } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required for updating profile" });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { email }, // Find by email
      { $set: { name, phoneNumber, pan, aadhar, dob, state, address, city, pincode, creditScore } },
      { new: true, upsert: true, runValidators: true } // Create if not found
    );

    res.status(200).json({ message: "Profile updated successfully", user: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Database error", error });
  }
};

// Get User Profile by Email
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await Profile.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Database error", error });
  }
};
