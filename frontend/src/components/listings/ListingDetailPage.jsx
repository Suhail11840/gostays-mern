import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById, createReview, deleteReview, deleteListing } from '../../services/api';
import { useAuth, SignedIn, SignedOut } from '@clerk/clerk-react';
import ImageCarousel from '../../components/common/ImageCarousel';
import FullPageLoader, { InlineLoader } from '../../components/common/FullPageLoader';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FiMapPin, FiDollarSign, FiMessageSquare, FiStar, FiEdit, FiTrash2, FiUser, FiCalendar, FiTag, FiSend, FiChevronLeft } from 'react-icons/fi'; // Icons

// Star Rating Component (simple version)
const StarRating = ({ rating, onRatingChange, editable = true }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FiStar
            key={index}
            className={`cursor-pointer text-2xl transition-colors duration-200 
              ${starValue <= rating ? 'text-yellow-400 fill-current' : 'text-neutral-light'}
              ${editable ? 'hover:text-yellow-500' : 'cursor-default'}`}
            onClick={() => editable && onRatingChange && onRatingChange(starValue)}
          />
        );
      })}
    </div>
  );
};


const ListingDetailPage = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const { userId, isLoaded: authLoaded } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchListingDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getListingById(listingId);
      setListing(response.data);
    } catch (err) {
      console.error("Error fetching listing details:", err);
      setError(err.response?.data?.message || "Failed to load listing details.");
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    if (listingId) {
      fetchListingDetails();
    }
  }, [listingId, fetchListingDetails]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setReviewData(prev => ({ ...prev, rating: newRating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.rating || !reviewData.comment.trim()) {
      setReviewError("Please provide a rating and a comment.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      await createReview(listingId, { review: reviewData });
      setReviewData({ rating: 0, comment: '' }); // Reset form
      fetchListingDetails(); // Re-fetch listing to show new review
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewDelete = async (reviewIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(listingId, reviewIdToDelete);
        fetchListingDetails(); // Re-fetch to update review list
      } catch (err) {
        console.error("Error deleting review:", err);
        alert(err.response?.data?.message || "Failed to delete review.");
      }
    }
  };
  
  const handleListingDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this listing? This action cannot be undone.")) {
        setLoading(true); // Use main page loader
        try {
            await deleteListing(listingId);
            navigate('/listings', { state: { message: `Listing "${listing.title}" deleted successfully.` } });
        } catch (err) {
            console.error("Error deleting listing:", err);
            setError(err.response?.data?.message || "Failed to delete listing.");
            setLoading(false);
        }
    }
  };


  if (loading || !authLoaded) {
    return <FullPageLoader message="Loading listing details..." />;
  }

  if (error) {
    return <div className="container-app text-center py-10 text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  if (!listing) {
    return <div className="container-app text-center py-10">Listing not found.</div>;
  }

  const isOwner = authLoaded && userId && listing.owner?._id === userId; // Clerk's userId is our DB User _id due to sync
  
  // Calculate average rating
  const averageRating = listing.reviews && listing.reviews.length > 0
    ? (listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length)
    : 0;


  return (
    <div className="container-app">
        <Link to="/listings" className="inline-flex items-center text-primary hover:text-primary-dark mb-6 group">
            <FiChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform duration-200" /> Back to Listings
        </Link>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sleek-lg">
        {/* Listing Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-2">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-neutral-dark space-x-4">
            <span className="flex items-center"><FiMapPin className="mr-1 text-primary" /> {listing.location}, {listing.country}</span>
            <span className="flex items-center"><FiTag className="mr-1 text-primary" /> {listing.category}</span>
            {listing.reviews.length > 0 && (
                 <span className="flex items-center">
                    <StarRating rating={averageRating} editable={false} /> 
                    <span className="ml-2">({averageRating.toFixed(1)} from {listing.reviews.length} reviews)</span>
                 </span>
            )}
          </div>
        </header>

        {/* Image Carousel & Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ImageCarousel images={listing.images} altText={listing.title} className="w-full h-72 md:h-[500px] rounded-lg" />
          </div>
          <div className="lg:col-span-1 bg-neutral-lightest p-6 rounded-lg shadow-md">
            <h2 className="font-display text-2xl font-semibold text-secondary mb-4">Host Information</h2>
            {listing.owner ? (
              <div className="flex items-center mb-4">
                <img 
                    src={listing.owner.profileImageUrl || `https://ui-avatars.com/api/?name=${listing.owner.username}&background=random&size=128`} 
                    alt={listing.owner.username}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-neutral-darkest">{listing.owner.username}</p>
                  {/* <p className="text-sm text-neutral-dark">{listing.owner.email}</p> */}
                </div>
              </div>
            ) : (
              <p className="text-neutral-dark">Host information not available.</p>
            )}
            
            <div className="text-4xl font-bold text-primary mb-4 flex items-center">
                <FiDollarSign className="opacity-75" />{listing.price} 
                <span className="text-lg text-neutral-dark ml-1">/ night</span>
            </div>
            
            <SignedIn>
              <button className="btn btn-primary w-full text-lg mb-3">Request to Book</button>
            </SignedIn>
            <SignedOut>
                 <Link to={`/sign-in?redirect_url=${window.location.pathname}`} className="btn btn-primary w-full text-lg mb-3 text-center">
                    Sign in to Book
                </Link>
            </SignedOut>
            
            {isOwner && (
              <div className="mt-6 pt-4 border-t border-neutral-light flex space-x-3">
                <Link to={`/listings/${listing._id}/edit`} className="btn btn-secondary btn-sm flex-1 text-center">
                  <FiEdit className="inline mr-1" /> Edit
                </Link>
                <button onClick={handleListingDelete} className="btn btn-outline-primary border-red-500 text-red-500 hover:bg-red-500 hover:text-white btn-sm flex-1">
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-secondary mb-3">About this place</h2>
          <p className="text-neutral-darkest leading-relaxed whitespace-pre-wrap">{listing.description || "No description provided."}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-secondary mb-4 flex items-center">
            <FiMessageSquare className="mr-2"/> Reviews ({listing.reviews.length})
          </h2>
          
          <SignedIn>
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-neutral-lightest rounded-lg shadow">
              <h3 className="text-lg font-semibold text-neutral-darkest mb-2">Leave a Review</h3>
              {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
              <div className="mb-3">
                <label className="block text-sm font-medium text-neutral-darkest mb-1">Rating <span className="text-red-500">*</span></label>
                <StarRating rating={reviewData.rating} onRatingChange={handleRatingChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="block text-sm font-medium text-neutral-darkest mb-1">Comment <span className="text-red-500">*</span></label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="3"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  className="input-field"
                  placeholder="Share your experience..."
                  required
                ></textarea>
              </div>
              <button type="submit" disabled={reviewSubmitting} className="btn btn-primary btn-sm flex items-center">
                {reviewSubmitting ? <InlineLoader size="text-lg" color="text-white" /> : <><FiSend className="mr-2" /> Submit Review</>}
              </button>
            </form>
          </SignedIn>
          <SignedOut>
            <p className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md text-center">
              <Link to={`/sign-in?redirect_url=${window.location.pathname}`} className="font-semibold hover:underline">Sign in</Link> to leave a review.
            </p>
          </SignedOut>

          {listing.reviews.length > 0 ? (
            <div className="space-y-6">
              {listing.reviews.map((review) => (
                <div key={review._id} className="p-4 border border-neutral-light rounded-lg shadow-sm bg-white">
                  <div className="flex items-start mb-2">
                    <img 
                        src={review.author?.profileImageUrl || `https://ui-avatars.com/api/?name=${review.author?.username || 'User'}&background=random&size=96`} 
                        alt={review.author?.username || 'Anonymous'} 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                        <p className="font-semibold text-neutral-darkest">{review.author?.username || 'Anonymous User'}</p>
                        <p className="text-xs text-neutral-dark">
                            <FiCalendar className="inline mr-1" /> 
                            {formatDistanceToNow(parseISO(review.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <StarRating rating={review.rating} editable={false} />
                    </div>
                  </div>
                  <p className="text-neutral-darkest text-sm leading-relaxed mb-2">{review.comment}</p>
                  {authLoaded && userId && review.author?._id === userId && (
                     <button 
                        onClick={() => handleReviewDelete(review._id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center"
                        aria-label="Delete review"
                    >
                       <FiTrash2 className="mr-1" /> Delete my review
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-dark">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;