// backend/middleware/clerkAuth.js

// Remove: const { ClerkExpressRequireAuth, clerkClient } = require('@clerk/clerk-sdk-node');
// Add:
const { clerkMiddleware, requireAuth: clerkRequireAuth } = require('@clerk/express'); // Or @clerk/express if not using fastify structure
// For standard Express, it's often just importing `clerkMiddleware` and `requireAuth` from `@clerk/express`
// Let's assume standard Express usage for now. If the above gives issues, try:
// const { clerkMiddleware, requireAuth: clerkRequireAuth } = require('@clerk/express');
// Or consult the latest @clerk/express documentation for precise import.

const ExpressError = require('../utils/ExpressError');
const User = require('../models/User');

// The `clerkMiddleware` should be applied globally in server.js
// `requireAuth` is then used on specific routes.

// This becomes the middleware to protect specific routes
const requireAuth = clerkRequireAuth({}); // Pass options if needed

// syncUserWithDb remains conceptually the same, but req.auth structure might differ slightly.
// Check req.auth from the new @clerk/express middleware to ensure you're getting userId.
const syncUserWithDb = async (req, res, next) => {
  // req.auth should be populated by clerkMiddleware
  if (!req.auth || !req.auth.userId) {
    return next(new ExpressError(401, "User not authenticated by Clerk (syncUserWithDb)."));
  }

  const clerkUserId = req.auth.userId;
  // console.log("Syncing user, req.auth:", req.auth); // Debug: Check content of req.auth

  try {
    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      const claims = req.auth.claims || {}; // Or req.auth.sessionClaims depending on new SDK structure
      
      const email = claims.email || `${clerkUserId.slice(0,10)}@clerkuser.placeholder.com`;
      const username = claims.username || claims.firstName || `user_${clerkUserId.slice(-6)}`;
      const profileImageUrl = claims.picture || claims.image_url;


      user = new User({
        clerkId: clerkUserId,
        email: email,
        username: username,
        profileImageUrl: profileImageUrl || '',
      });
      await user.save();
      console.log(`New user created/synced in DB via syncUserWithDb: ${user.username} (Clerk ID: ${clerkUserId})`);
    }
    
    req.user = {
        _id: user._id,
        clerkId: user.clerkId,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl
    };

    next();
  } catch (error) {
    console.error(`Error syncing user with DB (Clerk ID: ${clerkUserId}):`, error);
    return next(new ExpressError(500, "Error processing user information with database."));
  }
};

module.exports = {
    // clerkMiddleware, // This will be used in server.js
    requireAuth,     // This is the new route guard
    syncUserWithDb,
};