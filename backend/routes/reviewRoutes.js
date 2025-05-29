const express = require("express");
// mergeParams: true allows access to params from parent router (e.g., :listingId from listingRoutes)
const router = express.Router({ mergeParams: true }); 
const asyncHandler = require("../utils/asyncHandler.js"); // Ensure path is correct
const reviewController = require("../controllers/reviewController.js"); // Ensure path is correct
const { requireAuth, syncUserWithDb } = require("../middleware/clerkAuth.js"); // Ensure path is correct
const { isReviewAuthor } = require("../middleware/validateRequest.js"); // Ensure path is correct (only isReviewAuthor now)

// All routes here are prefixed with /api/listings/:listingId/reviews in server.js

// POST /api/listings/:listingId/reviews - Create a new review for a listing
router.post(
  "/",
  requireAuth,      // Clerk: User must be signed in
  syncUserWithDb,   // Syncs Clerk user with local DB, populates req.user
  // validateReview,   // REMOVED Joi validation for review data
  asyncHandler(reviewController.createReview) // Controller handles review creation
);

// DELETE /api/listings/:listingId/reviews/:reviewId - Delete a specific review
router.delete(
  "/:reviewId",
  requireAuth,      // Clerk: User must be signed in
  syncUserWithDb,   // Syncs Clerk user with local DB
  isReviewAuthor,   // Authorization: Checks if current user is the author of the review
  asyncHandler(reviewController.destroyReview) // Controller handles review deletion
);

module.exports = router;