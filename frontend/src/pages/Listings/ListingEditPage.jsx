import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, updateListing } from '../../services/api';
import { FiSave, FiXCircle, FiUploadCloud, FiLink, FiDollarSign, FiType, FiMapPin, FiGlobe, FiTag, FiFileText, FiImage, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';
import FullPageLoader, { InlineLoader } from '../../components/common/FullPageLoader';

const ListingEditPage = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    category: 'Beach',
    image_urls: [''], // For adding new URLs
    existing_images: [], // URLs of existing images to keep (will be populated from fetched listing)
  });
  const [files, setFiles] = useState([]); // For new uploaded files
  const [imagePreviews, setImagePreviews] = useState([]); // For new uploaded files
  const [existingImageObjects, setExistingImageObjects] = useState([]); // To display existing images and manage their removal

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['Beach', 'Mountains', 'City', 'Countryside', 'Unique', 'Trending', 'Cabins', 'Lakefront', 'Other'];

  const fetchListingData = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await getListingById(listingId);
      const fetchedListing = response.data;
      if (fetchedListing) {
        setFormData({
          title: fetchedListing.title || '',
          description: fetchedListing.description || '',
          price: fetchedListing.price?.toString() || '',
          location: fetchedListing.location || '',
          country: fetchedListing.country || '',
          category: fetchedListing.category || 'Beach',
          image_urls: [''], // Start with one empty field for adding new URLs
          existing_images: fetchedListing.images ? fetchedListing.images.map(img => img.url) : [], // URLs of current images to keep
        });
        setExistingImageObjects(fetchedListing.images || []);
      } else {
        throw new Error("Listing not found.");
      }
    } catch (err) {
      console.error("Error fetching listing for edit:", err);
      setError(err.response?.data?.message || "Failed to load listing data for editing.");
    } finally {
      setInitialLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    fetchListingData();
  }, [fetchListingData]);


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
      alert("You can add a maximum of 5 new image URLs.");
    }
  };

  const removeImageUrlField = (index) => {
    const newImageUrls = formData.image_urls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, image_urls: newImageUrls.length > 0 ? newImageUrls : [''] }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    const currentTotalImages = files.length + 
                               formData.existing_images.length + 
                               formData.image_urls.filter(url => url.trim() !== '').length;
    const remainingSlots = 10 - currentTotalImages;

    if (imageFiles.length > remainingSlots && remainingSlots >=0) {
        alert(`You can have a maximum of 10 images in total. You can add ${remainingSlots} more. ${imageFiles.length - remainingSlots} file(s) were not added.`);
    }
    const filesToActuallyAdd = imageFiles.slice(0, Math.max(0, remainingSlots));

    setFiles(prevFiles => [...prevFiles, ...filesToActuallyAdd]);
    const newPreviews = filesToActuallyAdd.map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeNewUploadedFile = (indexToRemove) => {
    const removedPreview = imagePreviews[indexToRemove];
    if (removedPreview) URL.revokeObjectURL(removedPreview.url);
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const toggleExistingImageKeep = (imageUrl) => {
    setFormData(prev => {
      const currentlyKeeping = prev.existing_images.includes(imageUrl);
      if (currentlyKeeping) {
        return { ...prev, existing_images: prev.existing_images.filter(url => url !== imageUrl) };
      } else {
        return { ...prev, existing_images: [...prev.existing_images, imageUrl] };
      }
    });
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
    
    const activeNewImageUrls = formData.image_urls.filter(url => url && url.trim() !== '');
    if (files.length === 0 && activeNewImageUrls.length === 0 && formData.existing_images.length === 0) {
        setError("Please provide or keep at least one image.");
        setLoading(false);
        return;
    }

    const payloadForApi = {
      listing: {
        title: formData.title,
        description: formData.description,
        price: numericPrice,
        location: formData.location,
        country: formData.country,
        category: formData.category,
        image_urls: activeNewImageUrls, // New URLs to be added
        existing_images: formData.existing_images, // URLs of existing images to keep
      }
    };

    try {
      const response = await updateListing(listingId, payloadForApi, files);
      setSuccess(`Listing "${response.data.title}" updated successfully! Redirecting...`);
      
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url)); // Clean up new file previews
      // No need to clear main form, user might want to make further edits or see success
      
      setTimeout(() => {
        navigate(`/listings/${listingId}`);
      }, 2000);

    } catch (err) {
      console.error("Update listing error:", err.response || err);
      const backendError = err.response?.data?.message || "Failed to update listing. Please check your input.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <FullPageLoader message="Loading listing data for editing..." />;
  }

  if (error && !formData.title && initialLoading === false) { // Error occurred during initial fetch
    return (
      <div className="container-app py-10 text-center text-red-600 bg-red-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error Loading Listing</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/listings')} className="mt-4 btn btn-primary">Back to Listings</button>
      </div>
    );
  }


  return (
    <div className="container-app max-w-3xl mx-auto py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-8 text-center">
        Edit Your Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-10 rounded-2xl shadow-sleek-lg">
        {error && !loading && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center" role="alert"><FiXCircle className="mr-2 h-5 w-5"/>{error}</div>}
        {success && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">{success}</div>}

        {/* Fields: Title, Price, Description, Location, Country, Category (same as create) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="form-label form-label-required"><FiType className="mr-2 text-primary" />Listing Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="price" className="form-label form-label-required"><span className="mr-1 opacity-90 font-sans text-primary">₹</span>Price (per night)</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="input-field" min="0" step="0.01" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="form-label"><FiFileText className="mr-2 text-primary" />Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="5" className="input-field"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="form-label form-label-required"><FiMapPin className="mr-2 text-primary" />Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="country" className="form-label form-label-required"><FiGlobe className="mr-2 text-primary" />Country</label>
            <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div>
            <label htmlFor="category" className="form-label"><FiTag className="mr-2 text-primary" />Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        {/* Manage Existing Images */}
        {existingImageObjects.length > 0 && (
          <div className="space-y-3 border p-4 rounded-lg border-neutral-light bg-white">
            <h3 className="text-lg font-medium text-secondary">Manage Existing Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {existingImageObjects.map((image) => (
                <div key={image.url} className="relative group aspect-w-1 aspect-h-1">
                  <img src={image.url} alt="Existing listing" className="w-full h-full object-cover rounded-md shadow-md border border-neutral-light" />
                  <button
                    type="button"
                    onClick={() => toggleExistingImageKeep(image.url)}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-md 
                                transition-all duration-200 text-white text-xs font-semibold
                                ${formData.existing_images.includes(image.url) 
                                    ? 'bg-green-600/70 hover:bg-green-700/80' 
                                    : 'bg-red-600/70 hover:bg-red-700/80'}`}
                  >
                    {formData.existing_images.includes(image.url) ? 'KEEPING' : 'MARK TO REMOVE'}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-dark">Click on an image to mark it for removal. Images marked 'KEEPING' will be retained.</p>
          </div>
        )}

        {/* Add New Image URLs (same as create) */}
        <div className="space-y-3 border p-4 rounded-lg border-neutral-light bg-white">
          <h3 className="text-lg font-medium text-secondary flex items-center"><FiLink className="mr-2 text-primary" /> Add New Image URLs (Max 5 new)</h3>
          {formData.image_urls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="url" placeholder={`New Image URL ${index + 1}`} value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} className="input-field flex-grow !py-2" />
              {(formData.image_urls.length > 1 || (formData.image_urls.length === 1 && url.trim() !== '')) && (
                <button type="button" onClick={() => removeImageUrlField(index)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"><FiTrash2 size={18} /></button>
              )}
            </div>
          ))}
          {formData.image_urls.length < 5 && (
            <button type="button" onClick={addImageUrlField} className="btn btn-outline-primary btn-sm text-xs !px-3 !py-1.5 flex items-center mt-2"><FiPlus className="mr-1" /> Add URL Field</button>
          )}
        </div>

        {/* Upload New Images (same as create) */}
        <div className="space-y-3 border p-4 rounded-lg border-neutral-light bg-white">
            <h3 className="text-lg font-medium text-secondary flex items-center"><FiUploadCloud className="mr-2 text-primary" /> Upload New Images (Max 10 total with existing & new URLs)</h3>
            <input type="file" name="listing_images_new" id="listing_images_new" multiple accept="image/*" onChange={handleFileChange} className="input-field-file" />
            {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {imagePreviews.map((preview, index) => ( /* Previews for NEWLY uploaded files */
                    <div key={index} className="relative group aspect-w-1 aspect-h-1">
                      <img src={preview.url} alt={`Preview ${preview.name}`} className="w-full h-full object-cover rounded-md shadow-md border" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-md">
                        <button type="button" onClick={() => removeNewUploadedFile(index)} className="text-white opacity-0 group-hover:opacity-100 p-1.5 bg-red-600 rounded-full hover:bg-red-700"><FiTrash2 size={14} /></button>
                      </div>
                      <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-[10px] p-1 truncate rounded-b-md" title={preview.name}>{preview.name}</p>
                    </div>
                ))}
                </div>
            )}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button type="button" onClick={() => navigate(`/listings/${listingId}`)} className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1" disabled={loading}><FiXCircle className="mr-2"/>Cancel</button>
            <button type="submit" disabled={loading || initialLoading} className="btn btn-primary text-lg flex items-center justify-center min-w-[180px] w-full sm:w-auto order-1 sm:order-2">
                {loading ? <InlineLoader size="text-xl" color="text-white"/> : <><FiSave className="mr-2"/> Save Changes</>}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ListingEditPage;