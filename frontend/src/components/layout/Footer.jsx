import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa'; // Using specific icons
import { FaCompass } from 'react-icons/fa'; // For brand icon

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/suhail11840/gostays-mern", icon: FaGithub, label: "GitHub" },
    // Add more actual social links if you have them
    // { href: "https://facebook.com", icon: FaFacebookF, label: "Facebook" },
    // { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    // { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
    // { href: "https://linkedin.com", icon: FaLinkedinIn, label: "LinkedIn" },
  ];

  const footerSections = [
    {
      title: 'Navigate',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Explore Stays', path: '/listings' },
        { label: 'About Us', path: '/about' }, // Placeholder
        { label: 'Contact', path: '/contact' }, // Placeholder
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' }, // Placeholder
        { label: 'FAQ', path: '/faq' }, // Placeholder
        { label: 'Report an Issue', path: '/report-issue' }, // Placeholder
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy-policy' }, // Placeholder
        { label: 'Terms of Service', path: '/terms-of-service' }, // Placeholder
        { label: 'Cookie Policy', path: '/cookie-policy' }, // Placeholder
      ],
    },
  ];

  return (
    <footer className="bg-secondary text-neutral-lightest border-t-4 border-primary-light mt-auto print:hidden">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand and Social */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center mb-4 group">
              <FaCompass className="h-9 w-9 text-primary group-hover:text-primary-light transition-colors" />
              <span className="ml-2 font-display text-2xl font-bold text-white group-hover:text-primary-light transition-colors">
                GoStays
              </span>
            </Link>
            <p className="text-sm text-neutral-light mb-6 leading-relaxed">
              Your compass to unforgettable stays and adventures around the world. Discover, book, and explore with ease.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-neutral-light hover:text-accent transition-colors duration-200 transform hover:scale-110"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h5 className="font-display text-lg font-semibold text-white mb-4 tracking-wider uppercase">
                {section.title}
              </h5>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-neutral-light hover:text-accent hover:underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-light/50 text-center text-xs text-neutral-light">
          <p>
            © {currentYear} GoStays by Suhail. All Rights Reserved.
          </p>
          <p className="mt-1">
            This is a project built for learning and demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;