import mongoose from "mongoose";

const scamReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    scamType: {
      type: String,
      required: true,
      enum: ["phishing", "upi", "job", "investment", "otp", "crypto", "other"],
      default: "other",
    },

    platform: {
      type: String,
      required: true,
      enum: ["whatsapp", "instagram", "sms", "email", "call", "other"],
      default: "other",
    },

    scammerContact: { type: String, default: "" },
    lossAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Scam risk score
    susceptibilityScore: { type: Number, default: 0 },

    // ✅ NEW: Verified DB Contact matching
    contactMatchPercent: { type: Number, default: 0 },

    matchedVerifiedContacts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ScamReport", scamReportSchema);