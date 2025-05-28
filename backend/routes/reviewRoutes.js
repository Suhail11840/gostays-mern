const express = require("express");
// mergeParams: true allows access to params from parent router (e.g., :listingId from listingRoutes)
const router = express.Router({ mergeParams: true });
const asyncHandler = require("../utils/asyncHandler.js");
const reviewController = require("../controllers/reviewController.js");
const { requireAuth, syncUserWithDb } = require("../middleware/clerkAuth.js");
const { validateReview, isReviewAuthor } = require("../middleware/validateRequest.js");

// All routes here are prefixed with /api/listings/:listingId/reviews

// POST /api/listings/:listingId/reviews
router.post(
  "/",
  requireAuth,      // Ensures user is logged in via Clerk
  syncUserWithDb,   // Syncs Clerk user with local DB, populates req.user
  validateReview,   // Validates review data (rating, comment)
  asyncHandler(reviewController.createReview)
);

// DELETE /api/listings/:listingId/reviews/:reviewId
router.delete(
  "/:reviewId",
  requireAuth,
  syncUserWithDb,
  isReviewAuthor,   // Authorization: checks if req.user is the author of the review
  asyncHandler(reviewController.destroyReview)
);

module.exports = router;