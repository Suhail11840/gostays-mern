import axios from 'axios';
const token = await window.Clerk?.session?.getToken();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Clerk's JWT token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get the token from Clerk
    const token = await window.Clerk?.session?.getToken(); // Use window.Clerk to access global instance
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Listing API Calls ---
export const fetchListings = async () => {
  try {
    const response = await apiClient.get('/listings');
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch listings");
  }
};

export const fetchListingById = async (id) => {
  try {
    const response = await apiClient.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`Failed to fetch listing ${id}`);
  }
};

export const createListing = async (listingData) => {
  // For FormData (if you were using file uploads with Multer on backend)
  // you would set 'Content-Type': 'multipart/form-data' here or it happens automatically.
  // Since we are sending image_url, JSON is fine.
  try {
    // Backend expects { listing: { ... } }
    const response = await apiClient.post('/listings', { listing: listingData });
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to create listing");
  }
};

export const updateListing = async (id, listingData) => {
  try {
    // Backend expects { listing: { ... } }
    const response = await apiClient.put(`/listings/${id}`, { listing: listingData });
    return response.data;
  } catch (error) {
    console.error(`Error updating listing ${id}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`Failed to update listing ${id}`);
  }
};

export const deleteListing = async (id) => {
  try {
    const response = await apiClient.delete(`/listings/${id}`);
    return response.data; // Should be { message: "...", _id: "..." }
  } catch (error) {
    console.error(`Error deleting listing ${id}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`Failed to delete listing ${id}`);
  }
};


// --- Review API Calls ---
export const createReview = async (listingId, reviewData) => {
  try {
    // Backend expects { review: { ... } }
    const response = await apiClient.post(`/listings/${listingId}/reviews`, { review: reviewData });
    return response.data;
  } catch (error) {
    console.error(`Error creating review for listing ${listingId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to create review");
  }
};

export const deleteReview = async (listingId, reviewId) => {
  try {
    const response = await apiClient.delete(`/listings/${listingId}/reviews/${reviewId}`);
    return response.data; // Should be { message: "...", reviewId: "..." }
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`Failed to delete review ${reviewId}`);
  }
};


// --- User API Calls ---
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error)
 {
    console.error("Error fetching current user:", error.response?.data || error.message);
    // Don't throw for 401/404 as it might be an unauthenticated user
    if (error.response?.status === 401 || error.response?.status === 404) {
      return null; // Or handle as appropriate for your app's auth flow
    }
    throw error.response?.data || new Error("Failed to fetch current user");
  }
};

export default apiClient; // Export the configured instance if needed elsewhere directly