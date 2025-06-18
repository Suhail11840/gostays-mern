import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById, createReview, deleteReview, deleteListing, getCurrentUser } from '../../services/api'; 
import { useAuth, SignedIn, SignedOut } from '@clerk/clerk-react'; // SignedIn, SignedOut implicitly use isSignedIn
import ImageCarousel from '../../components/common/ImageCarousel';
import FullPageLoader, { InlineLoader } from '../../components/common/FullPageLoader';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FiMapPin, FiDollarSign, FiMessageSquare, FiStar, FiEdit, FiTrash2, FiUser, FiCalendar, FiTag, FiSend, FiChevronLeft, FiShare2, FiHeart } from 'react-icons/fi';

// Star Rating Component
const StarRating = ({ rating, onRatingChange, editable = true, size = "text-2xl" }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FiStar
            key={index}
            className={`cursor-pointer ${size} transition-colors duration-200 
              ${starValue <= rating ? 'text-yellow-400 fill-current' : 'text-neutral-light'}
              ${editable ? 'hover:text-yellow-300 active:text-yellow-500' : 'cursor-default'}`}
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
  // Destructure isSignedIn, userId, and isLoaded from useAuth
  const { isSignedIn, userId: clerkUserId, isLoaded: authLoaded } = useAuth(); 

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true); // For listing data fetching
  const [error, setError] = useState(null);

  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [currentUserAppId, setCurrentUserAppId] = useState(null);

  const fetchListingDetails = useCallback(async () => {
    try {
      setLoading(true); // Set loading true at the start of fetch
      setError(null);
      const response = await getListingById(listingId);
      setListing(response.data);
    } catch (err) {
      console.error("Error fetching listing details:", err);
      setError(err.response?.data?.message || "Failed to load listing details.");
      setListing(null);
    } finally {
      setLoading(false); // Set loading false at the end
    }
  }, [listingId]);

  useEffect(() => {
    if (listingId) {
      fetchListingDetails();
    }
  }, [listingId, fetchListingDetails]);

  useEffect(() => {
    const fetchAppUser = async () => {
        if (authLoaded && clerkUserId) { // Check clerkUserId (implies isSignedIn is true)
            try {
                const userResponse = await getCurrentUser();
                if (userResponse && userResponse.data) {
                    setCurrentUserAppId(userResponse.data._id);
                }
            } catch (userErr) {
                console.error("Error fetching current app user details:", userErr);
            }
        } else if (authLoaded && !clerkUserId) {
            setCurrentUserAppId(null);
        }
    };
    fetchAppUser();
  }, [authLoaded, clerkUserId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setReviewData(prev => ({ ...prev, rating: newRating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) { // Explicit check, though SignedIn component should handle UI
        setReviewError("You must be signed in to leave a review.");
        return;
    }
    if (!reviewData.rating || reviewData.rating < 1 || !reviewData.comment.trim()) {
      setReviewError("Please provide a rating (1-5 stars) and a comment.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      await createReview(listingId, { review: {rating: reviewData.rating, comment: reviewData.comment.trim()} });
      setReviewData({ rating: 0, comment: '' });
      fetchListingDetails(); 
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewDelete = async (reviewIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(listingId, reviewIdToDelete);
        fetchListingDetails();
      } catch (err) {
        console.error("Error deleting review:", err);
        alert(err.response?.data?.message || "Failed to delete review.");
      }
    }
  };
  
  const handleListingDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this listing? This action cannot be undone.")) {
        // Using a different loading state for this specific action if needed, or global 'setLoading'
        // For simplicity, using global setLoading for now.
        setLoading(true); 
        try {
            await deleteListing(listingId);
            navigate('/listings', { state: { message: `Listing "${listing?.title || 'Selected'}" deleted successfully.` } });
        } catch (err) {
            console.error("Error deleting listing:", err);
            setError(err.response?.data?.message || "Failed to delete listing.");
            setLoading(false); 
        }
    }
  };

  // Show loader if Clerk auth state isn't loaded OR if listing data is still loading
  if (!authLoaded || loading) { 
    return <FullPageLoader message="Loading listing details..." />;
  }

  if (error) {
    return (
        <div className="container-app text-center py-10">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
                <div className="mt-4">
                    <Link to="/listings" className="btn btn-primary btn-sm">Go to Listings</Link>
                </div>
            </div>
        </div>
    );
  }

  if (!listing) {
    // This state could be reached if fetch finished (loading=false) but listing is still null (e.g., API returned empty or error not caught by setError)
    return (
        <div className="container-app text-center py-10">
            <h2 className="text-2xl font-semibold">Listing Not Found</h2>
            <p className="text-neutral-dark">The listing you are looking for does not exist or may have been removed.</p>
            <Link to="/listings" className="mt-4 btn btn-primary">Browse Other Listings</Link>
        </div>
    );
  }

  // isOwner check now uses clerkUserId (from useAuth) and currentUserAppId (from our DB)
  const isOwner = authLoaded && clerkUserId && listing.owner?._id === currentUserAppId; 
  
  const averageRating = listing.reviews && listing.reviews.length > 0
    ? (listing.reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0) / listing.reviews.length)
    : 0;

  return (
    <div className="container-app py-6 md:py-8 animate-fadeIn">
        <div className="mb-6 flex justify-between items-center">
            <Link to="/listings" className="inline-flex items-center text-primary hover:text-primary-dark group text-sm">
                <FiChevronLeft className="mr-1 group-hover:-translate-x-0.5 transition-transform duration-200" /> Back to Listings
            </Link>
            <div className="flex space-x-3">
                <button className="btn btn-ghost btn-sm !px-2 !py-1.5 flex items-center"><FiShare2 className="mr-1.5"/> Share</button>
                <button className="btn btn-ghost btn-sm !px-2 !py-1.5 flex items-center"><FiHeart className="mr-1.5"/> Favorite</button>
            </div>
        </div>

      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-sleek-lg">
        <header className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
            {listing.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-dark gap-x-4 gap-y-1">
            {listing.reviews.length > 0 && (
                 <span className="flex items-center">
                    <FiStar className="text-yellow-400 fill-current mr-1" size={16}/> 
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="mx-1">·</span> 
                    <span className="hover:underline cursor-pointer">{listing.reviews.length} {listing.reviews.length === 1 ? "review" : "reviews"}</span>
                 </span>
            )}
            {listing.reviews.length > 0 && <span className="hidden sm:inline">·</span>}
            <span className="flex items-center"><FiMapPin className="mr-1.5 text-neutral-dark" size={16}/> {listing.location}, {listing.country}</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center"><FiTag className="mr-1.5 text-neutral-dark" size={16}/> {listing.category}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          <div className="lg:col-span-3">
            <ImageCarousel images={listing.images} altText={listing.title} className="w-full h-72 md:h-[450px] lg:h-[550px] rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-neutral-light">
                <div className="flex items-baseline justify-between mb-4">
                    <div className="text-3xl font-bold text-primary">
                        <span className="text-xl">₹ </span>{listing.price} 
                        <span className="text-base text-neutral-darkest font-normal ml-1">/ night</span>
                    </div>
                    {listing.reviews.length > 0 && (
                        <div className="flex items-center text-sm">
                            <FiStar className="text-yellow-400 fill-current mr-1" /> 
                            {averageRating.toFixed(1)} ({listing.reviews.length})
                        </div>
                    )}
                </div>
                <div className="border border-neutral-light rounded-lg p-3 mb-4 text-center">
                    <p className="text-sm text-neutral-dark">Booking functionality coming soon!</p>
                </div>

                {/* Use SignedIn and SignedOut for booking button visibility */}
                <SignedIn>
                    {!isOwner && <button className="btn btn-primary w-full text-md sm:text-lg py-3">Request to Book</button> }
                </SignedIn>
                <SignedOut>
                    <Link to={`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`} className="btn btn-primary w-full text-md sm:text-lg py-3 text-center block">
                        Sign in to Book
                    </Link>
                </SignedOut>
                
                {isOwner && (
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Link to={`/listings/${listing._id}/edit`} className="btn btn-secondary btn-sm flex-1 text-center py-2.5">
                    <FiEdit className="inline mr-1.5" /> Edit Listing
                    </Link>
                    <button onClick={handleListingDelete} className="btn btn-outline-primary border-red-500 text-red-500 hover:bg-red-500 hover:text-white btn-sm flex-1 py-2.5">
                    <FiTrash2 className="inline mr-1.5" /> Delete Listing
                    </button>
                </div>
                )}
                <p className="text-xs text-neutral-dark text-center mt-4">You won't be charged yet</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            <div className="lg:col-span-3">
                {listing.owner && (
                     <div className="mb-8 pb-6 border-b border-neutral-light">
                        <div className="flex items-center">
                            {listing.owner?.profileImageUrl ? (
                                <img src={listing.owner.profileImageUrl} alt={listing.owner.username} className="w-12 h-12 rounded-full mr-4 object-cover"/>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-secondary-dark font-bold text-xl mr-4">
                                    {listing.owner.username ? listing.owner.username.charAt(0).toUpperCase() : <FiUser />}
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-semibold text-secondary">Hosted by {listing.owner.username}</h3>
                                <p className="text-sm text-neutral-dark">Joined {listing.owner.createdAt ? formatDistanceToNow(parseISO(listing.owner.createdAt), { addSuffix: true }) : 'recently'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="font-display text-2xl font-semibold text-secondary mb-3">About this place</h2>
                    <p className="text-neutral-darkest leading-relaxed whitespace-pre-wrap">{listing.description || "No description provided."}</p>
                </div>
            </div>
            {/* <div className="lg:col-span-2"> Placeholder for amenities </div> */}
        </div>
        
        <div className="pt-8 border-t border-neutral-light">
          <h2 className="font-display text-2xl font-semibold text-secondary mb-6 flex items-center">
            <FiMessageSquare className="mr-2.5"/> {listing.reviews.length > 0 ? `${averageRating.toFixed(1)} · ${listing.reviews.length} Review${listing.reviews.length === 1 ? '' : 's'}` : 'No Reviews Yet'}
          </h2>
          
          {/* Use SignedIn for review form visibility */}
          <SignedIn>
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-neutral-lightest rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-darkest mb-3">Leave your review</h3>
              {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
              <div className="mb-3">
                <label className="block text-sm font-medium text-neutral-darkest mb-1.5">Your Rating <span className="text-red-500">*</span></label>
                <StarRating rating={reviewData.rating} onRatingChange={handleRatingChange} size="text-3xl"/>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-neutral-darkest mb-1.5">Your Comment <span className="text-red-500">*</span></label>
                <textarea id="comment" name="comment" rows="3" value={reviewData.comment} onChange={handleReviewChange} className="input-field" placeholder="Share details of your own experience at this place..." required></textarea>
              </div>
              <button type="submit" disabled={reviewSubmitting} className="btn btn-primary btn-sm flex items-center py-2 px-4">
                {reviewSubmitting ? <InlineLoader size="text-lg" color="text-white" /> : <><FiSend className="mr-2" /> Submit Review</>}
              </button>
            </form>
          </SignedIn>
          <SignedOut>
            <p className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md text-center border border-blue-200">
              <Link to={`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`} className="font-semibold hover:underline">Sign in</Link> or <Link to={`/sign-up?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`} className="font-semibold hover:underline">Sign up</Link> to leave a review.
            </p>
          </SignedOut>

          {listing.reviews.length > 0 ? (
            <div className="space-y-6">
              {listing.reviews.map((review) => (
                <div key={review._id} className="p-4 border-b border-neutral-light last:border-b-0">
                  <div className="flex items-start mb-2">
                    {review.author?.profileImageUrl ? (
                        <img src={review.author.profileImageUrl} alt={review.author.username} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-secondary-dark font-bold text-lg mr-3">
                            {review.author?.username ? review.author.username.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-neutral-darkest text-md">{review.author?.username || 'Anonymous User'}</p>
                        <p className="text-xs text-neutral-dark">
                            {formatDistanceToNow(parseISO(review.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                  </div>
                  <div className="mb-2 pl-13"> {/* Align with text below avatar */}
                     <StarRating rating={review.rating} editable={false} size="text-md"/>
                  </div>
                  <p className="text-neutral-darkest text-sm leading-relaxed mb-2 pl-13">{review.comment}</p>
                  {/* Check for author for delete button */}
                  {authLoaded && clerkUserId && review.author?._id === currentUserAppId && (
                     <button onClick={() => handleReviewDelete(review._id)} className="text-xs text-red-500 hover:text-red-700 flex items-center pl-13" aria-label="Delete review">
                       <FiTrash2 className="mr-1" /> Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !isSignedIn && <p className="text-neutral-dark">This place has no reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;