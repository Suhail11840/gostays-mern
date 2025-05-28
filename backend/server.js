// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { clerkMiddleware } = require('@clerk/express'); // Import the new middleware

// Import custom utilities and route handlers
const ExpressError = require("./utils/ExpressError.js");
const asyncHandler = require("./utils/asyncHandler.js");

// Import route modules
const listingRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/userRoutes.js"); // For routes like /api/users/me

// Import controllers and middleware needed directly in server.js
const userController = require("./controllers/userController.js"); // For Clerk webhook

// Initialize the Express application
const app = express();

// --- Middleware Setup ---

// CORS (Cross-Origin Resource Sharing) Configuration
// Allows requests from your frontend (specified in CLIENT_URL)
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173"; // Default to Vite dev server
const corsOptions = {
  origin: clientUrl,
  credentials: true, // Important for Clerk if it uses cookies for session management
};
app.use(cors(corsOptions));

// Parsers for request bodies
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// Cookie Parser
// Parses Cookie header and populates req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// --- Database Connection ---

// MongoDB Connection (uses MONGO_URI from .env)
const dbUrl = process.env.MONGO_URI;
if (!dbUrl) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1); // Exit if database URI is not set
}

mongoose.connect(dbUrl)
  .then(() => {
    console.log(`Successfully connected to Local MongoDB at ${dbUrl.split('@')[1] || dbUrl}`); // Basic obfuscation for logs
  })
  .catch((err) => {
    console.error("Local MongoDB Connection Error:", err.message);
    console.error("Full error details:", err);
    process.exit(1); // Exit if database connection fails on startup
  });

// --- API Routes ---

// Basic API welcome route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the GoStays API!" });
});

// Listing routes (e.g., /api/listings, /api/listings/:id)
app.use("/api/listings", listingRoutes);

// Review routes (nested under listings, e.g., /api/listings/:listingId/reviews)
app.use("/api/listings/:listingId/reviews", reviewRoutes);

// User-specific API routes (e.g., /api/users/me to get current user details)
app.use("/api/users", userRoutes);

// Clerk Webhook Endpoint
// This route *must* use express.raw() to receive the raw request body for Svix signature verification.
// It's defined directly here to ensure the raw body parser is applied correctly.
app.post(
  "/api/users/webhook/clerk",
  express.raw({ type: 'application/json' }), // Parses the body as a Buffer
  asyncHandler(userController.handleClerkWebhook) // Controller handles webhook logic
);

// --- Error Handling ---

// Catch-all for undefined API routes (404 Not Found)
// This should be placed after all valid API routes
app.all("/api/*", (req, res, next) => {
  next(new ExpressError(404, `API Route Not Found - ${req.method} ${req.originalUrl}`));
});

// Global error handling middleware
// This middleware catches errors passed by next(err) from any route or middleware
app.use((err, req, res, next) => {
  // Use the status code from the error if it's an ExpressError, otherwise default to 500
  const statusCode = err.statusCode || 500;
  // Use the message from the error, or a generic message
  const message = err.message || "An unexpected internal server error occurred.";

  // Log the error to the console for debugging
  // In production, you might use a more sophisticated logging library (e.g., Winston)
  console.error("--- Global Error Handler ---");
  console.error(`Status: ${statusCode}`);
  console.error(`Message: ${message}`);
  if (process.env.NODE_ENV === "development") {
    console.error("Stack:", err.stack); // Show stack trace in development
  }
  console.error("--- End of Error ---");


  // Send a JSON response to the client
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    // Optionally include stack trace in development for easier debugging on the client-side if needed
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --- Server Initialization ---

// Define the port the server will listen on (from .env or default to 8080)
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on port ${PORT}`);
  console.log(`Frontend is expected to be running at: ${clientUrl}`);
});