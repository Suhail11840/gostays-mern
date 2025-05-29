import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // useSearchParams for category filter
import { getAllListings } from '../../services/api';
import ListingCard from '../../components/listings/ListingCard'; // Ensure this uses the advanced version
import { InlineLoader, SkeletonBlock } from '../../components/common/FullPageLoader';
import { FiFilter, FiSearch, FiAlertTriangle, FiPlusCircle, FiChevronLeft, FiChevronRight, FiGrid, FiList, FiX } from 'react-icons/fi';
import { FaThList, FaThLarge } from 'react-icons/fa'; // For view toggle

const ITEMS_PER_PAGE = 12; // Adjust as needed for pagination

const ListingsPage = () => {
  const [allListings, setAllListings] = useState([]); // Store all fetched listings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // For mobile filters

  // Define categories - should match HomePage.jsx if possible
  const categories = ['All', 'Beach', 'Mountains', 'City', 'Countryside', 'Unique', 'Trending', 'Cabins', 'Lakefront', 'Other'];

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllListings(); // Axios response object
        setAllListings(response.data || []);    // Actual listings array is in response.data
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch listings.');
        console.error("Fetch listings error:", err);
        setAllListings([]); // Ensure it's an array on error
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, []);

  // Update search params when filters change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, setSearchParams]);


  // Memoized filtered and paginated listings
  const { currentListings, totalPages } = useMemo(() => {
    let filtered = allListings;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(listing =>
        (listing.title && listing.title.toLowerCase().includes(lowerSearchTerm)) ||
        (listing.location && listing.location.toLowerCase().includes(lowerSearchTerm)) ||
        (listing.country && listing.country.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    const calculatedTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return {
        currentListings: filtered.slice(startIndex, endIndex),
        totalPages: calculatedTotalPages,
    };
  }, [allListings, searchTerm, selectedCategory, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
  };
  
  const PageButton = ({ page, children, isDisabled = false }) => (
    <button
        onClick={() => !isDisabled && handlePageChange(page)}
        disabled={isDisabled || currentPage === page}
        className={`px-3 py-1.5 mx-1 rounded-md text-sm font-medium transition-colors
                    ${currentPage === page 
                        ? 'bg-primary text-white cursor-default shadow-md' 
                        : isDisabled 
                            ? 'bg-neutral-light text-neutral-dark cursor-not-allowed opacity-70'
                            : 'bg-white text-neutral-darkest hover:bg-primary-light hover:text-white border border-neutral-light'
                    }`}
    >
        {children}
    </button>
  );


  if (loading) {
    return (
      <div className="container-app py-10 min-h-[70vh] flex flex-col items-center justify-center">
        <InlineLoader size="text-6xl" />
        <p className="mt-6 text-xl text-neutral-dark font-medium animate-pulseHalka">Loading Stays...</p>
      </div>
    );
  }

  return (
    <div className="container-app py-6 md:py-10 animate-fadeIn">
      {/* Header and Add New Listing Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary">
          Explore Our Stays
        </h1>
        <Link to="/listings/new" className="btn btn-primary text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5 flex items-center whitespace-nowrap">
          <FiPlusCircle className="mr-2" /> Add Your Stay
        </Link>
      </div>

      {/* Filters and Search Section - Enhanced */}
      <div className="mb-8 p-4 md:p-6 bg-white rounded-xl shadow-sleek sticky top-20 z-30">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-grow w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name, location..."
              className="input-field !pl-10 w-full !py-2.5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search listings"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark pointer-events-none" />
          </div>

          {/* Category Select */}
          <div className="relative flex-grow w-full md:w-auto">
            <select
              className="input-field appearance-none w-full pr-10 !py-2.5 text-sm"
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
          
          {/* View Toggle Buttons */}
          <div className="flex items-center justify-end md:justify-start space-x-2 w-full md:w-auto">
            <button 
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Switch to grid view"
                className={`p-2.5 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'bg-neutral-light text-neutral-darkest hover:bg-primary-light hover:text-white'} transition-colors`}
            >
                <FaThLarge size={16}/>
            </button>
            <button 
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="Switch to list view"
                className={`p-2.5 rounded-md ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'bg-neutral-light text-neutral-darkest hover:bg-primary-light hover:text-white'} transition-colors`}
            >
                <FaThList size={16}/>
            </button>
          </div>
        </div>
        {/* Simple results count */}
        {!loading && !error && (
             <p className="text-xs text-neutral-dark mt-3">
                Showing {currentListings.length} of {allListings.filter(listing => {
                    const lowerSearchTerm = searchTerm.toLowerCase();
                    const matchesSearchTerm = (listing.title && listing.title.toLowerCase().includes(lowerSearchTerm)) || (listing.location && listing.location.toLowerCase().includes(lowerSearchTerm)) || (listing.country && listing.country.toLowerCase().includes(lowerSearchTerm));
                    const matchesCategory = selectedCategory === 'All' || selectedCategory === '' || !listing.category || listing.category === selectedCategory;
                    return matchesSearchTerm && matchesCategory;
                }).length} results.
            </p>
        )}
      </div>

      {error && !loading && (
        <div className="text-center py-10 bg-red-100 text-red-700 p-4 rounded-lg shadow-md flex flex-col items-center gap-2">
          <FiAlertTriangle size={32} className="mb-2"/>
          <h3 className="font-semibold text-lg">Oops! Something went wrong.</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 btn btn-primary btn-sm">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && currentListings.length === 0 && (
        <div className="text-center py-16 md:py-20">
          <FiSearch size={48} className="mx-auto text-neutral-light mb-5" />
          <h2 className="text-2xl font-semibold font-display text-secondary mb-2">No Stays Found</h2>
          <p className="text-neutral-dark mb-6">
            We couldn't find any stays matching your current filters. Try adjusting your search!
          </p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }} className="btn btn-outline-primary">
            Clear Filters
          </button>
        </div>
      )}

      {!loading && !error && currentListings.length > 0 && (
        <>
          <div className={`
              ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8' 
                  : 'space-y-6 md:space-y-8'}
              pb-8
          `}>
            {currentListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 md:mt-12 flex justify-center items-center space-x-1 pb-8">
              <PageButton page={currentPage - 1} isDisabled={currentPage === 1}>
                <FiChevronLeft size={18} />
              </PageButton>
              
              {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Basic logic to show some page numbers around current
                  if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ||
                      (currentPage <=3 && pageNum <=3) || (currentPage >= totalPages - 2 && pageNum >= totalPages-2)
                  ) {
                      return <PageButton key={pageNum} page={pageNum}>{pageNum}</PageButton>;
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={`ellipsis-${pageNum}`} className="px-1 py-1.5 text-neutral-dark">...</span>;
                  }
                  return null;
              })}

              <PageButton page={currentPage + 1} isDisabled={currentPage === totalPages}>
                <FiChevronRight size={18} />
              </PageButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListingsPage;