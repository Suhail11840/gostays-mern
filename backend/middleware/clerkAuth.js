// backend/middleware/clerkAuth.js
const { clerkMiddleware, requireAuth: clerkRequireAuth } = require('@clerk/express');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/User');

const requireAuth = clerkRequireAuth({});

const syncUserWithDb = async (req, res, next) => {
  // Use req.auth() as a function as per Clerk's deprecation warning
  const authContext = req.auth(); // Call it as a function

  if (!authContext || !authContext.userId) {
    // This condition might be hit if requireAuth is not used before this middleware,
    // or if Clerk somehow fails to populate req.auth.
    // requireAuth should typically prevent unauthenticated access.
    return next(new ExpressError(401, "User not authenticated by Clerk (syncUserWithDb)."));
  }

  const clerkUserId = authContext.userId;

  try {
    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      // If user not found, create them. Claims contain user info from Clerk.
      const claims = authContext.claims || {};
      
      const email = claims.email || `${clerkUserId.slice(0,10)}@clerkuser.placeholder.com`; // Fallback email
      const username = claims.username || claims.firstName || `user_${clerkUserId.slice(-6)}`; // Fallback username
      const profileImageUrl = claims.picture || claims.image_url;


      user = new User({
        clerkId: clerkUserId,
        email: email,
        username: username,
        profileImageUrl: profileImageUrl || '',
        // role: 'user' // Default role is already set in the User model
      });
      await user.save();
      console.log(`New user synced in DB via syncUserWithDb: ${user.username} (Clerk ID: ${clerkUserId})`);
    }
    
    // Attach the Mongoose user document to req.user
    // This is what your controllers will use (e.g., req.user._id)
    req.user = user; 

    next();
  } catch (error) {
    console.error(`Error syncing user with DB (Clerk ID: ${clerkUserId}):`, error);
    return next(new ExpressError(500, "Error processing user information with database."));
  }
};

module.exports = {
    clerkMiddleware, // This should be used globally in server.js if not already
    requireAuth,
    syncUserWithDb,
};