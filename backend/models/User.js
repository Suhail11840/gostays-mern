const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  clerkId: {
    type: String,
    required: [true, "Clerk ID is required."],
    unique: true,
    index: true, // For faster lookups
  },
  username: {
    type: String,
    required: [true, "Username is required."],
    // Clerk typically ensures username uniqueness if configured on their side.
    // You can add a unique index here if you want an extra DB-level check,
    // but be prepared to handle potential conflicts if Clerk's state and DB diverge.
    // unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true, // Clerk ensures email uniqueness.
    lowercase: true,
    trim: true,
  },
  profileImageUrl: {
    type: String,
    default: '', // Or a default placeholder image URL
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // You can add more fields specific to your application if needed
  // e.g., lastLoginAt: Date,
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);