const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  // Simplified image handling: store a URL or path if provided, or keep it simple
  image: {
    url: { type: String, default: "https://via.placeholder.com/300x200.png?text=No+Image" }, // Default placeholder
    // filename: String, // Not needed if not using Cloudinary/file system storage for now
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: { // [longitude, latitude]
      type: [Number],
      required: true,
    },
  },
}, { timestamps: true });

listingSchema.index({ position: "2dsphere" });

listingSchema.post("findOneAndDelete", async function(doc) { // Use function for 'this' or pass doc
  if (doc && doc.reviews && doc.reviews.length) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    console.log("Associated reviews deleted for listing:", doc._id);
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;