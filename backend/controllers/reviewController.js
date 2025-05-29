const Review = require("../models/Review.js"); // Ensure path is correct
const Listing = require("../models/Listing.js"); // Ensure path is correct
const ExpressError = require("../utils/ExpressError.js"); // Ensure path is correct

// POST create a new review for a listing
module.exports.createReview = async (req, res, next) => {
  const { listingId } = req.params;
  
  // Ensure req.body.review exists and contains necessary fields
  if (!req.body.review || typeof req.body.review !== 'object') {
    return next(new ExpressError(400, "Review data is missing or invalid."));
  }
  const { rating, comment } = req.body.review;

  // Manual basic validation
  if (rating === undefined || rating === null) {
    return next(new ExpressError(400, "Review rating is required."));
  }
  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return next(new ExpressError(400, "Rating must be a number between 1 and 5."));
  }
  if (!comment || typeof comment !== 'string' || comment.trim() === "") {
    return next(new ExpressError(400, "Review comment cannot be empty."));
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(new ExpressError(404, "Listing not found, cannot add review."));
  }

  const newReview = new Review({
    comment: comment.trim(),
    rating: numericRating,
    author: req.user._id, // req.user populated by auth middleware (syncUserWithDb)
    listing: listingId,   // Associate review with the listing
  });

  try {
    await newReview.save(); // Mongoose validation will also run here
    listing.reviews.push(newReview._id);
    await listing.save();

    // Populate author details for the response
    const populatedReview = await Review.findById(newReview._id)
                                        .populate('author', 'username profileImageUrl'); // Populate necessary fields

    res.status(201).json(populatedReview);
  } catch (dbError) {
    console.error("Error saving review or updating listing:", dbError);
    if (dbError.name === 'ValidationError') {
        // Extract Mongoose validation error messages
        const messages = Object.values(dbError.errors).map(val => val.message);
        return next(new ExpressError(400, `Validation error: ${messages.join(', ')}`));
    }
    return next(new ExpressError(500, "Failed to save review."));
  }
};

// DELETE a review
module.exports.destroyReview = async (req, res, next) => {
  const { listingId, reviewId } = req.params;

  // isReviewAuthor middleware should have already verified ownership and review existence.
  // However, a direct check can be a safeguard.
  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ExpressError(404, "Review not found for deletion."));
  }
  // Additional check to ensure the review belongs to the specified listing, though not strictly necessary
  // if routes are structured well and IDs are correct.
  if (review.listing.toString() !== listingId) {
      return next(new ExpressError(400, "Review does not belong to the specified listing."))
  }


  try {
    // Remove review reference from listing's reviews array
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    
    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully", reviewId });
  } catch (dbError) {
    console.error("Error deleting review:", dbError);
    return next(new ExpressError(500, "Failed to delete review."));
  }
};