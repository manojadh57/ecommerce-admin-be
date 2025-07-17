import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    associate: { type: String, default: "" }, // user _id
  },
  { timestamps: true }
);

const SessionModel = mongoose.model("Session", sessionSchema);

// helpers
export const insertToken = (obj) => SessionModel(obj).save();
export const findToken = (token) => SessionModel.findOne({ token });
