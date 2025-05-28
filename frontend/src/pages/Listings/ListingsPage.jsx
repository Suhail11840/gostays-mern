import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings } from '../../services/api';
import { FiMapPin, FiDollarSign, FiPlusCircle, FiFilter, FiImage, FiLoader } from 'react-icons/fi';
import { InlineLoader } from '../../components/common/FullPageLoader'; // Using the inline loader

// Placeholder for ListingCard component - we'll create this later
const ListingCard = ({ listing }) => {
  return (
    <Link to={`/listings/${listing._id}`} className="block group card animate-fadeIn">
      <div className="relative">
        <img
          src={listing.image?.url || 'https://via.placeholder.com/400x300.png?text=GoStays+Listing'}
          alt={listing.title}
          className="w-full h-56 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          <FiDollarSign className="inline-block mr-1 mb-px" />
          {listing.price.toLocaleString()} / night
        </div>
         {/* Optional: Add owner avatar if available */}
        {listing.owner && (
          <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
            {/* Assuming owner might have a profileImageUrl in future */}
            {/* <img src={listing.owner.profileImageUrl || `https://ui-avatars.com/api/?name=${listing.owner.username}&background=random`} alt={listing.owner.username} className="w-5 h-5 rounded-full mr-1.5"/> */}
            <span>By {listing.owner.username}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-display font-semibold text-secondary-dark mb-1 truncate group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center text-neutral-dark text-sm mb-3">
          <FiMapPin className="mr-1.5 text-primary" />
          <span>{listing.location}, {listing.country}</span>
        </div>
        <p className="text-neutral-dark text-sm mb-4 line-clamp-3">
          {listing.description}
        </p>
        {/* Could add rating here later */}
      </div>
    </Link>
  );
};


const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // TODO: Add state for filters, search term, pagination

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchListings();
        setListings(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch listings.');
        console.error("Fetch listings error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, []);

  return (
    <div className="container-app py-6 md:py-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-dark">
          Explore Stays
        </h1>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline-primary text-sm px-4 py-2 flex items-center">
            <FiFilter className="mr-2" /> Filters
          </button>
          <Link to="/listings/new" className="btn btn-primary text-sm px-4 py-2 flex items-center">
            <FiPlusCircle className="mr-2" /> Add New Listing
          </Link>
        </div>
      </div>

      {/* TODO: Add Filters/Search Bar section here */}
      {/* <div className="mb-8 p-6 bg-white rounded-xl shadow-sleek"> ... filters ... </div> */}

      {loading && (
        <div className="text-center py-10">
          <InlineLoader size="text-5xl" />
          <p className="mt-3 text-neutral-dark font-medium">Loading amazing stays...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-10 bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">Oops! Something went wrong.</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 btn btn-primary text-sm">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="text-center py-20">
          <FiImage className="mx-auto text-6xl text-neutral-light mb-4" />
          <h2 className="text-2xl font-semibold text-secondary-dark mb-2">No Listings Found</h2>
          <p className="text-neutral-dark">
            It seems there are no stays available right now. Why not be the first to add one?
          </p>
          <Link to="/listings/new" className="mt-6 btn btn-primary">
            Add Your Listing
          </Link>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      {/* TODO: Add Pagination controls here */}
      {/* <div className="mt-12 flex justify-center"> ... pagination ... </div> */}
    </div>
  );
};

export default ListingsPage;