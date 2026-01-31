import mongoose from "mongoose";

const phishingAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "PhishingQuestion", required: true },
    level: { type: String, enum: ["beginner", "medium", "pro"], required: true },

    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },

    attemptedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// ✅ prevent duplicate attempts per question per user
phishingAttemptSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export default mongoose.model("PhishingAttempt", phishingAttemptSchema);