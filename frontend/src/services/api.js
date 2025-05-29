import axios from 'axios';

// Ensure VITE_API_BASE_URL is set in your .env.local (e.g., VITE_API_BASE_URL=http://localhost:8080/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending session cookies (e.g., Clerk)
});

/*
  Clerk's <ClerkProvider> and hooks often handle token injection automatically
  for requests made from the browser to your backend if they are on the
  same top-level domain or if CORS is configured correctly.

  If you were to need manual token injection (less common with Clerk's frontend SDK):
  apiClient.interceptors.request.use(async (config) => {
    if (window.Clerk && window.Clerk.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
*/

// --- Listing Services ---
export const getAllListings = () => apiClient.get('/listings');

export const getListingById = (id) => apiClient.get(`/listings/${id}`);

// Handles creating a new listing with FormData (for file uploads)
export const createListing = async (listingPayload, files = []) => {
  // listingPayload is expected to be an object like: { listing: { title: '...', price: '...', image_urls: [], ... } }
  const formData = new FormData();

  if (listingPayload && listingPayload.listing) {
    const listingData = listingPayload.listing;
    for (const key in listingData) {
      if (listingData.hasOwnProperty(key)) {
        if (key === 'image_urls' && Array.isArray(listingData[key])) {
          listingData[key].forEach((url, index) => {
            if (url && typeof url === 'string' && url.trim() !== '') {
              formData.append(`listing[image_urls][${index}]`, url.trim());
            }
          });
        } else if (listingData[key] !== undefined && listingData[key] !== null) {
          // Convert non-File values to string for FormData, except for Files themselves
          formData.append(`listing[${key}]`, String(listingData[key]));
        }
      }
    }
  } else {
    console.error("createListing: listingPayload.listing is undefined or null", listingPayload);
    // Potentially throw an error here or handle as appropriate
  }

  // Append uploaded files
  if (files && Array.isArray(files)) {
    files.forEach((file) => {
      if (file instanceof File) {
        formData.append('listing_images', file); // Key 'listing_images' must match multer fieldname
      }
    });
  }
  
  // Axios will set the Content-Type to multipart/form-data automatically with the correct boundary
  return apiClient.post('/listings', formData);
};

// Handles updating an existing listing with FormData
export const updateListing = async (id, listingUpdatePayload, files = []) => {
  // listingUpdatePayload is expected to be: { listing: { title: '...', existing_images: [], image_urls: [], ... } }
  const formData = new FormData();

  if (listingUpdatePayload && listingUpdatePayload.listing) {
    const listingData = listingUpdatePayload.listing;
    for (const key in listingData) {
      if (listingData.hasOwnProperty(key)) {
        if ((key === 'image_urls' || key === 'existing_images') && Array.isArray(listingData[key])) {
           listingData[key].forEach((item, index) => {
             if (item && typeof item === 'string' && item.trim() !== '') {
              formData.append(`listing[${key}][${index}]`, item.trim());
             }
           });
        } else if (listingData[key] !== undefined && listingData[key] !== null) {
          formData.append(`listing[${key}]`, String(listingData[key]));
        }
      }
    }
  } else {
     console.error("updateListing: listingUpdatePayload.listing is undefined or null", listingUpdatePayload);
  }

  // Append newly uploaded files
  if (files && Array.isArray(files)) {
    files.forEach((file) => {
      if (file instanceof File) {
        formData.append('listing_images', file); // Key 'listing_images'
      }
    });
  }

  return apiClient.put(`/listings/${id}`, formData);
};

export const deleteListing = (id) => apiClient.delete(`/listings/${id}`);


// --- Review Services ---
// Reviews are typically sent as JSON, not FormData
export const createReview = (listingId, reviewPayload) => {
  // reviewPayload is expected to be { review: { rating, comment } }
  return apiClient.post(`/listings/${listingId}/reviews`, reviewPayload); 
};

export const deleteReview = (listingId, reviewId) => {
  return apiClient.delete(`/listings/${listingId}/reviews/${reviewId}`);
};

// --- User Services ---
export const getCurrentUser = () => apiClient.get('/users/me');


// Default export can be the apiClient itself if you want to use it directly for custom calls
// However, exporting named functions is generally cleaner for predefined operations.
// export default apiClient; // Optional