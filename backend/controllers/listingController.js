const Listing = require("../models/Listing.js"); // Ensure path is correct
const ExpressError = require("../utils/ExpressError.js"); // Ensure path is correct
const fs = require('fs').promises;
const path = require('path');

const serverBaseUrl = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

// Helper function to process and format image data
const processImageInputs = (uploadedFiles, imageUrlsArray) => {
  const images = [];
  if (uploadedFiles && uploadedFiles.length > 0) {
    uploadedFiles.forEach(file => {
      images.push({
        url: `${serverBaseUrl}/uploads/${file.filename}`,
        filename: file.filename,
        isLocal: true
      });
    });
  }
  if (imageUrlsArray && Array.isArray(imageUrlsArray)) {
    imageUrlsArray.forEach(url => {
      if (url && typeof url === 'string' && url.trim() !== '') {
        images.push({ url: url.trim(), isLocal: false });
      }
    });
  }
  return images; // Note: Mongoose schema now validates for at least one image
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}).populate({
    path: 'owner',
    select: 'username profileImageUrl'
  }).sort({ createdAt: -1 });
  res.status(200).json(allListings);
};

module.exports.createListing = async (req, res, next) => {
  if (!req.body.listing) {
      return next(new ExpressError(400, "Listing data is missing."));
  }

  const { title, description, price, location, country, category, image_urls } = req.body.listing;

  // --- Manual Validation for required fields ---
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim() === "") errors.push("Title is required and cannot be empty.");
  if (!location || typeof location !== 'string' || location.trim() === "") errors.push("Location is required and cannot be empty.");
  if (!country || typeof country !== 'string' || country.trim() === "") errors.push("Country is required and cannot be empty.");
  
  // Validate price: it comes as a string from FormData
  let numericPrice;
  if (price === undefined || price === null || String(price).trim() === "") { // Check original string form
    errors.push("Price is required and cannot be empty.");
  } else {
    numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      errors.push("Price must be a valid non-negative number.");
    }
  }
  
  const activeImageUrls = (image_urls || []).filter(url => url && typeof url === 'string' && url.trim() !== '');
  const uploadedFileCount = req.files ? req.files.length : 0;
  if (activeImageUrls.length === 0 && uploadedFileCount === 0) {
    // This validation is also in Mongoose schema for 'images' array.
    // Keeping it here provides an earlier, more specific error message if preferred.
    errors.push("At least one image (URL or upload) is required.");
  }

  if (errors.length > 0) {
    return next(new ExpressError(400, errors.join(' ')));
  }
  // --- End Manual Validation ---

  const processedImages = processImageInputs(req.files, activeImageUrls);

  const newListingData = {
    title: title.trim(),
    description: description ? description.trim() : "",
    price: numericPrice, // Use the validated numericPrice
    location: location.trim(),
    country: country.trim(),
    category: category || 'Other',
    images: processedImages,
  };

  const listing = new Listing(newListingData);
  listing.owner = req.user._id;

  try {
    const savedListing = await listing.save();
    const populatedListing = await Listing.findById(savedListing._id).populate('owner', 'username profileImageUrl');
    res.status(201).json(populatedListing);
  } catch (dbError) {
    console.error("Database error saving listing:", dbError);
    if (dbError.name === 'ValidationError') {
        const messages = Object.values(dbError.errors).map(val => val.message);
        return next(new ExpressError(400, `Validation error(s): ${messages.join(' ')}`));
    }
    return next(new ExpressError(500, "Failed to save listing to database."));
  }
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username profileImageUrl" },
      options: { sort: { createdAt: -1 } }
    })
    .populate({ path: "owner", select: "username email profileImageUrl" });

  if (!listing) return next(new ExpressError(404, "Listing not found"));
  res.status(200).json(listing);
};

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  const existingListing = await Listing.findById(id);
  if (!existingListing) return next(new ExpressError(404, "Listing not found for update."));

  if (!req.body.listing) {
      return next(new ExpressError(400, "Listing data is missing for update."));
  }
  const { title, description, price, location, country, category, image_urls, existing_images } = req.body.listing;

  const updateData = {};
  const updateErrors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === "") updateErrors.push("Title cannot be empty if provided for update.");
    else updateData.title = title.trim();
  }
  if (description !== undefined) updateData.description = description.trim();

  if (price !== undefined) {
    if (String(price).trim() === "") updateErrors.push("Price cannot be empty if provided for update.");
    else {
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice < 0) updateErrors.push("Price must be a non-negative number if provided for update.");
        else updateData.price = numericPrice;
    }
  }
  if (location !== undefined) {
    if (typeof location !== 'string' || location.trim() === "") updateErrors.push("Location cannot be empty if provided for update.");
    else updateData.location = location.trim();
  }
  if (country !== undefined) {
    if (typeof country !== 'string' || country.trim() === "") updateErrors.push("Country cannot be empty if provided for update.");
    else updateData.country = country.trim();
  }
  if (category !== undefined) updateData.category = category;

  if (updateErrors.length > 0) {
      return next(new ExpressError(400, updateErrors.join(' ')));
  }
  
  const activeNewImageUrls = (image_urls || []).filter(url => url && typeof url === 'string' && url.trim() !== '');
  const activeExistingImages = (existing_images || []).filter(url => url && typeof url === 'string' && url.trim() !== '');
  
  let newlyUploadedImages = [];
  if (req.files && req.files.length > 0) {
    newlyUploadedImages = req.files.map(file => ({
      url: `${serverBaseUrl}/uploads/${file.filename}`, filename: file.filename, isLocal: true
    }));
  }
  const linkedImages = activeNewImageUrls.map(url => ({ url: url, isLocal: false }));
  
  let finalImages = existingListing.images.filter(img => activeExistingImages.includes(img.url));
  finalImages = [...finalImages, ...newlyUploadedImages, ...linkedImages];

  // Check if images are being modified and if the result is empty
  const imageFieldsProvided = (req.files && req.files.length > 0) || image_urls || existing_images;
  if (imageFieldsProvided && finalImages.length === 0) {
      // Mongoose schema will validate this to ensure at least one image.
      // If you want to allow completely empty images, modify the Listing model schema.
      // For now, this will likely trigger a Mongoose validation error if the schema requires at least one image.
  }
  if (imageFieldsProvided) { // Only update images if any image-related field was part of the request
      updateData.images = finalImages;
  }

  if (updateData.images) { // Check if images array exists in updateData before filtering
    const imagesFilenamesToDeleteOnFS = existingListing.images
        .filter(oldImg => oldImg.isLocal && oldImg.filename && !updateData.images.some(newImg => newImg.url === oldImg.url))
        .map(img => img.filename);

    for (const filename of imagesFilenamesToDeleteOnFS) {
        try {
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', filename);
        await fs.access(imagePath); await fs.unlink(imagePath);
        console.log(`Deleted old local image during update: ${filename}`);
        } catch (error) {
        if (error.code === 'ENOENT') console.warn(`Old local image not found for deletion during update: ${filename}`);
        else console.error(`Error deleting old local image ${filename} during update:`, error);
        }
    }
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, { $set: updateData }, {
        new: true, runValidators: true,
    }).populate('owner', 'username profileImageUrl').populate({
        path: "reviews", populate: { path: "author", select: "username profileImageUrl" }
    });

    if (!updatedListing) return next(new ExpressError(404, "Listing not found after attempting update."));
    res.status(200).json(updatedListing);
  } catch (dbError) {
    console.error("Database error updating listing:", dbError);
    if (dbError.name === 'ValidationError') {
        const messages = Object.values(dbError.errors).map(val => val.message);
        return next(new ExpressError(400, `Validation error(s): ${messages.join(', ')}`));
    }
    return next(new ExpressError(500, "Failed to update listing in database."));
  }
};

module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) return next(new ExpressError(404, "Listing not found for deletion"));
  res.status(200).json({ message: "Listing deleted successfully", _id: id });
};