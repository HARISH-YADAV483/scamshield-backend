import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },


profilePic: { type: String, default: "" },


    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ✅ Email verification status
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ OTP (if you still store it, optional)
    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    // ✅ Reward points (leaderboard)
    points: {
      type: Number,
      default: 0,
    },

    // ✅ Phishing Simulator Progress
    phishingProgress: {
      beginner: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 100 },
        completed: { type: Boolean, default: false },
        unlocked: { type: Boolean, default: true },

        currentIndex: { type: Number, default: 0 },

        // ✅ attemptMap stores: { questionId: "correct"/"wrong" }
        attemptMap: { type: mongoose.Schema.Types.Mixed, default: {} },
      },

      medium: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 50 },
        completed: { type: Boolean, default: false },
        unlocked: { type: Boolean, default: false },

        currentIndex: { type: Number, default: 0 },

        attemptMap: { type: mongoose.Schema.Types.Mixed, default: {} },
      },

      pro: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 50 },
        completed: { type: Boolean, default: false },
        unlocked: { type: Boolean, default: false },

        currentIndex: { type: Number, default: 0 },

        attemptMap: { type: mongoose.Schema.Types.Mixed, default: {} },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);