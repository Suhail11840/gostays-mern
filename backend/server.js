// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const fs = require('fs');

// Clerk Middleware
const { clerkMiddleware } = require('@clerk/express'); // Import the main Clerk middleware

// Custom Utilities and Route Handlers
const ExpressError = require("./utils/ExpressError.js"); // Ensure path is correct
const asyncHandler = require("./utils/asyncHandler.js"); // Ensure path is correct

// Route Modules
const listingRoutes = require("./routes/listingRoutes.js"); // Ensure path is correct
const reviewRoutes = require("./routes/reviewRoutes.js");   // Ensure path is correct
const userRoutes = require("./routes/userRoutes.js");     // Ensure path is correct

// Controllers (only if used directly in server.js, e.g., webhook)
const userController = require("./controllers/userController.js"); // For Clerk webhook

// Initialize Express App
const app = express();

// --- Middleware Setup ---

// CORS Configuration
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const corsOptions = {
  origin: clientUrl,
  credentials: true, // Important for Clerk if session cookies are used cross-domain
};
app.use(cors(corsOptions));

// Body Parsers for JSON and URL-encoded data
// Multer will handle multipart/form-data, so these are for other types of requests.
app.use(express.json({ limit: '10mb' })); // For JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For URL-encoded payloads

// Cookie Parser
app.use(cookieParser());

// Clerk Middleware - Should be applied before your API routes that need authentication
// This middleware populates req.auth on successful authentication.
app.use(clerkMiddleware()); // Apply Clerk middleware globally

// Static File Serving for Uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created directory for uploads: ${uploadsDir}`);
    } catch (err) {
        console.error(`FATAL: Could not create uploads directory at ${uploadsDir}`, err);
        process.exit(1); // Exit if we can't create essential directory
    }
}
app.use('/uploads', express.static(uploadsDir)); // Serve files from /public/uploads at /uploads URL path
console.log(`Serving static files from /uploads, mapped to directory: ${uploadsDir}`);


// --- Database Connection ---
const dbUrl = process.env.MONGO_URI;
if (!dbUrl) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

mongoose.connect(dbUrl)
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`Successfully connected to MongoDB: ${dbName} (at ${dbUrl.split('@')[1] || dbUrl.split('//')[1]})`);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    // console.error("Full MongoDB error details:", err); // Uncomment for more detail if needed
    process.exit(1);
  });

// --- API Routes ---
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the GoStays API! Stay a while and listen." });
});

// Mount Routers
app.use("/api/listings", listingRoutes);
app.use("/api/listings/:listingId/reviews", reviewRoutes); // Handles reviews nested under listings
app.use("/api/users", userRoutes);

// Clerk Webhook Endpoint for user synchronization
// This route MUST use express.raw() for Svix signature verification,
// so it's defined here before any other JSON body parsers might interfere.
app.post(
  "/api/users/webhook/clerk",
  express.raw({ type: 'application/json' }), // Parses the body as a Buffer, not JSON
  asyncHandler(userController.handleClerkWebhook)
);

// --- Error Handling ---

// Catch-all for undefined API routes (404 Not Found)
// This should be placed after all valid API routes
app.all("/api/*", (req, res, next) => {
  next(new ExpressError(404, `API Route Not Found: ${req.method} ${req.originalUrl}`));
});

// Global Error Handling Middleware
// This middleware catches errors passed by next(err) from any route or middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected internal server error occurred.";

  // Log the error (in production, consider more sophisticated logging)
  console.error("--- Global Error Handler ---");
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error(`Request: ${req.method} ${req.originalUrl}`);
  if(req.auth && req.auth().userId) console.error(`Authenticated User (Clerk ID): ${req.auth().userId}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Message: ${message}`);
  // Only show stack trace in development or for non-500 errors for security
  if (process.env.NODE_ENV === "development" || statusCode !== 500) {
    console.error("Stack:", err.stack);
  } else {
    console.error("(Stack trace hidden for 500 error in production)");
  }
  console.error("--- End of Error ---");

  // Send JSON response to the client
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    // Optionally, include stack in development for easier client-side debugging
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on port ${PORT}`);
  console.log(`Frontend is expected to be running at: ${clientUrl}`);
  if (!process.env.CLERK_SECRET_KEY) {
    console.warn("WARNING: CLERK_SECRET_KEY is not set. Clerk authentication will not function correctly.");
  }
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    console.warn("WARNING: CLERK_WEBHOOK_SIGNING_SECRET is not set. Clerk webhooks cannot be verified.");
  }
});