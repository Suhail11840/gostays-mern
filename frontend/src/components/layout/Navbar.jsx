import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { FiHome, FiMapPin, FiPlusCircle, FiSearch, FiMenu, FiX, FiLogIn, FiUserPlus } from 'react-icons/fi'; // Using react-icons/fi
import { FaCompass } from 'react-icons/fa'; // For brand icon

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const navLinkClasses = "px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out";
  const activeNavLinkClasses = "bg-primary-dark text-white shadow-md";
  const inactiveNavLinkClasses = "text-neutral-darkest hover:bg-primary-light hover:text-white";

  const mobileNavLinkClasses = "block px-3 py-2 rounded-md text-base font-medium";

  return (
    <nav className="bg-white shadow-sleek sticky top-0 z-50">
      <div className="container-app">
        <div className="flex items-center justify-between h-20"> {/* Increased height */}
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <FaCompass className="h-10 w-10 text-primary group-hover:text-primary-dark transition-colors duration-300" /> {/* Larger icon */}
              <span className="font-display text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300">
                GoStays
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
            >
              <FiHome className="inline-block mr-1 mb-1" /> Home
            </NavLink>
            <NavLink
              to="/listings"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
            >
              <FiMapPin className="inline-block mr-1 mb-1" /> Explore
            </NavLink>
            <SignedIn>
              <NavLink
                to="/listings/new"
                className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}
              >
                <FiPlusCircle className="inline-block mr-1 mb-1" /> Add Listing
              </NavLink>
            </SignedIn>
          </div>

          {/* Search Bar (Desktop - Can be made functional later) */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="search"
                placeholder="Search destinations..."
                className="pl-10 pr-4 py-2 rounded-full border border-neutral-light focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all duration-300 w-64"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-dark" />
            </div>
          </div>
          
          {/* Auth Buttons & User Profile (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedOut>
              <Link to="/sign-in" className="btn btn-outline-primary text-sm px-4 py-2">
                <FiLogIn className="inline-block mr-1 mb-px"/> Sign In
              </Link>
              <Link to="/sign-up" className="btn btn-primary text-sm px-4 py-2">
                 <FiUserPlus className="inline-block mr-1 mb-px"/> Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10", // Custom size for avatar
                  userButtonPopoverCard: "shadow-sleek-lg rounded-xl",
                }
              }} />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <SignedIn>
               <div className="mr-2"><UserButton afterSignOutUrl="/" /></div>
            </SignedIn>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
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

      {/* Mobile Menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-40 pb-3" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? 'text-primary font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/listings" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? 'text-primary font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`} onClick={() => setIsMobileMenuOpen(false)}>Explore</NavLink>
            <SignedIn>
              <NavLink to="/listings/new" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? 'text-primary font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`} onClick={() => setIsMobileMenuOpen(false)}>Add Listing</NavLink>
            </SignedIn>
            <SignedOut>
              <NavLink to="/sign-in" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? 'text-primary font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`} onClick={() => setIsMobileMenuOpen(false)}>Sign In</NavLink>
              <NavLink to="/sign-up" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? 'text-primary font-semibold' : 'text-neutral-darkest hover:bg-neutral-light'}`} onClick={() => setIsMobileMenuOpen(false)}>Sign Up</NavLink>
            </SignedOut>
            {/* Mobile Search (Optional) */}
            <div className="px-2 pt-2">
                <input type="search" placeholder="Search..." className="w-full pl-4 pr-4 py-2 rounded-full border border-neutral-light focus:ring-primary-light focus:border-primary-light"/>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;