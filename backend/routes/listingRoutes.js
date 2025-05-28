const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler.js");
const listingController = require("../controllers/listingController.js");
const { requireAuth, syncUserWithDb } = require("../middleware/clerkAuth.js");
const { validateListing, isListingOwner } = require("../middleware/validateRequest.js");


// Multer and Cloudinary storage are removed

// All routes here are prefixed with /api/listings

router.route("/")
  .get(asyncHandler(listingController.index))
  .post(
    requireAuth,
    syncUserWithDb,
    // upload.single("listing[image]") - REMOVED
    validateListing, // Joi validation for text fields
    asyncHandler(listingController.createListing)
  );

router.route("/:id")
  .get(asyncHandler(listingController.showListing))
  .put(
    requireAuth,
    syncUserWithDb,
    isListingOwner,
    // upload.single("listing[image]") - REMOVED (handle image URL in body)
    validateListing,
    asyncHandler(listingController.updateListing)
  )
  .delete(
    requireAuth,
    syncUserWithDb,
    isListingOwner,
    asyncHandler(listingController.destroyListing)
  );

module.exports = router;