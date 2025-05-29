const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js"); // Ensure Review model is correctly imported

// Schema for individual images within a listing
const imageSchema = new Schema({
  url: { 
    type: String, 
    required: [true, "Image URL is required."] 
  },
  filename: { // Store filename for local uploads, useful for deletion if needed
    type: String 
  },
  isLocal: { // Flag to distinguish uploaded vs. linked images
    type: Boolean, 
    default: false 
  }
});

const listingSchema = new Schema({
  title: { 
    type: String, 
    required: [true, "Listing title is required."] 
  },
  description: { 
    type: String, 
    default: "" // Default to empty string if not provided
  },
  images: {
    type: [imageSchema],
    validate: [ // Ensure at least one image is provided
      (val) => val.length > 0,
      'At least one image is required for the listing.'
    ]
  },
  price: { 
    type: Number, 
    required: [true, "Price is required."],
    min: [0, "Price cannot be negative."]
  },
  location: { 
    type: String, 
    required: [true, "Location is required."] 
  },
  country: { 
    type: String, 
    required: [true, "Country is required."] 
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // Owner is mandatory
  },
  position: { // GeoJSON Point - Made optional
    type: {
      type: String,
      enum: ["Point"],
      // required: false, // No longer strictly required by the schema itself
    },
    coordinates: { // [longitude, latitude]
      type: [Number],
      // required: false, // No longer strictly required
      validate: { // Optional: ensure if coordinates are provided, they are a pair of numbers
          validator: function(v) {
              // Allow null, empty array, or an array of two numbers
              return v == null || v.length === 0 || (Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number');
          },
          message: 'Coordinates must be an array of two numbers [longitude, latitude] or left empty.'
      }
    },
  },
  category: {
    type: String,
    enum: ['Beach', 'Mountains', 'City', 'Countryside', 'Unique', 'Trending', 'Cabins', 'Lakefront', 'Other'],
    default: 'Other'
  }
}, { timestamps: true }); // Adds createdAt and updatedAt

// Index for geospatial queries (optional if not using map features, but harmless to keep if position might be used later)
// Only create this index if the position field is actually populated and used for queries.
// If position will be rarely used or often null, this index might not be efficient.
// For now, let's assume it might be used later with manual input.
listingSchema.index({ position: "2dsphere" }, { sparse: true }); // sparse: true is good for optional geo fields

// Mongoose middleware to remove associated reviews and local images when a listing is deleted
listingSchema.post("findOneAndDelete", async function(doc) {
  if (doc) {
    // Delete associated reviews
    if (doc.reviews && doc.reviews.length > 0) {
      await Review.deleteMany({ _id: { $in: doc.reviews } });
      console.log(`Associated reviews deleted for listing: ${doc._id}`);
    }

    // Delete associated local images
    if (doc.images && doc.images.length > 0) {
      const fs = require('fs').promises;
      const path = require('path');
      for (const image of doc.images) {
        if (image.isLocal && image.filename) {
          try {
            const imagePath = path.join(__dirname, '..', 'public', 'uploads', image.filename);
            await fs.access(imagePath); // Check if file exists
            await fs.unlink(imagePath);
            console.log(`Deleted local image: ${image.filename}`);
          } catch (accessError) {
            if (accessError.code === 'ENOENT') {
              // console.warn(`Local image not found, skipping deletion: ${image.filename}`);
            } else {
              console.error(`Error accessing/deleting local image ${image.filename} (non-ENOENT):`, accessError);
            }
          }
        }
      }
    }
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;