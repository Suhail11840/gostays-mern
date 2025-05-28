const Review = require("../models/Review.js");
const Listing = require("../models/Listing.js");
const ExpressError = require("../utils/ExpressError.js");

// POST create a new review for a listing
module.exports.createReview = async (req, res, next) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);

  if (!listing) {
    return next(new ExpressError(404, "Listing not found, cannot add review."));
  }

  const reviewData = req.body.review; // Assuming { review: { comment: "...", rating: X } }
  if (!reviewData || !reviewData.comment || reviewData.rating == null) {
    return next(new ExpressError(400, "Review comment and rating are required."));
  }

  const newReview = new Review({
    ...reviewData,
    author: req.user._id, // req.user populated by auth middleware (syncUserWithDb)
    listing: listingId,   // Associate review with the listing
  });

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();

  // Populate author details for the response for immediate use by frontend
  const populatedReview = await Review.findById(newReview._id)
                                      .populate('author', 'username profileImageUrl');

  res.status(201).json(populatedReview);
};

// DELETE a review
module.exports.destroyReview = async (req, res, next) => {
  const { listingId, reviewId } = req.params;

  // Find the review to ensure it exists and to check ownership if needed (already done by isReviewAuthor middleware)
  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ExpressError(404, "Review not found for deletion."));
  }

  // Remove review reference from listing's reviews array
  // $pull operator removes all instances of a value from an array
  await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
  
  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({ message: "Review deleted successfully", reviewId });
};