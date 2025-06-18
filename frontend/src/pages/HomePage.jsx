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
  { name: 'Beach Escapes', icon: FaUmbrellaBeach, color: 'text-blue-600', bgColor: 'bg-blue-100', linkQuery: 'Beach', delay: '0.1s' },
  { name: 'Mountain Peaks', icon: FaMountain, color: 'text-green-700', bgColor: 'bg-green-100', linkQuery: 'Mountains', delay: '0.2s' },
  { name: 'City Adventures', icon: FaCity, color: 'text-purple-600', bgColor: 'bg-purple-100', linkQuery: 'City', delay: '0.3s' },
  { name: 'Rural Charm', icon: FaTree, color: 'text-teal-600', bgColor: 'bg-teal-100', linkQuery: 'Countryside', delay: '0.4s' },
  { name: 'Unique Stays', icon: FaPaintBrush, color: 'text-orange-600', bgColor: 'bg-orange-100', linkQuery: 'Unique', delay: '0.5s' },
  { name: 'Luxury Villas', icon: FaBuilding, color: 'text-indigo-600', bgColor: 'bg-indigo-100', linkQuery: 'Luxury', delay: '0.6s' },
];

const testimonials = [
  { name: 'Sofia Chen', quote: "GoStays transformed my vacation planning! The variety of unique homes is astounding, and booking was a breeze. Found the perfect lakeside cabin.", avatar: 'https://source.unsplash.com/random/150x150/?woman,professional,smiling&sig=14', location: "Lake Tahoe, USA", stars: 5 },
  { name: 'David Miller', quote: "I'm a frequent traveler, and GoStays has become my go-to. The quality of listings and the responsive hosts make all the difference. My city loft in Tokyo was incredible.", avatar: 'https://source.unsplash.com/random/150x150/?man,modern,happy&sig=15', location: "Tokyo, Japan", stars: 5 },
  { name: 'Aisha Khan', quote: "What a find! We discovered a charming countryside cottage that felt like a world away. The kids loved it, and so did we. Thank you, GoStays!", avatar: 'https://source.unsplash.com/random/150x150/?woman,ethnic,joyful&sig=16', location: "Cotswolds, UK", stars: 4 },
];

const whyChooseUsItems = [
    { icon: FiAward, title: "Exceptional Quality", description: "Every stay is vetted for quality, ensuring a remarkable experience." },
    { icon: FiShield, title: "Trusted & Secure", description: "Your peace of mind is our priority with secure payments and verified hosts." },
    { icon: FaConciergeBell, title: "Unique Finds", description: "Discover hidden gems and one-of-a-kind properties you won't find elsewhere." },
    { icon: FiMessageSquare, title: "Dedicated Support", description: "Our friendly support team is available 24/7 to assist you on your journey." },
];

const popularDestinations = [
    { name: "Parisian Charm", image: "https://source.unsplash.com/random/600x800/?paris,street,cafe&sig=20", query: "Paris", delay: "0.1s" },
    { name: "Kyoto Serenity", image: "https://source.unsplash.com/random/600x800/?kyoto,bamboo,forest&sig=21", query: "Kyoto", delay: "0.2s" },
    { name: "Roman Holiday", image: "https://source.unsplash.com/random/600x800/?rome,ancient,ruins&sig=22", query: "Rome", delay: "0.3s" },
    { name: "Bali Dreams", image: "https://source.unsplash.com/random/600x800/?bali,villa,pool&sig=23", query: "Bali", delay: "0.4s" },
];

const howItWorksSteps = [
    { icon: FiSearch, title: "Find Your Spark", description: "Enter your destination, dates, and preferences. Our smart search finds your ideal stay from thousands of curated options.", number: 1, color: "primary" },
    { icon: FiKey, title: "Book with Ease", description: "Securely confirm your booking in just a few clicks. Transparent pricing, no hidden fees.", number: 2, color: "secondary" },
    { icon: FiSmile, title: "Journey & Enjoy", description: "Pack your bags! Your unforgettable GoStays experience awaits. We're here if you need anything.", number: 3, color: "accent" },
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
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D')", animationDelay:'0.1s' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/80 via-secondary/50 to-transparent group-hover:from-secondary-dark/90 transition-all duration-500 rounded-b-[50px] md:rounded-b-[80px]"></div>
        <div className="container-app relative z-10 text-center">
          <h1 
            className={`text-4xl sm:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight 
                       tracking-tighter drop-shadow-2xl transition-all duration-700 ease-out
                       ${heroIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: heroIsVisible ? '0.3s' : '0s' }}
          >
            Discover Your <span className="gradient-text-primary italic">Next Story</span>.
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

      {/* How It Works Section */}
      <SectionWrapper id="how-it-works" className="bg-white" delay="0.2s">
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
                        <div className={`relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-${step.color}-light to-${step.color} text-white shadow-lg mb-6`}>
                            <step.icon size={36} />
                            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
                                {step.number}
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold font-display text-secondary mb-3">{step.title}</h3>
                        <p className="text-sm text-neutral-dark leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>
      </SectionWrapper>

      {/* Featured Categories Section */}
      <SectionWrapper className="bg-gradient-to-b from-primary-light/5 via-white to-primary-light/5" delay="0.3s">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center">Find Your Vibe</h2>
            <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto">
                From serene beach houses to chic city apartments, discover a stay that matches your unique travel style.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8">
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
                        style={{backgroundImage: `url(https://source.unsplash.com/random/800x600/?${category.linkQuery.toLowerCase()},travel&sig=${Math.random()})`}}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-end p-4 md:p-6 text-center">
                        <category.icon className={`text-3xl md:text-4xl mb-2 text-white drop-shadow-md ${category.color.replace('text-','bg-').replace('-500', '-500/20').replace('-600', '-600/20').replace('-700', '-700/20')} p-2 rounded-full backdrop-blur-sm`} />
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
                Journey to the world's most sought-after locales. Your next great story starts here.
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


      {/* Testimonials Section - Enhanced */}
      <SectionWrapper className="bg-gradient-to-tr from-secondary via-secondary-dark to-neutral-darkest text-white rounded-3xl shadow-2xl overflow-hidden" delay="0.4s">
            <FiMessageSquare size={150} className="absolute -top-12 -left-16 text-white/5 opacity-40 transform rotate-[-20deg] hidden lg:block pointer-events-none"/>
            <FiStar size={100} className="absolute -bottom-12 -right-12 text-yellow-400/10 opacity-50 transform rotate-[25deg] hidden lg:block pointer-events-none"/>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">Voices of GoStays</h2>
            <p className="text-center text-neutral-light mb-10 md:mb-16 max-w-xl mx-auto">
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

      {/* Blog Snippets Section (Placeholder) */}
      <SectionWrapper className="bg-white" delay="0.3s">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3 text-center">Travel Inspiration</h2>
            <p className="text-center text-neutral-dark mb-10 md:mb-16 max-w-xl mx-auto">
                Fuel your wanderlust with our latest articles, tips, and destination guides.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {blogPosts.map((post, index) => (
                    <div 
                        key={post.title} 
                        className="group bg-neutral-lightest rounded-xl shadow-sleek hover:shadow-sleek-lg transition-all duration-300 overflow-hidden animate-slideInUp"
                        style={{animationDelay: `${index * 0.1 + 0.2}s`}}
                    >
                        <div className="relative aspect-video">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                            <div className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1 text-xs font-semibold rounded-md">{post.category}</div>
                        </div>
                        <div className="p-5 md:p-6">
                            <h3 className="font-display text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                            <p className="text-xs text-neutral-dark mb-3">{post.date}</p>
                            <p className="text-sm text-neutral-darkest leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                            <Link to="#" className="btn-link text-sm font-semibold flex items-center">Read More <FiArrowRight className="ml-1.5 w-4 h-4"/></Link>
                        </div>
                    </div>
                ))}
            </div>
             <div className="text-center mt-12 md:mt-16">
                <Link to="/blog" className="btn btn-outline-secondary text-lg px-8 py-3.5 group">
                    Visit Our Blog <FiNavigation className="inline-block ml-2 transition-transform duration-200 group-hover:rotate-[10deg]"/>
                </Link>
            </div>
      </SectionWrapper>


      {/* Final Call to Action / Newsletter */}
      <SectionWrapper 
        className="bg-gradient-to-br from-primary via-gradientTo to-yellow-400 text-white rounded-3xl my-12 md:my-20 shadow-2xl overflow-hidden" 
        delay="0.5s"
      >
        <div className="relative p-8 md:p-16 text-center">
            <FiGift size={100} className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/10 opacity-30 transform -rotate-[15deg] hidden md:block pointer-events-none"/>
            <FiMail size={64} className="mx-auto mb-6 opacity-90"/>
            <h2 className="text-3xl md:text-4xl font-display font-black mb-4 tracking-tight">Don't Miss Out!</h2>
            <p className="mb-8 max-w-lg mx-auto text-neutral-lightest/95 text-lg leading-relaxed">
                Join the GoStays family! Subscribe for exclusive deals, insider travel tips, and inspiration for your next incredible journey.
            </p>
            <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 items-center justify-center">
                <input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="input-field !text-neutral-darkest !bg-white/90 placeholder:text-neutral-dark flex-grow !py-3.5 !px-5 w-full sm:w-auto shadow-lg focus:!ring-offset-0" 
                    required 
                    aria-label="Email for newsletter"
                />
                <button 
                    type="submit" 
                    className="btn bg-secondary hover:bg-secondary-dark text-white !py-3.5 !px-8 w-full sm:w-auto shadow-lg text-md"
                >
                    Subscribe
                </button>
            </form>
            <p className="text-xs mt-4 text-white/70">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HomePage;