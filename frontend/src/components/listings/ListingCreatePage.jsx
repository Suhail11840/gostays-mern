import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../services/api';
// Removed useAuth as it's not directly used here if apiClient handles tokens
import { FiPlus, FiTrash2, FiUploadCloud, FiLink, FiDollarSign, FiType, FiMapPin, FiGlobe, FiTag, FiFileText, FiSave, FiXCircle, FiPlusCircle } from 'react-icons/fi';
import { InlineLoader } from '../../components/common/FullPageLoader';

const ListingCreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    category: 'Beach',
    image_urls: [''], 
  });
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['Beach', 'Mountains', 'City', 'Countryside', 'Unique', 'Trending', 'Cabins', 'Lakefront', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.image_urls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, image_urls: newImageUrls }));
  };

  const addImageUrlField = () => {
    if (formData.image_urls.length < 5) {
      setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ''] }));
    } else {
      alert("You can add a maximum of 5 image URLs.");
    }
  };

  const removeImageUrlField = (index) => {
    const newImageUrls = formData.image_urls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, image_urls: newImageUrls.length > 0 ? newImageUrls : [''] }));
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    const currentImageCount = files.length + formData.image_urls.filter(url => url.trim() !== '').length;
    const remainingSlots = 10 - currentImageCount;

    if (imageFiles.length > remainingSlots && remainingSlots >=0 ) {
        alert(`You can add ${remainingSlots} more image(s). ${imageFiles.length - remainingSlots} file(s) were not added.`);
    }
    
    const filesToActuallyAdd = imageFiles.slice(0, Math.max(0, remainingSlots));

    setFiles(prevFiles => [...prevFiles, ...filesToActuallyAdd]);

    const newPreviews = filesToActuallyAdd.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeFile = (indexToRemove) => {
    const removedPreview = imagePreviews[indexToRemove];
    if (removedPreview) URL.revokeObjectURL(removedPreview.url);

    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    const { title, price, location, country } = formData;
    if (!title.trim() || !price.trim() || !location.trim() || !country.trim()) {
        setError("Title, Price, Location, and Country are required.");
        setLoading(false);
        return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
        setError("Price must be a positive number.");
        setLoading(false);
        return;
    }
    
    const activeImageUrls = formData.image_urls.filter(url => url && url.trim() !== '');
    if (files.length === 0 && activeImageUrls.length === 0) {
        setError("Please provide at least one image (either upload or URL).");
        setLoading(false);
        return;
    }
    
    const payloadForApi = {
      listing: {
        ...formData,
        image_urls: activeImageUrls,
        price: numericPrice, // Send as number
      }
    };

    try {
      const response = await createListing(payloadForApi, files); 
      setSuccess(`Listing "${response.data.title}" created successfully! Redirecting...`);
      
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      setFormData({ title: '', description: '', price: '', location: '', country: '', category: 'Beach', image_urls: [''] });
      setFiles([]);
      setImagePreviews([]);

      setTimeout(() => {
        navigate(`/listings/${response.data._id}`);
      }, 2000);

    } catch (err) {
      console.error("Create listing error:", err.response || err);
      const backendError = err.response?.data?.message || "Failed to create listing. Please check your input and try again.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-8 text-center">
        Share Your Place with GoStays
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl shadow-sleek-lg">
        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center" role="alert"><FiXCircle className="mr-2 h-5 w-5"/>{error}</div>}
        {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="form-label form-label-required">
              <FiType className="mr-2 text-primary" />Listing Title
            </label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g., Sunny Beachfront Villa" />
          </div>
          <div>
            <label htmlFor="price" className="form-label form-label-required">
              <FiDollarSign className="mr-2 text-primary" />Price (per night)
            </label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="input-field" placeholder="e.g., 250" min="0" step="0.01" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            <FiFileText className="mr-2 text-primary" />Description
          </label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="5" className="input-field" placeholder="Tell us about your amazing place, its amenities, and what makes it special..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="form-label form-label-required">
              <FiMapPin className="mr-2 text-primary" />Location (City, State/Region)
            </label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="e.g., Miami, Florida" />
          </div>
          <div>
            <label htmlFor="country" className="form-label form-label-required">
              <FiGlobe className="mr-2 text-primary" />Country
            </label>
            <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="input-field" placeholder="e.g., USA" />
          </div>
        </div>

        <div>
            <label htmlFor="category" className="form-label">
                <FiTag className="mr-2 text-primary" />Category
            </label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        <div className="space-y-3 border p-4 rounded-lg border-neutral-light bg-white">
          <h3 className="text-lg font-medium text-secondary flex items-center">
            <FiLink className="mr-2 text-primary" /> Add Image URLs (Optional, max 5)
          </h3>
          {formData.image_urls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="url"
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                className="input-field flex-grow !py-2"
              />
              {(formData.image_urls.length > 1 || (formData.image_urls.length === 1 && url.trim() !== '')) && (
                <button type="button" onClick={() => removeImageUrlField(index)} className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-100">
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>
          ))}
          {formData.image_urls.length < 5 && (
            <button type="button" onClick={addImageUrlField} className="btn btn-outline-primary btn-sm text-xs !px-3 !py-1.5 flex items-center mt-2">
              <FiPlus className="mr-1" /> Add URL Field
            </button>
          )}
        </div>

        <div className="space-y-3 border p-4 rounded-lg border-neutral-light bg-white">
            <h3 className="text-lg font-medium text-secondary flex items-center">
                <FiUploadCloud className="mr-2 text-primary" /> Upload Images (Optional, max 10 total with URLs)
            </h3>
            <input
                type="file"
                name="listing_images"
                id="listing_images"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-neutral-darkest file:transition-all
                            file:mr-4 file:py-2 file:px-4 file:cursor-pointer
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary-light file:text-primary
                            hover:file:bg-primary hover:file:text-white"
            />
            {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-w-1 aspect-h-1">
                      <img src={preview.url} alt={`Preview ${preview.name}`} className="w-full h-full object-cover rounded-md shadow-md border border-neutral-light" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center rounded-md">
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            aria-label="Remove image"
                        >
                            <FiTrash2 size={14} />
                        </button>
                      </div>
                      <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-[10px] p-1 truncate rounded-b-md" title={preview.name}>
                          {preview.name}
                      </p>
                    </div>
                ))}
                </div>
            )}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1" disabled={loading}>
                <FiXCircle className="mr-2"/>Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary text-lg flex items-center justify-center min-w-[180px] w-full sm:w-auto order-1 sm:order-2"
            >
                {loading ? <InlineLoader size="text-xl" color="text-white"/> : <><FiSave className="mr-2"/> Create Listing</>}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ListingCreatePage;