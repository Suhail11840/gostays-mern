import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchListingById, deleteListing, createReview, deleteReview, fetchCurrentUser } from '../../services/api'; // Assuming API functions
import { useAuth } from '@clerk/clerk-react';
import { FiMapPin, FiDollarSign, FiEdit, FiTrash2, FiStar, FiSend, FiArrowLeft, FiUser } from 'react-icons/fi';
import { InlineLoader } from '../../components/common/FullPageLoader';
import { format } from 'date-fns'; // For date formatting

// Placeholder for Review component
const ReviewItem = ({ review, currentUserId, listingId, onReviewDelete }) => {
  const isAuthor = review.author?._id === currentUserId;
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(listingId, review._id);
        onReviewDelete(review._id); // Callback to update parent state
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Error deleting review: " + (error.message || "Unknown error"));
      }
    }
  };

  return (
    <div className="bg-neutral-lightest p-4 rounded-lg shadow-sm mb-4 border border-neutral-light">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center">
           {/* Placeholder for author avatar */}
           <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold mr-3">
             {review.author?.username ? review.author.username.charAt(0).toUpperCase() : <FiUser />}
           </div>
          <div>
            <p className="font-semibold text-secondary-dark">{review.author?.username || 'Anonymous'}</p>
            <p className="text-xs text-neutral-dark">{format(new Date(review.createdAt), 'PPpp')}</p> {/* Pretty date */}
          </div>
        </div>
        {isAuthor && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <FiTrash2 size={18}/>
          </button>
        )}
      </div>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className={`mr-0.5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-light'}`} />
        ))}
      </div>
      <p className="text-neutral-darkest text-sm">{review.comment}</p>
    </div>
  );
};


const ListingDetailPage = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, userId: clerkUserId } = useAuth(); // Clerk user ID

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentUserAppId, setCurrentUserAppId] = useState(null); // Our app's user ID

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchListingById(listingId);
        setListing(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch listing details.');
        console.error("Fetch listing detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (listingId) {
      loadListing();
    }

    // Fetch current user's app ID if signed in
    const getCurrentAppUser = async () => {
      if(isSignedIn) {
        try {
          const appUser = await fetchCurrentUser(); // Fetches user from our DB via /users/me
          if(appUser) setCurrentUserAppId(appUser._id);
        } catch(err) {
          console.error("Error fetching current app user:", err);
        }
      }
    };
    getCurrentAppUser();

  }, [listingId, isSignedIn]);

  const handleListingDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await deleteListing(listingId);
        alert('Listing deleted successfully.');
        navigate('/listings');
      } catch (err) {
        alert('Failed to delete listing: ' + (err.message || 'Unknown error'));
        console.error("Delete listing error:", err);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError("Comment cannot be empty.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const newReviewData = { rating: reviewRating, comment: reviewComment };
      const newReview = await createReview(listingId, newReviewData);
      setListing(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews] // Add new review to the top
      }));
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
      console.error("Submit review error:", err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewDeleteCallback = (deletedReviewId) => {
    setListing(prev => ({
      ...prev,
      reviews: prev.reviews.filter(r => r._id !== deletedReviewId)
    }));
  };
  
  // Check if the current signed-in user (via Clerk) is the owner of the listing (via our app's User ID)
  const isOwner = isSignedIn && listing?.owner?._id === currentUserAppId;

  if (loading) return <div className="container-app py-10 text-center"><InlineLoader size="text-5xl" /><p className="mt-2">Loading listing details...</p></div>;
  if (error) return <div className="container-app py-10 text-center text-red-600 bg-red-50 p-4 rounded-lg">Error: {error} <button onClick={() => window.location.reload()} className="ml-4 btn btn-primary text-sm">Try Again</button></div>;
  if (!listing) return <div className="container-app py-10 text-center">Listing not found.</div>;

  return (
    <div className="container-app py-6 md:py-10 animate-fadeIn">
      <button onClick={() => navigate(-1)} className="btn btn-ghost text-sm mb-6 inline-flex items-center">
        <FiArrowLeft className="mr-2" /> Back to Listings
      </button>

      <div className="lg:flex lg:gap-10">
        {/* Left Column: Image & Map */}
        <div className="lg:w-3/5 mb-8 lg:mb-0">
          <div className="card p-0 mb-8">
            <img
              src={listing.image?.url || 'https://via.placeholder.com/800x500.png?text=GoStays+Listing'}
              alt={listing.title}
              className="w-full h-auto max-h-[60vh] object-cover rounded-t-xl"
            />
          </div>
          
          {/* Map Placeholder - TODO: Implement MapLibre GL here */}
          <div className="h-80 bg-neutral-light rounded-xl flex items-center justify-center shadow-sleek">
            <FiMapPin className="text-4xl text-neutral-dark mr-2"/>
            <p className="text-neutral-dark">Map will be here (Coordinates: {listing.position?.coordinates.join(', ')})</p>
          </div>
        </div>

        {/* Right Column: Details, Owner, Actions, Reviews */}
        <div className="lg:w-2/5">
          <div className="card p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-dark mb-3">
              {listing.title}
            </h1>
            <div className="flex items-center text-neutral-dark text-md mb-2">
              <FiMapPin className="mr-2 text-primary flex-shrink-0" />
              <span>{listing.location}, {listing.country}</span>
            </div>
            <div className="flex items-center text-primary text-2xl font-semibold mb-6">
              <FiDollarSign className="mr-1" />
              {listing.price.toLocaleString()} <span className="text-neutral-dark text-sm ml-1">/ night</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold font-display text-secondary-dark mb-2">Description</h2>
              <p className="text-neutral-darkest leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            <div className="mb-6 border-t border-neutral-light pt-6">
              <h2 className="text-xl font-semibold font-display text-secondary-dark mb-3">Hosted by</h2>
              <div className="flex items-center">
                 {/* Placeholder for owner avatar */}
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-secondary-dark font-bold text-lg mr-3">
                  {listing.owner?.username ? listing.owner.username.charAt(0).toUpperCase() : <FiUser />}
                </div>
                <div>
                  <p className="font-semibold text-lg text-secondary-dark">{listing.owner?.username || 'Host'}</p>
                  {/* Could add 'Joined date' or other info if available */}
                  <p className="text-sm text-neutral-dark">Contact: {listing.owner?.email || 'Not available'}</p>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-3 mb-6 border-t border-neutral-light pt-6">
                <Link to={`/listings/${listing._id}/edit`} className="btn btn-secondary text-sm flex-1">
                  <FiEdit className="mr-2" /> Edit Listing
                </Link>
                <button onClick={handleListingDelete} className="btn bg-red-600 hover:bg-red-700 text-white text-sm flex-1">
                  <FiTrash2 className="mr-2" /> Delete Listing
                </button>
              </div>
            )}
            
            {/* Booking Button Placeholder */}
             {!isOwner && isSignedIn && (
              <button className="btn btn-primary w-full text-lg py-3.5 mb-6">
                Request to Book
              </button>
            )}
            {!isSignedIn && (
              <Link to={`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`} className="block text-center btn btn-primary w-full text-lg py-3.5 mb-6">
                Sign in to Book
              </Link>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-8 card p-6 md:p-8">
            <h2 className="text-2xl font-semibold font-display text-secondary-dark mb-6">Reviews ({listing.reviews?.length || 0})</h2>
            {isSignedIn && (
              <form onSubmit={handleReviewSubmit} className="mb-8">
                <h3 className="text-lg font-semibold text-secondary-dark mb-2">Leave a Review</h3>
                <div className="mb-3">
                  <label htmlFor="rating" className="block text-sm font-medium text-neutral-darkest mb-1">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`focus:outline-none ${star <= reviewRating ? 'text-yellow-400' : 'text-neutral-light hover:text-yellow-300'}`}
                      >
                        <FiStar size={24} className="fill-current"/>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="block text-sm font-medium text-neutral-darkest mb-1">Comment</label>
                  <textarea
                    id="comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="Share your experience..."
                    required
                  ></textarea>
                </div>
                {reviewError && <p className="error-message mb-2">{reviewError}</p>}
                <button type="submit" className="btn btn-primary text-sm" disabled={reviewSubmitting}>
                  {reviewSubmitting ? <><InlineLoader size="text-lg" color="text-white"/> Submitting...</> : <><FiSend className="mr-2"/>Submit Review</>}
                </button>
              </form>
            )}

            {listing.reviews && listing.reviews.length > 0 ? (
              listing.reviews.map(review => (
                <ReviewItem 
                  key={review._id} 
                  review={review} 
                  currentUserId={currentUserAppId} 
                  listingId={listingId}
                  onReviewDelete={handleReviewDeleteCallback}
                />
              ))
            ) : (
              <p className="text-neutral-dark">No reviews yet. Be the first to leave one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;