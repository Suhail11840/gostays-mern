const express = require("express");
const router = express.Router(); // This will be for general user API routes like /me
const asyncHandler = require("../utils/asyncHandler.js");
const userController = require("../controllers/userController.js");
const { requireAuth, syncUserWithDb } = require("../middleware/clerkAuth.js");

// All routes here are prefixed with /api/users

// GET /api/users/me - Get current authenticated user's details from our DB
router.get(
    "/me",
    requireAuth,
    syncUserWithDb,
    asyncHandler(userController.getCurrentUser)
);

// Webhook route for Clerk is handled separately in server.js due to express.raw requirement.
// If you prefer to keep it here, you'd export this router and another one for webhooks.
// For simplicity, server.js directly calls the controller for the webhook.

module.exports = router;