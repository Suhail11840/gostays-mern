const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExpressError = require('../utils/ExpressError'); // For custom error handling

// Define the storage location and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
    // Ensure the directory exists, create if it doesn't
    if (!fs.existsSync(uploadPath)) {
      try {
        fs.mkdirSync(uploadPath, { recursive: true });
      } catch (err) {
        console.error("Failed to create upload directory:", err);
        return cb(new ExpressError(500, "Failed to prepare upload location."), null);
      }
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Use a unique suffix to prevent filename collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    // Sanitize fieldname to prevent path traversal or invalid characters if it's user-influenced
    const safeFieldname = file.fieldname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, safeFieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter to accept only common image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new ExpressError(400, 'Invalid file type. Only JPEG, PNG, GIF, WEBP, and SVG images are allowed.'), false); // Reject file
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8 // 8MB limit per file (adjust as needed)
  },
  fileFilter: fileFilter
});

// Middleware for handling multiple image uploads for listings
// The field name 'listing_images' must match the name attribute in your frontend form's file input.
const uploadListingImages = upload.array('listing_images', 10); // Allows up to 10 files with field name 'listing_images'

module.exports = {
  uploadListingImages
};