import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.model.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");

    const users = await User.find();

    for (let user of users) {
      if (!user.phishingProgress) user.phishingProgress = {};

      const levels = ["beginner", "medium", "pro"];

      levels.forEach((lvl) => {
        if (!user.phishingProgress[lvl]) {
          user.phishingProgress[lvl] = {};
        }

        if (user.phishingProgress[lvl].currentIndex === undefined) {
          user.phishingProgress[lvl].currentIndex = 0;
        }

        if (!user.phishingProgress[lvl].attemptMap) {
          user.phishingProgress[lvl].attemptMap = {};
        }
      });

      await user.save();
    }

    console.log("✅ All users updated with currentIndex + attemptMap");
    process.exit();
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};

run();