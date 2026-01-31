import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import PhishingQuestion from "../models/PhishingQuestion.model.js";

const beginner = Array.from({ length: 100 }).map((_, i) => ({
  level: "beginner",
  type: "binary",
  question: `Beginner Q${i + 1}: Is this phishing or safe? (Sample message ${i + 1})`,
  options: ["phishing", "safe"],
  correctAnswer: i % 2 === 0 ? "phishing" : "safe",
  explanation: "This is a demo explanation. In real data, explain why it is phishing/safe."
}));

const medium = Array.from({ length: 50 }).map((_, i) => ({
  level: "medium",
  type: "mcq",
  question: `Medium Q${i + 1}: Which is private info that should NOT be shared?`,
  options: ["OTP", "Your name", "City", "Email subject line"],
  correctAnswer: "OTP",
  explanation: "OTP is private and should never be shared with anyone."
}));

const pro = Array.from({ length: 50 }).map((_, i) => ({
  level: "pro",
  type: "mcq",
  question: `Pro Q${i + 1}: Which URL is suspicious?`,
  options: [
    "https://google.com",
    "https://secure-google-login.xyz",
    "https://github.com",
    "https://microsoft.com"
  ],
  correctAnswer: "https://secure-google-login.xyz",
  explanation: "Suspicious domains often contain random words and unusual extensions."
}));

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await PhishingQuestion.deleteMany();
    await PhishingQuestion.insertMany([...beginner, ...medium, ...pro]);

    console.log("✅ Phishing questions seeded successfully!");
    process.exit();
  } catch (err) {
    console.log("❌ Seed error:", err.message);
    process.exit(1);
  }
};

run();