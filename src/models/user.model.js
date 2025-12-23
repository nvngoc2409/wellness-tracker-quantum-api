import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, },
    email: { type: String },
    name: { type: String },
    avatar: { type: String },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    deviceId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
