import mongoose from "mongoose";
import Review from "../models/review/ReviewSchema.js";
import "../models/user/CustomerUserModel.js"; // registers model "User"

export const listReviews = async (_req, res) => {
  const reviews = await Review.find({})
    .populate("productId", "name title images")
    .populate("userId", "email");
  res.json(reviews);
};

export const setReviewApproval = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "Invalid review id" });

  const approved =
    typeof req.body?.approved === "boolean" ? req.body.approved : true;
  const r = await Review.findByIdAndUpdate(id, { approved }, { new: true });
  if (!r) return res.status(404).json({ message: "Review not found" });
  res.json(r);
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "Invalid review id" });

  const r = await Review.findByIdAndDelete(id);
  if (!r) return res.status(404).json({ message: "Review not found" });
  res.json({ message: "Review deleted" });
};
