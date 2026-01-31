import User from "../models/User.model.js";
import ScamReport from "../models/ScamReport.model.js";


export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const reportsCount = await ScamReport.countDocuments({
      reportedBy: req.user.id
    });

    res.status(200).json({
      user,
      reportsCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select("name points phishingProgress profilePic")
      .sort({ points: -1 })
      .limit(20);

    return res.status(200).json(users);
  } catch (error) {
    console.log("❌ getLeaderboard error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic || profilePic.trim() === "") {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = profilePic;
    await user.save();

    return res.status(200).json({
      message: "✅ Profile picture updated",
      user,
    });
  } catch (error) {
    console.log("❌ updateProfilePic error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};