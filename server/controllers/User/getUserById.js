// server/controllers/User/getUserById.js
import User from "../../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID and exclude password
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
