import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaInstagramSquare, FaLinkedin, FaTwitterSquare } from 'react-icons/fa'; // Social icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-neutral-lightest shadow-inner mt-auto">
      <div className="container-app py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h5 className="font-display text-xl font-semibold mb-3 text-white">GoStays</h5>
            <p className="text-sm text-neutral-light mb-4">
              Discover unique places to stay and experiences that make your travels unforgettable.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-light hover:text-accent transition-colors">
                <FaFacebookSquare size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-light hover:text-accent transition-colors">
                <FaInstagramSquare size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-light hover:text-accent transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-light hover:text-accent transition-colors">
                <FaTwitterSquare size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-display text-lg font-semibold mb-3 text-white">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/listings" className="hover:text-accent transition-colors">Explore Stays</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-display text-lg font-semibold mb-3 text-white">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-light text-center text-sm text-neutral-light">
          <p>© {currentYear} GoStays. All rights reserved. Crafted with <span className="text-primary animate-pulseHalka">♥</span> by You.</p>
          {/* Add a small disclaimer or a link to your portfolio if you like */}
          <p className="mt-1 text-xs">This is a fictional project for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;