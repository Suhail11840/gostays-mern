const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/Listing');
const Review = require('../models/Review');

const listingSchemaValidation = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image_url: Joi.string().uri().allow('', null).optional() // Image URL is optional, can be empty or null
  }).required(),
});

const reviewSchemaValidation = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchemaValidation.validate(req.body); // Validate req.body directly
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(',');
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchemaValidation.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(',');
    return next(new ExpressError(400, errMsg));
  }
  next();
};

module.exports.isListingOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    if (!req.user || !listing.owner.equals(req.user._id)) { // req.user._id from syncUserWithDb
      return next(new ExpressError(403, "You are not authorized to perform this action"));
    }
    next();
  } catch (error) {
    console.error("Error in isListingOwner:", error);
    next(new ExpressError(500, "Error checking listing ownership"));
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ExpressError(404, "Review not found"));
    }
    if (!req.user || !review.author.equals(req.user._id)) {
      return next(new ExpressError(403, "You are not authorized to perform this action"));
    }
    next();
  } catch (error) {
    console.error("Error in isReviewAuthor:", error);
    next(new ExpressError(500, "Error checking review authorship"));
  }
};