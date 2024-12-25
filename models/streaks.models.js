const mongoose = require("mongoose");

const StreakSchema = new mongoose.Schema(
  {
    // Type of activity being tracked (e.g., "project", "app", "website")
    type: {
      type: String,
    },
    // Identifier for the project, app, or website
    targetId: {
      type: String, // Could be WakaTime project name, app name, URL, or a custom ID
    },
    // Name to display in UI
    targetName: {
      type: String,
    },
    // Daily usage goal (in minutes)
    dailyGoal: {
      type: Number,
      min: 1,
    },
    // Current streak length (in days)
    currentStreak: {
      type: Number,
      default: 0,
    },
    // Longest streak length (in days)
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Streak = mongoose.model("Streak", StreakSchema);

module.exports = Streak;