import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.model.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const users = await User.find();

    for (const user of users) {
      if (user.points === undefined) user.points = 0;

      if (!user.phishingProgress) {
        user.phishingProgress = {
          beginner: {
            correct: 0,
            total: 100,
            completed: false,
            unlocked: true,
            currentIndex: 0,
            attemptMap: {},
          },
          medium: {
            correct: 0,
            total: 50,
            completed: false,
            unlocked: false,
            currentIndex: 0,
            attemptMap: {},
          },
          pro: {
            correct: 0,
            total: 50,
            completed: false,
            unlocked: false,
            currentIndex: 0,
            attemptMap: {},
          },
        };
      }

      await user.save();
    }

    console.log("✅ Users updated successfully!");
    process.exit();
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};

run();