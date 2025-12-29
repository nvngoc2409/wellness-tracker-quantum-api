import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, },
    appleId: { type: String },
    email: { type: String },
    name: { type: String },
    avatar: { type: String },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    deviceId: { type: String },
    quantumSessionsCount: { type: Number, default: 0 },
    lastQuantumSessionDate: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
