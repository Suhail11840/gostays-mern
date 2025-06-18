import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FiSearch, FiArrowRight, FiMapPin, FiStar, FiShield, FiUsers, FiMessageSquare, 
    FiAward, FiTrendingUp, FiHome, FiHeart, FiThumbsUp, FiNavigation, FiMail, FiGift, 
    FiKey, FiSmile, FiChevronDown, FiCheckCircle, FiGlobe, FiBriefcase, FiPlayCircle, FiCoffee
} from 'react-icons/fi';
import { 
    FaUmbrellaBeach, FaMountain, FaCity, FaTree, FaBuilding, FaCampground, 
    FaConciergeBell, FaBed, FaPaintBrush, FaRoute, FaHandsHelping, FaSeedling
} from 'react-icons/fa';
import { getAllListings } from '../services/api'; // Ensure correct path
import ListingCard from '../components/listings/ListingCard'; // Ensure correct path
import { InlineLoader, SkeletonBlock } from '../components/common/FullPageLoader'; // Ensure correct path

// --- Data (can be moved to a separate file later) ---

const categories = [
  { 
    name: 'Beach Escapes', 
    icon: FaUmbrellaBeach, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100', 
    linkQuery: 'Beach', 
    delay: '0.1s',
    // Replace with your actual image URL or local path
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60' 
  },
  { 
    name: 'Mountain Peaks', 
    icon: FaMountain, 
    color: 'text-green-700', 
    bgColor: 'bg-green-100', 
    linkQuery: 'Mountains', 
    delay: '0.2s',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bnRhaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  { 
    name: 'City Adventures', 
    icon: FaCity, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100', 
    linkQuery: 'City', 
    delay: '0.3s',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  { 
    name: 'Rural Charm', 
    icon: FaTree, // Or FaCampground if you prefer
    color: 'text-teal-600', 
    bgColor: 'bg-teal-100', 
    linkQuery: 'Countryside', 
    delay: '0.4s',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y291bnRyeXNpZGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  { 
    name: 'Unique Stays', 
    icon: FaPaintBrush, // Ensure this is imported
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100', 
    linkQuery: 'Unique', 
    delay: '0.5s',
    imageUrl: 'https://i1.wp.com/hypebeast.com/image/2015/07/check-out-the-transparent-sleep-capsules-400-feet-above-perus-sacred-valley-000.jpg?w=960'
  },
  { 
    name: 'Luxury Villas', 
    icon: FaBuilding, 
    color: 'text-indigo-600', 
    bgColor: 'bg-indigo-100', 
    linkQuery: 'Other', 
    delay: '0.6s',
    imageUrl: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwdmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
];

const testimonials = [
  { name: 'Riya Das', quote: "GoStays transformed my vacation planning! The variety of unique homes is astounding, and booking was a breeze. Found the perfect lakeside cabin in Anini.", avatar: 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', location: "Anini, Arunachal Pradesh", stars: 5 },
  { name: 'Saurav yadav', quote: "I'm a frequent traveler, and GoStays has become my go-to. The quality of listings and the responsive hosts make all the difference. My Dzuko trek in visewema was incredible.", avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', location: "Dzuko, Nagaland", stars: 5 },
  { name: 'Aisha Khan', quote: "What a find! We discovered a charming cityside cottage that felt like a world away. The kids loved it, and so did we. Thank you, GoStays!", avatar: 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', location: "Shillong, Meghalaya", stars: 4 },
];

const whyChooseUsItems = [
    { icon: FiAward, title: "Exceptional Quality", description: "Every stay is vetted for quality, ensuring a remarkable experience." },
    { icon: FiShield, title: "Trusted & Secure", description: "Your peace of mind is our priority with secure payments and verified hosts." },
    { icon: FaConciergeBell, title: "Unique Finds", description: "Discover hidden gems and one-of-a-kind properties you won't find elsewhere." },
    { icon: FiMessageSquare, title: "Dedicated Support", description: "Our friendly support team is available 24/7 to assist you on your journey." },
];

const popularDestinations = [
    { name: "Dzuko Valley", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/8e/e2/01/get-lost.jpg?w=1200&h=1200&s=1", query: "Visewema", delay: "0.1s" },
    { name: "Mechuka", image: "https://arunachalobserver.org/wp-content/uploads/2024/02/IMG-20240203-WA0075.jpg", query: "Mechuka", delay: "0.2s" },
    { name: "Wari Chora", image: "https://www.theunexplored.in/blog/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-25-at-13.16.10_ec32f8f0.jpg", query: "Wari chora, Meghalaya", delay: "0.3s" },
    { name: "Anini", image: "https://i.pinimg.com/736x/7a/ba/46/7aba46ab02b6ccfaa8ccd425300c2a8b.jpg", query: "Anini", delay: "0.4s" },
];

const howItWorksSteps = [
    { icon: FiSearch, title: "Find Your Spark", description: "Enter your destination, dates, and preferences. Our smart search finds your ideal stay from thousands of curated options.", number: 1 },
    { icon: FiKey, title: "Book with Ease", description: "Securely confirm your booking in just a few clicks. Transparent pricing, no hidden fees.", number: 2 },
    { icon: FiSmile, title: "Journey & Enjoy", description: "Pack your bags! Your unforgettable GoStays experience awaits. We're here if you need anything.", number: 3 },
];

const blogPosts = [
    { title: "Top 5 Hidden Beaches for Your Summer Escape", image: "https://source.unsplash.com/random/800x600/?hidden,beach,tropical&sig=30", category: "Travel Tips", date: "May 20, 2025", excerpt: "Escape the crowds and discover these secluded paradises perfect for your next summer adventure..." },
    { title: "A Foodie's Guide to Authentic Italian Cuisine", image: "https://source.unsplash.com/random/800x600/?italian,food,pasta&sig=31", category: "Culture", date: "May 15, 2025", excerpt: "Dive into the heart of Italy with our guide to the most authentic and delicious culinary experiences..." },
    { title: "Packing Essentials for a Mountain Hiking Trip", image: "https://source.unsplash.com/random/800x600/?mountain,hiking,gear&sig=32", category: "Adventure", date: "May 10, 2025", excerpt: "Don't hit the trails unprepared! Our checklist ensures you have everything you need for a safe and enjoyable hike..." },
];

// Custom hook for simple scroll-triggered animation
const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);
    return [ref, isVisible];
};


// Section Wrapper Component for consistent padding and animation
const SectionWrapper = ({ children, className = '', animate = true, delay = '0s', id }) => {
    const [ref, isVisible] = useScrollAnimation();
    const animationClass = animate && isVisible ? 'animate-fadeInUp' : 'opacity-0'; // Use custom fadeInUp if defined

    return (
        <section ref={ref} id={id} className={`section-padding ${animationClass} ${className}`} style={{animationDelay: delay}}>
            <div className="container-app">
                {children}
            </div>
        </section>
    );
};


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
        setFeaturedListings((response.data || []).sort(() => 0.5 - Math.random()).slice(0, 4)); // Random 4 for variety
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

  // Refs for scroll animations (example)
  const [heroRef, heroIsVisible] = useScrollAnimation();
  const [categoriesRef, categoriesAreVisible] = useScrollAnimation();
  // ... and so on for other sections if more granular control than SectionWrapper is needed

  return (
    <div className="overflow-x-hidden bg-neutral-lightest">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`relative text-white py-28 md:py-48 xl:py-64 -mt-6 md:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 
                   bg-cover bg-center bg-no-repeat shadow-2xl rounded-b-[50px] md:rounded-b-[80px] group
                   transition-opacity duration-1000 ${heroIsVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", animationDelay:'0.1s' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/80 via-secondary/50 to-transparent group-hover:from-secondary-dark/90 transition-all duration-500 rounded-b-[50px] md:rounded-b-[80px]"></div>
        <div className="container-app relative z-10 text-center">
          <h1 
            className={`text-4xl sm:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight 
                       tracking-tighter drop-shadow-2xl transition-all duration-700 ease-out
                       ${heroIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: heroIsVisible ? '0.3s' : '0s' }}
          >
            <span className="text-ascent ">Discover Your </span>
            <span className="gradient-text-primary italic">Next Story</span>.
          </h1>
          <p 
            className={`text-lg md:text-xl lg:text-2xl mb-10 md:mb-12 max-w-3xl mx-auto text-neutral-lightest/95 drop-shadow-lg
                       transition-all duration-700 ease-out ${heroIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: heroIsVisible ? '0.5s' : '0s' }}
          >
            Unforgettable stays, unique experiences, and seamless booking. Your adventure with GoStays is just a click away.
          </p>
          <div 
            className={`max-w-xl mx-auto transition-all duration-700 ease-out ${heroIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{ transitionDelay: heroIsVisible ? '0.7s' : '0s' }}
          >
            <form onSubmit={handleHeroSearch} className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-full shadow-2xl p-1.5 sm:p-2 transition-all duration-300 hover:shadow-xl focus-within:shadow-xl">
              <FiSearch className="text-primary text-lg sm:text-xl mx-3 flex-shrink-0" />
              <input
                type="search" value={heroSearchTerm} onChange={(e) => setHeroSearchTerm(e.target.value)}
                placeholder="Search city, landmark, or style (e.g. 'Paris', 'beach')"
                className="flex-grow py-3 sm:py-3.5 px-2 border-none focus:ring-0 bg-transparent text-neutral-darkest placeholder-neutral-dark text-sm sm:text-md"
                aria-label="Search destinations"
              />
              <button type="submit" className="btn btn-primary rounded-full !px-5 !py-2.5 sm:!px-6 sm:!py-3 text-sm sm:text-md flex items-center">
                <FiSearch className="mr-2 sm:hidden" /> Explore
              </button>
            </form>
          </div>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className={`mt-16 md:mt-20 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 animate-bounce
                       ${heroIsVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: heroIsVisible ? '1s' : '0s' }}
            aria-label="Scroll down"
          >
            <FiChevronDown size={28} />
          </button>
        </div>
      </section>

      {/* How It Works Section - MODIFIED ICONS */}
    <SectionWrapper id="how-it-works" className="bg-white" delay="0.2s"> {/* Assuming SectionWrapper is a custom component you have */}
        <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">Your Journey, Simplified</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto">Booking your dream stay with GoStays is as easy as 1, 2, 3!</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            {howItWorksSteps.map((step, index) => (
                <div 
                    key={step.number} 
                    className={`flex flex-col items-center text-center p-6 md:p-8 bg-neutral-lightest rounded-2xl shadow-sleek 
                                hover:shadow-sleek-lg transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp`}
                    style={{ animationDelay: `${index * 0.2 + 0.2}s` }} // Staggered animation
                >
                    {/* MODIFIED Icon Container */}
                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-primary-light bg-opacity-20 text-primary shadow-md mb-6">
                        {/* 
                          Explanation of classes for icon container:
                          - w-24 h-24: Size of the circle (adjust as needed)
                          - rounded-full: Makes it a circle
                          - bg-primary-light: Base light color of your primary theme
                          - bg-opacity-20: Makes the background 20% opaque (transparent)
                          - text-primary: Sets the icon color to your primary theme color
                          - shadow-md: Adds a subtle shadow for depth
                          - mb-6: Margin bottom
                        */}
                        <step.icon size={40} /> {/* Icon size, adjust as needed */}
                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            {/* 
                              Numbered badge styling:
                              - bg-secondary: Background color (your dark theme color)
                              - text-white: Text color for the number
                              - border-2 border-white: White border around the badge
                              - shadow-sm: Slight shadow for the badge
                            */}
                            {step.number}
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold font-display text-secondary mb-3">{step.title}</h3>
                    <p className="text-sm text-neutral-dark leading-relaxed">{step.description}</p>
                </div>
            ))}
        </div>
    </SectionWrapper>

     {/* Featured Categories Section - MODIFIED to use specific images */}
      <SectionWrapper className="bg-gradient-to-b from-primary-light/5 via-white to-primary-light/5" delay="0.3s">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center">Find Your Vibe</h2>
            <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto">
                From serene beach houses to chic city apartments, discover a stay that matches your unique travel style.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8"> 
            {/* Consider lg:grid-cols-6 if you have 6 categories and want them in one row on large screens */}
            {categories.map((category) => (
                <Link
                    key={category.name}
                    to={`/listings?category=${encodeURIComponent(category.linkQuery)}`}
                    className={`group relative rounded-2xl shadow-lg hover:shadow-xl overflow-hidden 
                                transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] animate-slideInUp aspect-[4/3] sm:aspect-[3/2]`}
                    style={{ animationDelay: category.delay }}
                >
                    <div className={`absolute inset-0 ${category.bgColor} opacity-30 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                        // --- THIS LINE IS CHANGED ---
                        style={{backgroundImage: `url(${category.imageUrl})`}} // Use the specific imageUrl
                        // --- END OF CHANGE ---
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-end p-4 md:p-6 text-center">
                        {/* 
                           The icon styling below is a bit complex and might not be ideal.
                           It tries to create a background for the icon from its text color.
                           A simpler approach might be better if this doesn't look right.
                           Example of simpler icon: <category.icon className={`text-3xl md:text-4xl mb-2 text-white drop-shadow-md`} />
                        */}
                        <div className={`p-2 md:p-3 rounded-full mb-2 backdrop-blur-sm bg-black/20 inline-block`}>
                           <category.icon className={`text-2xl md:text-3xl ${category.color} drop-shadow-sm`} />
                        </div>
                        <span className={`font-bold font-display text-lg md:text-xl text-white drop-shadow-lg group-hover:text-primary-light transition-colors`}>{category.name}</span>
                    </div>
                </Link>
            ))}
            </div>
      </SectionWrapper>

      {/* Featured Listings Section */}
      <SectionWrapper className="bg-white" delay="0.2s">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center">Hot Picks Just For You</h2>
        <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto">
            Explore our most popular and highly-rated stays, curated to inspire your next adventure.
        </p>
        {loadingListings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => <ListingCard key={`skeleton-feat-${i}`} listing={null} />)}
          </div>
        )}
        {errorListings && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{errorListings}</p>}
        {!loadingListings && !errorListings && featuredListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredListings.map((listing, index) => (
              <div className="animate-slideInUp" style={{animationDelay: `${index * 0.1 + 0.3}s`}} key={listing._id}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
        {!loadingListings && !errorListings && featuredListings.length === 0 && (
          <p className="text-center text-neutral-dark py-10">No featured stays to show right now. Please check back soon!</p>
        )}
        <div className="text-center mt-12 md:mt-16">
            <Link to="/listings" className="btn btn-primary text-lg px-10 py-4 group shadow-xl hover:shadow-2xl">
                Discover More Stays <FiArrowRight className="inline-block ml-2.5 transition-transform duration-300 group-hover:translate-x-1.5"/>
            </Link>
        </div>
      </SectionWrapper>

      {/* Popular Destinations Section */}
      <SectionWrapper className="bg-gradient-to-b from-neutral-lightest to-gray-100" delay="0.3s">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center">Trending Destinations</h2>
            <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto">
                Journey to the north-east's most sought-after locales. Your next great story starts here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {popularDestinations.map((dest) => (
                    <Link 
                        to={`/listings?search=${encodeURIComponent(dest.query)}`} 
                        key={dest.name} 
                        className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                                    transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] animate-slideInUp aspect-[3/4]`}
                        style={{ animationDelay: dest.delay }}
                    >
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 md:p-6">
                            <h3 className="text-xl md:text-2xl font-display font-semibold text-white drop-shadow-lg mb-1">{dest.name}</h3>
                            <span className="text-sm text-primary-light group-hover:underline flex items-center">
                                Explore Now <FiArrowRight className="ml-1.5 text-xs transition-transform duration-200 group-hover:translate-x-1"/>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
      </SectionWrapper>

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


      {/* Testimonials Section - Enhanced */}
      <SectionWrapper className="bg-gradient-to-tr from-secondary via-secondary-dark to-neutral-darkest text-white rounded-3xl shadow-2xl overflow-hidden" delay="0.4s">
            <FiMessageSquare size={150} className="absolute -top-12 -left-16 text-white/5 opacity-40 transform rotate-[-20deg] hidden lg:block pointer-events-none"/>
            <FiStar size={100} className="absolute -bottom-12 -right-12 text-yellow-400/10 opacity-50 transform rotate-[25deg] hidden lg:block pointer-events-none"/>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-accent text-center mb-3" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>Voices of GoStays</h2>
            <p className="text-center text-neutral-light mb-10 md:mb-16 max-w-xl mx-auto" >
                Real stories from our vibrant community of explorers and hosts.
            </p>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {testimonials.map((testimonial, index) => (
                <div 
                    key={index} 
                    className="bg-white/[.07] backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center text-center
                               border border-white/10 transition-all duration-300 hover:bg-white/[.12] transform hover:scale-[1.03] animate-slideInUp"
                    style={{animationDelay: `${index * 0.15 + 0.2}s`}}
                >
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-24 h-24 rounded-full mb-5 border-4 border-primary-light shadow-lg object-cover" />
                    <div className="mb-3 flex">
                        {[...Array(testimonial.stars)].map((_, i) => <FiStar key={i} className="text-yellow-400 fill-current text-lg"/>)}
                        {[...Array(5 - testimonial.stars)].map((_, i) => <FiStar key={`empty-${i}`} className="text-yellow-400/30 text-lg"/>)}
                    </div>
                    <p className="text-md text-neutral-lightest italic mb-5 leading-relaxed flex-grow">"{testimonial.quote}"</p>
                    <h4 className="font-semibold font-display text-xl text-white">{testimonial.name}</h4>
                    <p className="text-xs text-accent tracking-wider uppercase">{testimonial.location}</p>
                </div>
            ))}
            </div>
      </SectionWrapper>

      {/* Our Commitment Section */}
        <SectionWrapper className="bg-white" delay="0.2s">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">Our GoStays Promise</h2>
                <p className="text-neutral-dark max-w-2xl mx-auto">We're dedicated to making your travel experiences exceptional, safe, and memorable.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                <div className="flex flex-col items-center text-center p-6">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full mb-4 inline-block"><FaSeedling size={32}/></div>
                    <h3 className="text-xl font-semibold font-display text-secondary mb-2">Sustainable Travel</h3>
                    <p className="text-sm text-neutral-dark leading-relaxed">We promote eco-friendly stays and responsible tourism practices to protect our beautiful planet.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4 inline-block"><FaHandsHelping size={32}/></div>
                    <h3 className="text-xl font-semibold font-display text-secondary mb-2">Community Focused</h3>
                    <p className="text-sm text-neutral-dark leading-relaxed">Connecting travelers with local hosts and cultures, fostering understanding and unique interactions.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full mb-4 inline-block"><FiCheckCircle size={32}/></div>
                    <h3 className="text-xl font-semibold font-display text-secondary mb-2">Verified Quality</h3>
                    <p className="text-sm text-neutral-dark leading-relaxed">Our team works diligently to ensure listings meet high standards of comfort and safety.</p>
                </div>
            </div>
        </SectionWrapper>


     
    </div>
  );
};

export default HomePage;
