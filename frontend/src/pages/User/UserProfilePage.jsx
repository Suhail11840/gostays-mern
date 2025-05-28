import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

const UserProfilePage = () => {
  return (
    <div className="container-app py-8 animate-fadeIn">
      <h1 className="text-3xl font-display font-bold text-secondary-dark mb-8 text-center md:text-left">
        Your Profile
      </h1>
      <div className="flex justify-center">
        <UserProfile 
          path="/profile" // Base path for user profile routes (e.g., /profile/security)
          routing="path"  // Use path-based routing
          appearance={{
            elements: {
              card: "shadow-sleek-lg w-full max-w-3xl", // Ensure it fits well
              navbar: "hidden md:flex", // Example: hide internal navbar on mobile if you have your own
              navbarButton: "text-neutral-dark hover:text-primary",
              profileSectionTitleText: "font-display text-secondary-dark",
              formFieldInput: "input-field",
              formButtonPrimary: "btn btn-primary",
              accordionTriggerButton: "hover:bg-neutral-lightest"
            }
          }}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;