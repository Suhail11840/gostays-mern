const Listing = require("../models/Listing.js");
// User model might be needed if you populate owner details extensively, not strictly for listing creation itself
// const User = require("../models/User.js");
const ExpressError = require("../utils/ExpressError.js");
const tt = require("@tomtom-international/web-sdk-services/dist/services-node.min.js");

const mapToken = process.env.MAP_TOKEN;

// GET all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}).populate({
    path: 'owner',
    select: 'username' // Or other fields like profileImageUrl if Clerk provides it
  }).sort({ createdAt: -1 }); // Sort by newest first
  res.status(200).json(allListings);
};

// POST create new listing
module.exports.createListing = async (req, res, next) => {
  if (!mapToken) {
    return next(new ExpressError(500, "Map service is not configured."));
  }

  const { title, description, price, location, country, image_url } = req.body.listing; // Expecting flat structure or listing object

  let geocodeResponse;
  try {
    geocodeResponse = await tt.services.geocode({
      key: mapToken,
      query: location,
      limit: 1,
    });
  } catch (error) {
    console.error("Geocoding API error:", error);
    return next(new ExpressError(500, "Error with geocoding service."));
  }

  if (!geocodeResponse || !geocodeResponse.results || !geocodeResponse.results.length) {
    return next(new ExpressError(400, "Location not found. Please enter a valid address."));
  }
  const { lng, lat } = geocodeResponse.results[0].position;

  const newListingData = {
    title,
    description,
    price,
    location,
    country,
    // Image handling: use provided URL or default from schema
    image: { url: image_url || "https://via.placeholder.com/300x200.png?text=No+Image" },
  };

  const listing = new Listing(newListingData);
  listing.owner = req.user._id; // req.user is populated by clerkAuth + syncUserWithDb
  listing.position = { type: "Point", coordinates: [lng, lat] };

  const savedListing = await listing.save();
  const populatedListing = await Listing.findById(savedListing._id).populate('owner', 'username');
  res.status(201).json(populatedListing);
};

// GET a single listing by ID
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username",
      },
      options: { sort: { createdAt: -1 } } // Sort reviews by newest
    })
    .populate({
      path: "owner",
      select: "username email", // Add email or other fields you want to show
    });

  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }
  res.status(200).json(listing);
};

// PUT update a listing by ID
module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  // Assuming req.body.listing contains the fields to update
  const { title, description, price, location, country, image_url } = req.body.listing;
  
  const updateData = { title, description, price, location, country };

  if (image_url) { // If a new image URL is provided
    updateData.image = { url: image_url };
  } else if (req.body.listing.hasOwnProperty('image_url') && req.body.listing.image_url === "") {
    // If image_url is explicitly set to empty, use placeholder or handle as per your logic
    updateData.image = { url: "https://via.placeholder.com/300x200.png?text=No+Image" };
  }


  if (location) { // If location is being updated, re-geocode
    try {
      const geocodeResponse = await tt.services.geocode({
        key: mapToken,
        query: location,
        limit: 1,
      });
      if (geocodeResponse && geocodeResponse.results && geocodeResponse.results.length) {
        const { lng, lat } = geocodeResponse.results[0].position;
        updateData.position = { type: "Point", coordinates: [lng, lat] };
      } else {
        console.warn("Could not geocode new location during update for listing:", id);
      }
    } catch (error) {
      console.error("Geocoding API error during update:", error);
    }
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('owner', 'username').populate({
      path: "reviews",
      populate: { path: "author", select: "username" }
  });

  if (!updatedListing) {
    return next(new ExpressError(404, "Listing not found for update"));
  }
  res.status(200).json(updatedListing);
};

// DELETE a listing by ID
module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return next(new ExpressError(404, "Listing not found for deletion"));
  }
  res.status(200).json({ message: "Listing deleted successfully", _id: id });
};