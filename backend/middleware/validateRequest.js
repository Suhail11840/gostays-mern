const ExpressError = require('../utils/ExpressError'); // Ensure path is correct
const Listing = require('../models/Listing');       // Ensure path is correct
const Review = require('../models/Review');         // Ensure path is correct

// No Joi validation functions for listings or reviews anymore.
// Validation will be handled by Mongoose schema definitions and
// manual checks within controller functions if necessary.

module.exports.isListingOwner = async (req, res, next) => {
  try {
    const { id: listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found. Cannot verify ownership."));
    }
    
    const authContext = req.auth();
    if (!authContext || !authContext.userId || !req.user || !req.user._id) {
        return next(new ExpressError(401, "Authentication details missing. Cannot verify ownership."));
    }

    if (!listing.owner.equals(req.user._id)) {
      return next(new ExpressError(403, "You are not authorized to perform this action on this listing."));
    }
    next();
  } catch (error) {
    console.error("Error in isListingOwner middleware:", error);
    next(new ExpressError(500, "An error occurred while checking listing ownership."));
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ExpressError(404, "Review not found. Cannot verify authorship."));
    }

    const authContext = req.auth();
    if (!authContext || !authContext.userId || !req.user || !req.user._id) {
        return next(new ExpressError(401, "Authentication details missing. Cannot verify review authorship."));
    }

    if (!review.author.equals(req.user._id)) {
      return next(new ExpressError(403, "You are not authorized to perform this action on this review."));
    }
    next();
  } catch (error) {
    console.error("Error in isReviewAuthor middleware:", error);
    next(new ExpressError(500, "An error occurred while checking review authorship."));
  }
};