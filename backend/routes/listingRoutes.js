const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler.js"); // Ensure path is correct
const listingController = require("../controllers/listingController.js"); // Ensure path is correct
const { requireAuth, syncUserWithDb } = require("../middleware/clerkAuth.js"); // Ensure path is correct
const { isListingOwner } = require("../middleware/validateRequest.js"); // Ensure path is correct (only isListingOwner now)
const { uploadListingImages } = require("../middleware/multerConfig.js"); // Ensure path is correct

// All routes here are prefixed with /api/listings in server.js

// GET all listings & POST a new listing
router.route("/")
  .get(asyncHandler(listingController.index))
  .post(
    requireAuth,          // Clerk: User must be signed in
    syncUserWithDb,       // Syncs Clerk user to local DB, populates req.user
    uploadListingImages,  // Multer: Handles file uploads for 'listing_images' field
    // validateListing,   // REMOVED Joi validation for listing data
    asyncHandler(listingController.createListing) // Controller handles creation
  );

// GET, PUT, DELETE a specific listing by ID
router.route("/:id")
  .get(asyncHandler(listingController.showListing)) // Controller shows one listing
  .put(
    requireAuth,          // Clerk: User must be signed in
    syncUserWithDb,       // Syncs Clerk user to local DB
    isListingOwner,       // Authorization: Checks if current user owns the listing
    uploadListingImages,  // Multer: Handles file uploads if images are updated
    // validateListing,   // REMOVED Joi validation for listing data
    asyncHandler(listingController.updateListing) // Controller handles update
  )
  .delete(
    requireAuth,          // Clerk: User must be signed in
    syncUserWithDb,       // Syncs Clerk user to local DB
    isListingOwner,       // Authorization: Checks if current user owns the listing
    asyncHandler(listingController.destroyListing) // Controller handles deletion
  );

module.exports = router;