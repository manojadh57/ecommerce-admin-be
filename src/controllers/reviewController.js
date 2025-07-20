import mongoose from "mongoose";
import Review from "../models/review/ReviewSchema.js";
import Product from "../models/product/ProductSchema.js";

// Approve a review
export const approveReview = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid review ID" });

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.approved = true;
    await review.save();

    // Also add to product.reviews if not already there
    await Product.findByIdAndUpdate(review.productId, {
      $addToSet: { reviews: review._id },
    });

    return res.status(200).json({ message: "Review approved", review });
  } catch (err) {
    next(err);
  }
};

// Delete a review
export const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid review ID" });

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Remove reference from product
    await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id },
    });

    return res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
