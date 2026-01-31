import mongoose from "mongoose";

const phishingQuestionSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ["beginner", "medium", "pro"], required: true },
    type: { type: String, enum: ["binary", "mcq"], required: true },

    question: { type: String, required: true },
    options: [{ type: String }],

    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("PhishingQuestion", phishingQuestionSchema);