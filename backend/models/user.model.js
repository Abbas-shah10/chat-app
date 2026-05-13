import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
      default: "https://www.vecteezy.com/free-vector/anonymous-avatar",
    },
    loggedOutAt: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
