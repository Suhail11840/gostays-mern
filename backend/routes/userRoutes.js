const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler.js"); // Ensure path is correct
const userController = require("../controllers/userController.js"); // Ensure path is correct
const { requireAuth, syncUserWithDb } = require("../middleware/clerkAuth.js"); // Ensure path is correct

// All routes here are prefixed with /api/users in server.js

// GET /api/users/me - Get current authenticated user's details from our DB
router.get(
    "/me",
    requireAuth,    // Clerk: Ensures user is authenticated
    syncUserWithDb, // Syncs/retrieves local user profile, populates req.user
    asyncHandler(userController.getCurrentUser) // Controller sends back user data
);

// Webhook route for Clerk is typically handled directly in server.js
// due to the express.raw({ type: 'application/json' }) body parser requirement
// for Svix signature verification, which needs to be applied before other JSON parsers.
// If userController.handleClerkWebhook is defined and used in server.js, this file is complete for /me.

module.exports = router;