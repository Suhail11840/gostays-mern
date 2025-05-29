import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllListings } from '../../services/api.js'; // <<<< MAKE ABSOLUTELY SURE THIS LINE IS EXACTLY THIS
import ListingCard from '../../components/listings/ListingCard';
import { InlineLoader } from '../../components/common/FullPageLoader';
import { FiFilter, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import { FaThList, FaThLarge } from 'react-icons/fa';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const categories = ['All', 'Beach', 'Mountains', 'City', 'Countryside', 'Unique', 'Trending', 'Cabins', 'Lakefront', 'Other'];

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        // Clear state from history to prevent message re-appearing on back/forward
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchListingsData = async () => {
      console.log("ListingsPage: Attempting to fetch listings..."); // For debugging
      try {
        setLoading(true);
        setError(null);
        const response = await getAllListings(); // <<<< USING THE CORRECT IMPORTED FUNCTION
        console.log("ListingsPage: API response received", response); // For debugging
        setListings(response.data || []);
      } catch (err) {
        console.error("ListingsPage: Error fetching listings:", err.response || err.message || err);
        setError(err.response?.data?.message || "Failed to fetch listings. Please try again.");
        setListings([]);
      } finally {
        setLoading(false);
        console.log("ListingsPage: Fetching finished."); // For debugging
      }
    };

    fetchListingsData();
  }, []);

  const filteredListings = listings.filter(listing => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearchTerm =
        (listing.title && listing.title.toLowerCase().includes(searchLower)) ||
        (listing.location && listing.location.toLowerCase().includes(searchLower)) ||
        (listing.country && listing.country.toLowerCase().includes(searchLower));

    const matchesCategory =
        selectedCategory === 'All' ||
        selectedCategory === '' ||
        !listing.category || // if listing has no category, it should pass if 'All' is selected
        listing.category === selectedCategory;

    return matchesSearchTerm && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <InlineLoader size="text-6xl" />
        <p className="mt-6 text-xl text-neutral-dark font-medium animate-pulseHalka">
          Loading amazing stays...
        </p>
      </div>
    );
  }

  return (
    <div className="container-app py-6 md:py-10">
      <header className="mb-8 md:mb-12 text-center pt-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-3">
          Explore Our Stays
        </h1>
        <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
          Find your next adventure. Browse through our curated collection of unique homes and experiences.
        </p>
      </header>

      {successMessage && (
        <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg shadow-md flex items-center" role="alert">
          <FiAlertTriangle className="mr-2 text-green-500" size={20}/> {successMessage}
        </div>
      )}

      {error && !loading && (
         <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md flex items-center" role="alert">
          <FiAlertTriangle className="mr-2 text-red-500" size={20}/> {error}
        </div>
      )}

      <div className="mb-8 p-4 md:p-6 bg-white rounded-xl shadow-sleek sticky top-20 z-30 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by title, location..."
            className="input-field pl-10 w-full !py-2.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search listings"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark pointer-events-none" />
        </div>
        <div className="relative flex-grow w-full md:w-1/3">
          <select
            className="input-field appearance-none w-full pr-10 !py-2.5"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
            ))}
          </select>
           <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-dark pointer-events-none" />
        </div>
        <div className="flex items-center justify-end md:justify-start w-full md:w-auto space-x-2">
            <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Switch to grid view"
                className={`p-2.5 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'bg-neutral-light text-neutral-darkest hover:bg-primary-light hover:text-white'} transition-colors`}
            >
                <FaThLarge size={18}/>
            </button>
            <button
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="Switch to list view"
                className={`p-2.5 rounded-md ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'bg-neutral-light text-neutral-darkest hover:bg-primary-light hover:text-white'} transition-colors`}
            >
                <FaThList size={18}/>
            </button>
        </div>
      </div>

      {!loading && filteredListings.length > 0 ? (
        <div className={`
            ${viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'
                : 'space-y-6 md:space-y-8'}
        `}>
          {filteredListings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        !loading && !error && (
            <div className="text-center py-20 min-h-[40vh] flex flex-col items-center justify-center">
                <FiAlertTriangle size={48} className="text-primary-light mb-4"/>
              <p className="text-xl text-neutral-darkest font-semibold">No listings found.</p>
              <p className="text-neutral-dark">Try adjusting your search or filters, or check back later!</p>
            </div>
        )
      )}
    </div>
  );
};

export default ListingsPage;