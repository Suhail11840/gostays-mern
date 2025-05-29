import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FiHome, FiMapPin, FiPlusSquare, FiSearch, FiMenu, FiX, FiLogIn, FiUserPlus, FiSun, FiMoon, FiLayout } from 'react-icons/fi';
import { FaCompass } from 'react-icons/fa';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Example theme toggle
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   localStorage.setItem('theme', newTheme);
  //   document.documentElement.classList.toggle('dark', newTheme === 'dark');
  // };

  const navLinkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex items-center space-x-2 group";
  const activeNavLinkClasses = "bg-primary text-white shadow-md scale-105";
  const inactiveNavLinkClasses = "text-neutral-darkest hover:bg-primary-light hover:text-white hover:scale-105";
  
  const mobileNavLinkBaseClasses = "block px-3 py-3 rounded-md text-base font-medium";

  return (
    <nav 
      className={`sticky top-0 z-[100] transition-all duration-300 print:hidden
                 ${isScrolled || isMobileMenuOpen ? 'bg-white shadow-xl' : 'bg-white/80 backdrop-blur-md shadow-md'}`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group" aria-label="GoStays Home">
              <FaCompass className="h-8 w-8 md:h-9 md:w-9 text-primary group-hover:text-primary-dark transition-colors duration-300 transform group-hover:rotate-12" />
              <span className="font-display text-xl md:text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300">
                GoStays
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) => `${navLinkBaseClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
            >
              <FiHome size={18} className="opacity-80 group-hover:opacity-100" /> <span>Home</span>
            </NavLink>
            <NavLink
              to="/listings"
              className={({ isActive }) => `${navLinkBaseClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
            >
              <FiMapPin size={18} className="opacity-80 group-hover:opacity-100" /> <span>Explore</span>
            </NavLink>
            <SignedIn>
              <NavLink
                to="/listings/new"
                className={({ isActive }) => `${navLinkBaseClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
              >
                <FiPlusSquare size={18} className="opacity-80 group-hover:opacity-100" /> <span>Add Stay</span>
              </NavLink>
            </SignedIn>
          </div>

          {/* Search Bar (Desktop - Visual Placeholder) */}
          <div className="hidden lg:flex items-center flex-grow max-w-xs xl:max-w-sm mx-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search destinations, experiences..."
                className="pl-10 pr-4 py-2.5 rounded-full border border-neutral-light focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-300 w-full text-sm shadow-sm"
                aria-label="Search"
              />
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-dark" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Theme Toggle Example - Uncomment and implement if needed
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-neutral-light transition-colors">
              {theme === 'light' ? <FiMoon className="text-neutral-darkest" /> : <FiSun className="text-yellow-400"/>}
            </button>
            */}
             <SignedIn>
              <div className="hidden md:block">
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 md:w-10 md:h-10 ring-2 ring-primary-light ring-offset-1 hover:ring-primary transition-all",
                    userButtonPopoverCard: "shadow-sleek-lg rounded-xl mt-2",
                    userButtonPopoverActionButton: "text-sm",
                    userButtonPopoverFooterPagesItem: "text-xs"
                  }
                }} />
              </div>
            </SignedIn>

            {/* Auth Buttons & User Profile (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <SignedOut>
                <Link to="/sign-in" className="btn btn-outline-primary btn-sm whitespace-nowrap">
                  <FiLogIn className="mr-1.5"/> Sign In
                </Link>
                <Link to="/sign-up" className="btn btn-primary btn-sm whitespace-nowrap">
                  <FiUserPlus className="mr-1.5"/> Sign Up
                </Link>
              </SignedOut>
            </div>

            {/* Mobile Menu Button & UserButton */}
            <div className="md:hidden flex items-center">
              <SignedIn>
                <div className="mr-2">
                    <UserButton afterSignOutUrl="/" appearance={{elements: {userButtonAvatarBox: "w-8 h-8"}}} />
                </div>
              </SignedIn>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="p-2 rounded-md text-neutral-darkest hover:text-primary hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl z-[-1] pb-4 border-t border-neutral-light animate-fadeIn" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={({ isActive }) => `${mobileNavLinkBaseClasses} ${isActive ? 'text-primary bg-primary-light/30 font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`}>Home</NavLink>
            <NavLink to="/listings" className={({ isActive }) => `${mobileNavLinkBaseClasses} ${isActive ? 'text-primary bg-primary-light/30 font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`}>Explore</NavLink>
            <SignedIn>
              <NavLink to="/listings/new" className={({ isActive }) => `${mobileNavLinkBaseClasses} ${isActive ? 'text-primary bg-primary-light/30 font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`}>Add Stay</NavLink>
              <NavLink to="/profile" className={({ isActive }) => `${mobileNavLinkBaseClasses} ${isActive ? 'text-primary bg-primary-light/30 font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`}>My Profile</NavLink>
            </SignedIn>
            <SignedOut>
              <div className="mt-4 pt-4 border-t border-neutral-light space-y-2">
                <NavLink to="/sign-in" className="btn btn-outline-primary w-full text-center">Sign In</NavLink>
                <NavLink to="/sign-up" className="btn btn-primary w-full text-center">Sign Up</NavLink>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;