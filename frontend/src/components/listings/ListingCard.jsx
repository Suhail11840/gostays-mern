import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiStar, FiChevronRight, FiUsers } from 'react-icons/fi'; // Added FiUsers
import ImageCarousel from '../common/ImageCarousel'; // Ensure this path is correct

const ListingCard = ({ listing, viewMode = 'grid' }) => {
  if (!listing || !listing._id) { // Added check for listing._id to prevent errors with incomplete data
    // You could return a skeleton or null
    return (
        <div className={`card animate-pulseHalka ${viewMode === 'grid' ? 'flex flex-col' : 'flex flex-col md:flex-row'}`}>
            <div className={`bg-neutral-light ${viewMode === 'grid' ? 'h-56 w-full' : 'md:w-2/5 lg:w-1/3 xl:w-1/4 h-56 md:h-full'}`}></div>
            <div className="p-5 flex-grow flex flex-col">
                <div className="h-4 bg-neutral-light rounded w-1/4 mb-3"></div>
                <div className="h-6 bg-neutral-light rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-light rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-neutral-light rounded w-full mb-4"></div>
                <div className="mt-auto flex justify-between items-center">
                    <div className="h-6 bg-neutral-light rounded w-1/4"></div>
                    <div className="h-8 bg-neutral-light rounded-lg w-1/3"></div>
                </div>
            </div>
        </div>
    );
  }

  const averageRating = listing.reviews && listing.reviews.length > 0
    ? (listing.reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0) / listing.reviews.length).toFixed(1)
    : null;

  const commonCardClasses = "card transform hover:-translate-y-1 transition-all duration-300 overflow-hidden";

  if (viewMode === 'list') {
    return (
      <div className={`${commonCardClasses} flex flex-col md:flex-row h-full`}>
        <Link to={`/listings/${listing._id}`} className="block group md:w-2/5 lg:w-1/3 xl:w-1/4 flex-shrink-0">
          <ImageCarousel 
            images={listing.images} 
            altText={listing.title}
            className="w-full h-56 md:h-full object-cover" 
          />
        </Link>
        <div className="p-5 flex-grow flex flex-col md:w-3/5 lg:w-2/3 xl:w-3/4">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 text-[11px] font-semibold text-primary bg-primary-light/20 rounded-full uppercase tracking-wider whitespace-nowrap">
              {listing.category || 'Misc'}
            </span>
            {averageRating && (
              <div className="flex items-center text-sm text-yellow-500">
                <FiStar className="mr-1 fill-current" /> {averageRating}
                <span className="text-neutral-dark ml-1 text-xs">({listing.reviews.length} {listing.reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}
          </div>

          <Link to={`/listings/${listing._id}`} className="block group">
            <h3 className="font-display text-lg md:text-xl font-semibold text-secondary group-hover:text-primary transition-colors truncate mb-1" title={listing.title}>
              {listing.title}
            </h3>
          </Link>
          <div className="flex items-center text-xs md:text-sm text-neutral-dark mb-3">
            <FiMapPin className="mr-1.5 text-primary flex-shrink-0" />
            <span className="truncate" title={`${listing.location}, ${listing.country}`}>
              {listing.location}, {listing.country}
            </span>
          </div>
          
          <p className="text-neutral-darkest text-sm mb-4 line-clamp-2 md:line-clamp-3 flex-grow">
            {listing.description || "No description available."}
          </p>
          
          {listing.owner && (
             <div className="flex items-center text-xs text-neutral-dark mb-4 mt-auto pt-2 border-t border-neutral-light/50">
                <FiUsers className="mr-1.5 text-primary" /> Hosted by <span className="font-medium ml-1 text-secondary">{listing.owner.username}</span>
             </div>
          )}


          <div className="mt-auto pt-3 border-t border-neutral-light flex items-center justify-between">
            <div className="flex items-baseline text-primary font-semibold text-lg">
              <FiDollarSign size={16} className="mr-0.5 opacity-90" />
              {listing.price} 
              <span className="text-xs text-neutral-dark ml-1 font-normal">/ night</span>
            </div>
            <Link
              to={`/listings/${listing._id}`}
              className="btn btn-primary btn-sm !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm flex items-center whitespace-nowrap" // smaller padding for list view button
            >
              View Details <FiChevronRight className="ml-1 hidden sm:inline" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (default)
  return (
    <div className={`${commonCardClasses} flex flex-col h-full`}>
      <Link to={`/listings/${listing._id}`} className="block group">
        <ImageCarousel 
            images={listing.images} 
            altText={listing.title}
            className="w-full h-56 object-cover" // Fixed height for grid consistency
        />
      </Link>
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-primary bg-primary-light/20 rounded-full uppercase tracking-wider whitespace-nowrap">
                {listing.category || 'Misc'}
            </span>
            {averageRating && (
            <div className="flex items-center text-xs sm:text-sm text-yellow-500">
                <FiStar className="mr-1 fill-current" /> {averageRating}
                <span className="text-neutral-dark ml-1 text-[10px] sm:text-xs">({listing.reviews.length})</span>
            </div>
            )}
        </div>

        <Link to={`/listings/${listing._id}`} className="block group">
          <h3 className="font-display text-md sm:text-lg font-semibold text-secondary group-hover:text-primary transition-colors truncate mb-1" title={listing.title}>
            {listing.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs sm:text-sm text-neutral-dark mb-3">
          <FiMapPin className="mr-1.5 text-primary flex-shrink-0" />
          <span className="truncate" title={`${listing.location}, ${listing.country}`}>
            {listing.location}, {listing.country}
          </span>
        </div>
        
        <p className="text-neutral-darkest text-xs sm:text-sm mb-4 line-clamp-3 flex-grow">
          {listing.description || "No description available."}
        </p>

        {listing.owner && (
             <div className="flex items-center text-xs text-neutral-dark mb-3 mt-auto pt-2 border-t border-neutral-light/50">
                <FiUsers className="mr-1.5 text-primary" /> By <span className="font-medium ml-1 text-secondary">{listing.owner.username}</span>
             </div>
        )}

        <div className="mt-auto pt-2 sm:pt-3 border-t border-neutral-light flex items-center justify-between">
          <div className="flex items-baseline text-primary font-semibold text-md sm:text-lg">
            <FiDollarSign size={14} sm:size={16} className="mr-0.5 opacity-90" />
            {listing.price} 
            <span className="text-[10px] sm:text-xs text-neutral-dark ml-1 font-normal">/ night</span>
          </div>
          <Link
            to={`/listings/${listing._id}`}
            className="btn btn-primary btn-sm !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm flex items-center whitespace-nowrap"
          >
            Details <FiChevronRight className="ml-1 hidden sm:inline" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;