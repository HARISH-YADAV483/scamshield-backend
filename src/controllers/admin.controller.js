import ScamReport from "../models/ScamReport.model.js";

export const getPendingReports = async (req, res) => {
  try {
    const reports = await ScamReport.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

export const verifyReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await ScamReport.findByIdAndUpdate(
      id,
      { status: "verified" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "❌ Report not found" });
    }

    res.status(200).json({ message: "✅ Report verified", report });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

export const rejectReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await ScamReport.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "❌ Report not found" });
    }

    res.status(200).json({ message: "✅ Report rejected", report });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};