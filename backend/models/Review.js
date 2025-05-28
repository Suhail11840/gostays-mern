const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: [true, "Review comment cannot be empty."]
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1."],
    max: [5, "Rating cannot be more than 5."],
    required: [true, "Rating is required."]
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Refers to your User model
    required: true,
  },
  listing: { // Reference to the listing this review belongs to
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: true } // Include both timestamps
});

module.exports = mongoose.model("Review", reviewSchema);