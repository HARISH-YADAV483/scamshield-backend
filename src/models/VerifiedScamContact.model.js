import mongoose from "mongoose";

const verifiedScamContactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["phone", "email", "url", "upi", "social"],
      required: true,
    },

    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    source: {
      type: String,
      default: "community",
    },

    tags: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VerifiedScamContact", verifiedScamContactSchema);