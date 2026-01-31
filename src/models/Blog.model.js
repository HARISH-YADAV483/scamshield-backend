import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    body: { type: String, required: true },

    images: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);