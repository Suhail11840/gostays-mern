import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../services/api'; // Assuming API function
import { FiSave, FiXCircle, FiUploadCloud, FiDollarSign, FiMapPin, FiType, FiFileText } from 'react-icons/fi';
import { InlineLoader } from '../../components/common/FullPageLoader';

const ListingCreatePage = () => {
  const navigate = useNavigate();
  const [listingData, setListingData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image_url: '', // For storing image URL
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Basic validation (more robust validation can be added with libraries like Yup or Zod)
      if (!listingData.title || !listingData.price || !listingData.location || !listingData.country) {
        throw new Error("Title, Price, Location, and Country are required.");
      }
      if (isNaN(parseFloat(listingData.price)) || parseFloat(listingData.price) <= 0) {
          throw new Error("Price must be a positive number.");
      }

      const newListing = await createListing(listingData); // API expects { listing: data } structure
      alert('Listing created successfully!');
      navigate(`/listings/${newListing._id}`); // Navigate to the new listing's detail page
    } catch (err) {
      setError(err.message || 'Failed to create listing.');
      console.error("Create listing error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-6 md:py-10 animate-fadeIn">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-sleek-lg">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-dark mb-8 text-center">
          Create New Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-darkest mb-1">
              <FiType className="inline-block mr-2 mb-px text-primary"/>Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={listingData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Cozy Beachfront Cottage"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-darkest mb-1">
              <FiFileText className="inline-block mr-2 mb-px text-primary"/>Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={listingData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Describe your wonderful place..."
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-darkest mb-1">
              <FiDollarSign className="inline-block mr-2 mb-px text-primary"/>Price (per night)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={listingData.price}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 150"
              required
              min="0"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-darkest mb-1">
              <FiMapPin className="inline-block mr-2 mb-px text-primary"/>Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={listingData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Malibu, California"
              required
            />
          </div>
          
          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-neutral-darkest mb-1">
              <FiMapPin className="inline-block mr-2 mb-px text-primary"/>Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={listingData.country}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., United States"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-neutral-darkest mb-1">
              <FiUploadCloud className="inline-block mr-2 mb-px text-primary"/>Image URL (Optional)
            </label>
            <input
              type="url"
              name="image_url"
              id="image_url"
              value={listingData.image_url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
            {listingData.image_url && (
                <img src={listingData.image_url} alt="Preview" className="mt-3 rounded-lg max-h-48 object-contain border border-neutral-light"/>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              <FiXCircle className="inline-block mr-2 mb-px"/> {error}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <InlineLoader size="text-lg" color="text-white"/> 
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Create Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingCreatePage;