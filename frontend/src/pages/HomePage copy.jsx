import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for search
import { 
    FiSearch, FiArrowRight, FiMapPin, FiStar, FiShield, FiUsers, FiMessageSquare, 
    FiAward, FiTrendingUp, FiHome, FiHeart, FiThumbsUp, FiNavigation, FiMail, FiGift, FiKey, FiSmile
} from 'react-icons/fi';
import { 
    FaUmbrellaBeach, FaMountain, FaCity, FaTree, FaBuilding, FaCampground, FaConciergeBell, FaBed, FaPaintBrush
} from 'react-icons/fa';
import { getAllListings } from '../services/api';
import ListingCard from '../components/listings/ListingCard'; // Ensure this is the advanced one
import { InlineLoader, SkeletonBlock } from '../components/common/FullPageLoader';

// Enhanced Category data
const categories = [
  { name: 'Beachfront Bliss', icon: FaUmbrellaBeach, color: 'text-blue-500', bgColor: 'bg-blue-50', linkQuery: 'Beach' },
  { name: 'Mountain Escapes', icon: FaMountain, color: 'text-green-600', bgColor: 'bg-green-50', linkQuery: 'Mountains' },
  { name: 'City Adventures', icon: FaCity, color: 'text-purple-500', bgColor: 'bg-purple-50', linkQuery: 'City' },
  { name: 'Rural Retreats', icon: FaTree, color: 'text-teal-500', bgColor: 'bg-teal-50', linkQuery: 'Countryside' },
  { name: 'Unique & Quirky', icon: FaPaintBrush, color: 'text-orange-500', bgColor: 'bg-orange-50', linkQuery: 'Unique' },
  { name: 'Luxury Villas', icon: FaBuilding, color: 'text-indigo-500', bgColor: 'bg-indigo-50', linkQuery: 'Luxury' }, // Example new category
];

// Dummy Testimonial data (replace with real data if you implement a system)
const testimonials = [
  { name: 'Alex R.', quote: "Found an incredible cabin on GoStays for a weekend getaway. The process was so smooth, and the place was even better than the pictures!", avatar: 'https://source.unsplash.com/random/100x100/?man,smiling,outdoors&sig=4', location: "Denver, USA" },
  { name: 'Priya S.', quote: "GoStays has such a diverse range of unique properties. We stayed in a treehouse and it was an unforgettable experience for our anniversary!", avatar: 'https://source.unsplash.com/random/100x100/?woman,happy,traveler&sig=5', location: "Bali, Indonesia" },
  { name: 'Marcus B.', quote: "Customer support was fantastic when I had a question about my booking. Highly recommend GoStays for finding hidden gems.", avatar: 'https://source.unsplash.com/random/100x100/?person,professional,beard&sig=6', location: "London, UK" },
];

// "Why Choose Us?" data
const whyChooseUsItems = [
    { icon: FiAward, title: "Curated Quality", description: "Handpicked listings ensuring comfort, style, and a memorable experience every time." },
    { icon: FiShield, title: "Secure Booking", description: "Book with confidence through our encrypted and reliable payment platform." },
    { icon: FiMessageSquare, title: "24/7 Support", description: "Our dedicated support team is always here to help, day or night." },
    { icon: FaConciergeBell, title: "Unique Experiences", description: "Discover not just places to stay, but unique activities and local experiences." },
];

// Popular Destinations
const popularDestinations = [
    { name: "Paris", image: "https://source.unsplash.com/random/600x800/?paris,eiffel-tower&sig=10", query: "Paris" },
    { name: "Kyoto", image: "https://source.unsplash.com/random/600x800/?kyoto,japan,temple&sig=11", query: "Kyoto" },
    { name: "Rome", image: "https://source.unsplash.com/random/600x800/?rome,colosseum&sig=12", query: "Rome" },
    { name: "Bali", image: "https://source.unsplash.com/random/600x800/?bali,beach,rice-paddy&sig=13", query: "Bali" },
];


const HomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [errorListings, setErrorListings] = useState(null);
  const [heroSearchTerm, setHeroSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoadingListings(true);
        const response = await getAllListings();
        // Example: Take a different slice or sort differently for "featured"
        // For now, just recent ones.
        setFeaturedListings((response.data || []).slice(0, 8)); 
      } catch (err) {
        console.error("Error fetching listings for homepage:", err);
        setErrorListings("Could not load featured stays at the moment.");
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearchTerm.trim()) {
        navigate(`/listings?search=${encodeURIComponent(heroSearchTerm.trim())}`);
    } else {
        navigate('/listings');
    }
  };

  // Simple scroll animation trigger (can be enhanced with Intersection Observer)
  // For simplicity, we'll rely on Tailwind animations and `animate-fadeIn` on sections.

  return (
    <div className="overflow-x-hidden"> {/* Prevent horizontal scroll from some animations */}
      {/* Hero Section - Enhanced */}
      <section 
        className="relative text-white py-24 md:py-40 xl:py-56 -mt-6 md:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 
                   bg-cover bg-center bg-no-repeat shadow-2xl rounded-b-[40px] md:rounded-b-[60px] group"
        style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?travel,landscape,beautiful&sig=hero')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 group-hover:from-black/80 group-hover:via-black/50 transition-all duration-500"></div> {/* Darker gradient on hover */}
        <div className="container-app relative z-10 text-center animate-fadeIn" style={{animationDelay: '0.2s'}}>
          <h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-black mb-6 leading-tight 
                       tracking-tight drop-shadow-xl animate-slideInUp"
            style={{animationDelay: '0.4s'}}
          >
            Your Journey Begins <span className="italic text-primary-light">Here</span>.
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-2xl mb-10 md:mb-12 max-w-3xl mx-auto text-neutral-lightest/90 drop-shadow-md animate-slideInUp"
            style={{animationDelay: '0.6s'}}
          >
            Explore breathtaking destinations and unique accommodations. <br className="hidden sm:block"/>Create memories that last a lifetime with GoStays.
          </p>
          <div className="max-w-xl mx-auto animate-slideInUp" style={{animationDelay: '0.8s'}}>
            <form onSubmit={handleHeroSearch} className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-2xl p-1.5 sm:p-2 transition-all duration-300 hover:shadow-xl focus-within:shadow-xl">
              <FiSearch className="text-primary text-lg sm:text-xl mx-3 flex-shrink-0" />
              <input
                type="search"
                value={heroSearchTerm}
                onChange={(e) => setHeroSearchTerm(e.target.value)}
                placeholder="Search destinations (e.g., 'Paris', 'beach')"
                className="flex-grow py-2.5 sm:py-3 px-2 border-none focus:ring-0 bg-transparent text-neutral-darkest placeholder-neutral-dark text-sm sm:text-md"
                aria-label="Search destinations"
              />
              <button type="submit" className="btn btn-primary rounded-full !px-5 !py-2.5 sm:!px-6 sm:!py-3 text-sm sm:text-md flex items-center">
                <FiSearch className="mr-2 sm:hidden" /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose GoStays Section */}
      <section className="container-app section-padding">
        <div className="text-center mb-12 md:mb-16 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">Why <span className="text-primary">GoStays</span>?</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto">We offer more than just a place to stay. We offer experiences.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {whyChooseUsItems.map((item, index) => (
                <div 
                    key={item.title} 
                    className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sleek 
                               hover:shadow-sleek-lg transition-all duration-300 transform hover:-translate-y-1.5 animate-slideInUp"
                    style={{animationDelay: `${0.2 * (index + 1) + 0.3}s`}}
                >
                    <div className="p-4 bg-primary-light/20 text-primary rounded-full mb-5 inline-block">
                        <item.icon size={32} />
                    </div>
                    <h3 className="text-xl font-semibold font-display text-secondary mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-dark leading-relaxed">{item.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Featured Categories Section - Enhanced */}
      <section className="section-padding bg-gradient-to-br from-neutral-lightest to-gray-100 rounded-3xl my-12 md:my-20 shadow-inner">
        <div className="container-app">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center animate-fadeIn">Explore by Style</h2>
            <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto animate-fadeIn" style={{animationDelay: '0.2s'}}>
                Find the perfect vibe for your next adventure, from tranquil beaches to bustling cityscapes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6"> {/* Adjusted for better look */}
            {categories.map((category, index) => (
                <Link
                key={category.name}
                to={`/listings?category=${encodeURIComponent(category.linkQuery)}`}
                className={`group flex flex-col items-center justify-center text-center p-6 md:p-8 
                            ${category.bgColor} rounded-2xl shadow-lg hover:shadow-xl 
                            transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-slideInUp`}
                style={{animationDelay: `${0.15 * index + 0.4}s`, minHeight: '180px'}} // Ensure consistent height
                >
                <category.icon className={`text-4xl md:text-5xl mb-3 ${category.color} transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110`} />
                <span className={`font-bold font-display text-md md:text-lg ${category.color.replace('text-', 'text-')} group-hover:underline`}>{category.name}</span>
                </Link>
            ))}
            </div>
        </div>
      </section>

      {/* Featured Listings Section - Enhanced */}
      <section className="container-app section-padding">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center animate-fadeIn">Freshly Listed Stays</h2>
        <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Discover the newest additions to our curated collection of unique accommodations.
        </p>
        {loadingListings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(featuredListings.length || 4)].map((_, i) => <ListingCard key={`skeleton-${i}`} listing={null} />)}
          </div>
        )}
        {errorListings && <p className="text-center text-red-600 bg-red-100 p-3 rounded-md">{errorListings}</p>}
        {!loadingListings && !errorListings && featuredListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredListings.map((listing, index) => (
              <div className="animate-slideInUp" style={{animationDelay: `${index * 0.1}s`}} key={listing._id}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
        {!loadingListings && !errorListings && featuredListings.length === 0 && (
          <p className="text-center text-neutral-dark py-10">No featured stays available right now. Check back soon!</p>
        )}
        <div className="text-center mt-12 md:mt-16 animate-fadeIn" style={{animationDelay: '0.5s'}}>
            <Link to="/listings" className="btn btn-primary text-lg px-10 py-4 group shadow-xl hover:shadow-2xl">
                View All Stays <FiArrowRight className="inline-block ml-2.5 transition-transform duration-300 group-hover:translate-x-1.5"/>
            </Link>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="section-padding bg-neutral-lightest rounded-3xl my-12 md:my-20 shadow-inner">
        <div className="container-app">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center animate-fadeIn">Popular Destinations</h2>
            <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto animate-fadeIn" style={{animationDelay: '0.2s'}}>
                Get inspired by these sought-after locations for your next unforgettable trip.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {popularDestinations.map((dest, index) => (
                    <Link 
                        to={`/listings?search=${encodeURIComponent(dest.query)}`} 
                        key={dest.name} 
                        className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 animate-slideInUp"
                        style={{animationDelay: `${index * 0.15 + 0.3}s`, aspectRatio: '3/4'}}
                    >
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 md:p-6">
                            <h3 className="text-xl md:text-2xl font-display font-semibold text-white drop-shadow-md">{dest.name}</h3>
                            <span className="text-sm text-primary-light group-hover:underline">Explore <FiArrowRight className="inline-block ml-1 text-xs"/></span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="section-padding bg-gradient-to-br from-secondary via-secondary-dark to-neutral-darkest text-white rounded-3xl my-12 md:my-20 shadow-2xl overflow-hidden">
        <div className="container-app relative">
            {/* Decorative elements */}
            <FiMessageSquare size={120} className="absolute -top-10 -left-10 text-white/5 opacity-50 transform rotate-[-15deg] hidden lg:block"/>
            <FiStar size={80} className="absolute -bottom-8 -right-8 text-yellow-400/10 opacity-60 transform rotate-[20deg] hidden lg:block"/>

            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-center animate-fadeIn">Real Stories, Real Stays</h2>
            <p className="text-center text-neutral-light mb-10 md:mb-16 max-w-xl mx-auto animate-fadeIn" style={{animationDelay: '0.2s'}}>
                Don't just take our word for it. Hear from fellow travelers who found their perfect escape with GoStays.
            </p>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
                <div 
                    key={index} 
                    className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center text-center
                               border border-white/10 transition-all duration-300 hover:bg-white/10 transform hover:scale-105 animate-slideInUp"
                    style={{animationDelay: `${index * 0.15 + 0.3}s`}}
                >
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-24 h-24 rounded-full mb-5 border-4 border-primary-light shadow-lg object-cover" />
                    <div className="mb-4">
                        <FiStar className="inline text-yellow-400 fill-current" /><FiStar className="inline text-yellow-400 fill-current" /><FiStar className="inline text-yellow-400 fill-current" /><FiStar className="inline text-yellow-400 fill-current" /><FiStar className="inline text-yellow-400 fill-current" />
                    </div>
                    <p className="text-md text-neutral-lightest italic mb-5 leading-relaxed flex-grow">"{testimonial.quote}"</p>
                    <h4 className="font-semibold font-display text-xl text-white">{testimonial.name}</h4>
                    <p className="text-xs text-accent tracking-wide">{testimonial.location}</p>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* Call to Action / Newsletter (Simplified) */}
      <section className="container-app section-padding">
        <div className="bg-gradient-to-r from-primary-light via-primary to-gradientTo p-8 md:p-12 rounded-2xl shadow-xl text-white text-center animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <FiMail size={48} className="mx-auto mb-4 opacity-80"/>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Stay Updated with GoStays!</h2>
            <p className="mb-6 max-w-lg mx-auto text-neutral-lightest/90">
                Subscribe to our newsletter for the latest deals, new destinations, and travel tips.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Enter your email address" className="input-field !text-neutral-darkest flex-grow !py-3" required />
                <button type="submit" className="btn bg-secondary hover:bg-secondary-dark text-white !py-3">Subscribe Now</button>
            </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;