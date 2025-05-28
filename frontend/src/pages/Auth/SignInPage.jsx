import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light via-primary to-primary-dark p-4">
       <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center space-x-2 group">
            <FaCompass className="h-10 w-10 text-white group-hover:text-neutral-lightest transition-colors duration-300" />
            <span className="font-display text-2xl font-bold text-white group-hover:text-neutral-lightest transition-colors duration-300">
              GoStays
            </span>
        </Link>
      </div>
      <div className="animate-fadeIn">
        <SignIn
          path="/sign-in" // Clerk component path
          routing="path"  // Use path-based routing
          signUpUrl="/sign-up" // Link to your sign-up page
          redirectUrl="/" // Redirect after successful sign-in
          appearance={{
            elements: {
              card: "shadow-sleek-lg bg-white rounded-2xl",
              headerTitle: "font-display text-secondary-dark",
              headerSubtitle: "text-neutral-dark",
              socialButtonsBlockButton: "border-neutral-light hover:bg-neutral-lightest",
              formFieldInput: "input-field",
              formButtonPrimary: "btn btn-primary w-full",
              footerActionLink: "text-primary hover:text-primary-dark font-semibold"
            }
          }}
        />
      </div>
      <p className="mt-8 text-center text-sm text-neutral-lightest">
        Don't have an account?{' '}
        <Link to="/sign-up" className="font-semibold text-white hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;