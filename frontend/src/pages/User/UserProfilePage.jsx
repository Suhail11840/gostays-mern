import React from 'react';
import { UserProfile } from '@clerk/clerk-react';
import { FiUser } from 'react-icons/fi';

const UserProfilePage = () => {
  return (
    <div className="container-app py-8 md:py-12 animate-fadeIn">
      <header className="mb-8 md:mb-10 text-center md:text-left">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary flex items-center justify-center md:justify-start">
          <FiUser className="mr-3 text-primary" /> My Profile
        </h1>
        <p className="text-neutral-dark mt-1">Manage your account settings, security, and connected accounts.</p>
      </header>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl"> {/* Control the max width of the UserProfile component */}
          <UserProfile 
            path="/profile" // Base path for UserProfile routing
            routing="path"  // Use path-based routing for its internal navigation
            appearance={{
              elements: {
                card: "shadow-sleek-lg rounded-xl",
                navbar: "border-b border-neutral-light",
                navbarButton: "font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary focus:text-primary",
                navbarButton__active: "text-primary border-b-2 border-primary",
                headerTitle: "font-display text-secondary text-xl",
                headerSubtitle: "text-sm text-neutral-dark",
                formFieldLabel: "text-sm font-medium text-neutral-darkest",
                formFieldInput: "input-field !py-2",
                formButtonPrimary: "btn btn-primary btn-sm",
                formButtonReset: "btn btn-ghost btn-sm",
                dividerLine: "bg-neutral-light",
                accordionTriggerButton: "font-medium text-neutral-darkest hover:bg-neutral-lightest",
                profileSectionTitleText: "font-display text-secondary",
                dangerSectionButton: "btn bg-red-600 hover:bg-red-700 text-white btn-sm",
                selectButton: "input-field !py-2", // For dropdowns like language selector
                
                // For a generally more compact feel
                // formFieldHintText: "text-xs",
                // formFieldSuccessText: "text-xs",
                // formFieldErrorText: "text-xs",
              },
              variables: {
                colorPrimary: '#FE424D',
                colorText: '#424242', // Your neutral-darkest approx
                colorBackground: '#ffffff', // Card background
                // borderRadius: '0.75rem', // Match your card's rounded-xl
              },
              layout: {
                // showHeader: true,
                // helpPageUrl: "/help",
                // privacyPageUrl: "/privacy",
                // termsPageUrl: "/terms",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;