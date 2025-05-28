import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiMapPin, FiStar, FiShield, FiUsers, FiList, FiMessageSquare, FiAward, FiTrendingUp } from 'react-icons/fi';
import { FaUmbrellaBeach, FaMountain, FaCity, FaTree, FaHome } from 'react-icons/fa'; // Category icons

// Dummy data for testimonials or featured listings (replace with real data or API calls)
const featuredListings = [
  { id: 1, title: 'Sunny Beachfront Paradise', location: 'Malibu, California', price: 450, image: 'https://source.unsplash.com/random/600x400/?beach,house', rating: 4.9 },
  { id: 2, title: 'Serene Mountain Cabin Retreat', location: 'Aspen, Colorado', price: 320, image: 'https://source.unsplash.com/random/600x400/?mountain,cabin', rating: 4.8 },
  { id: 3, title: 'Chic Urban Loft with Views', location: 'New York City, NY', price: 280, image: 'https://source.unsplash.com/random/600x400/?city,loft', rating: 4.7 },
];

const testimonials = [
  { name: 'Sarah L.', quote: "GoStays made finding our dream vacation rental so easy! The platform is beautiful and user-friendly.", avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait' },
  { name: 'Mike P.', quote: "Our host was amazing, and the property exceeded all expectations. Five stars for GoStays!", avatar: 'https://source.unsplash.com/random/100x100/?man,portrait' },
  { name: 'Chloe W.', quote: "I've used many booking sites, but GoStays stands out for its unique selection and seamless experience.", avatar: 'https://source.unsplash.com/random/100x100/?person,smiling' },
];

// Helper component for section titles
const SectionTitle = ({ children, subtitle }) => (
  <div className="text-center mb-12 md:mb-16">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-secondary-dark mb-3">
      {children}
    </h2>
    {subtitle && <p className="text-lg text-neutral-dark max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const HomePage = () => {
  return (
    <div className="animate-fadeIn space-y-16 md:space-y-24">
      {/* --- Hero Section --- */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center rounded-b-3xl overflow-hidden group">
        {/* Background Image/Video - REPLACE WITH YOUR OWN HIGH-QUALITY ASSET */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" // Example beach image
          alt="Beautiful travel destination"
          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div> {/* Gradient Overlay */}

        <div className="relative z-10 p-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white mb-6 leading-tight animate-slideInUp shadow-text-lg">
            Your Journey Begins <span className="text-primary-light">Here</span>.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-neutral-lightest max-w-3xl mx-auto mb-10 animate-slideInUp shadow-text-md" style={{ animationDelay: '0.2s' }}>
            Unforgettable stays and unique experiences await. Discover your next adventure with GoStays.
          </p>
          <div className="max-w-xl mx-auto animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search for your dream destination..."
                className="w-full py-4 px-6 pr-16 rounded-full text-lg shadow-xl focus:ring-4 focus:ring-primary-light focus:outline-none border-none text-neutral-darkest"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">
                <FiSearch size={24} />
              </button>
            </div>
          </div>
          <div className="mt-12 animate-slideInUp" style={{ animationDelay: '0.6s' }}>
            <Link
              to="/listings"
              className="btn btn-primary text-lg px-10 py-4 inline-flex items-center group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Explore Stays
              <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Featured Categories Section --- */}
      <section className="container-app">
        <SectionTitle subtitle="Find the perfect type of stay for your next getaway.">
          Explore by <span className="text-primary">Category</span>
        </SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { name: 'Beaches', icon: <FaUmbrellaBeach size={32} />, color: 'text-blue-500', bg: 'bg-blue-50' },
            { name: 'Mountains', icon: <FaMountain size={32} />, color: 'text-green-600', bg: 'bg-green-50' },
            { name: 'Cities', icon: <FaCity size={32} />, color: 'text-purple-500', bg: 'bg-purple-50' },
            { name: 'Countryside', icon: <FaTree size={32} />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { name: 'Unique Homes', icon: <FaHome size={32} />, color: 'text-red-500', bg: 'bg-red-50' },
          ].map((category, index) => (
            <Link
              to={`/listings?category=${category.name.toLowerCase()}`}
              key={category.name}
              className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-sleek hover:shadow-sleek-lg transform hover:-translate-y-1 transition-all duration-300 ${category.bg} group animate-fadeIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-4 rounded-full bg-white mb-4 shadow-md group-hover:scale-110 transition-transform ${category.color}`}>
                {category.icon}
              </div>
              <h3 className={`font-display font-semibold text-lg group-hover:text-primary-dark transition-colors ${category.color.replace('text-', 'text-secondary-dark')}`}>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Featured Listings Section --- */}
      <section className="container-app">
        <SectionTitle subtitle="Handpicked selection of our most popular and highly-rated stays.">
          <span className="text-primary">Featured</span> Stays
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredListings.map((listing, index) => (
            <div key={listing.id} className="card p-0 animate-fadeIn group" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="relative overflow-hidden rounded-t-xl">
                <img src={listing.image} alt={listing.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                  <FiStar className="fill-yellow-400 text-yellow-400 mr-1" /> {listing.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-display font-semibold text-secondary-dark mb-1 group-hover:text-primary transition-colors truncate">{listing.title}</h3>
                <div className="flex items-center text-neutral-dark text-sm mb-3">
                  <FiMapPin className="mr-1.5 text-primary" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-primary">
                    ${listing.price} <span className="text-sm text-neutral-dark font-normal">/ night</span>
                  </p>
                  <Link to={`/listings/${listing.id}`} className="btn btn-outline-primary text-sm px-4 py-1.5">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/listings" className="btn btn-secondary text-lg px-8 py-3 group inline-flex items-center">
            View All Stays <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      
      {/* --- Why Choose Us Section --- */}
      <section className="bg-gradient-to-b from-neutral-lightest to-accent/20 py-16 md:py-24">
        <div className="container-app">
          <SectionTitle subtitle="We provide a seamless and trustworthy platform for your travel needs.">
            Why <span className="text-primary">GoStays</span>?
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <FiAward size={36} className="text-primary" />, title: "Quality Guaranteed", desc: "Every listing is vetted for quality and comfort, ensuring a delightful stay." },
              { icon: <FiShield size={36} className="text-primary" />, title: "Secure Bookings", desc: "Book with confidence using our secure payment system and trusted platform." },
              { icon: <FiMessageSquare size={36} className="text-primary" />, title: "24/7 Support", desc: "Our dedicated support team is always here to help you, anytime, anywhere." },
            ].map((feature, index) => (
              <div key={feature.title} className="bg-white p-8 rounded-xl shadow-sleek text-center transform hover:scale-105 transition-transform duration-300 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-block p-4 bg-primary-light/20 rounded-full mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold text-secondary-dark mb-3">{feature.title}</h3>
                <p className="text-neutral-dark text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="container-app">
        <SectionTitle subtitle="Hear what our happy travelers have to say about their GoStays experience.">
          Loved by <span className="text-primary">Travelers</span>
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="bg-white p-6 rounded-xl shadow-sleek animate-fadeIn" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="flex items-center mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 object-cover" />
                <div>
                  <h4 className="font-display font-semibold text-lg text-secondary-dark">{testimonial.name}</h4>
                  {/* <p className="text-sm text-primary">Verified Traveler</p> */}
                </div>
              </div>
              <p className="text-neutral-darkest text-sm italic leading-relaxed">"{testimonial.quote}"</p>
              <div className="mt-3 flex">
                {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-yellow-400 text-yellow-400 h-5 w-5" />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Call to Action (Become a Host) --- */}
      <section className="relative py-20 md:py-32 rounded-2xl overflow-hidden group mt-10 mb-5">
        <img 
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" // Example interior
          alt="Become a host with GoStays"
          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-secondary/80"></div>
        <div className="relative container-app text-center z-10">
          <FiTrendingUp size={50} className="text-primary-light mx-auto mb-6 animate-pulseHalka" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Become a GoStays Host
          </h2>
          <p className="text-lg text-neutral-lightest max-w-xl mx-auto mb-10">
            Join our community of hosts and start earning by sharing your space with travelers from around the globe.
          </p>
          <Link
            to="/listings/new" // Or a dedicated "Become a Host" page
            className="btn bg-accent text-secondary-dark hover:bg-opacity-80 text-lg px-10 py-4 inline-flex items-center group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start Hosting Today
            <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;