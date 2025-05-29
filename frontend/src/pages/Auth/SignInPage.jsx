import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';

const SignInPage = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
      <Link to="/" className="inline-flex items-center mb-8 group">
        <FaCompass className="h-10 w-10 text-white group-hover:text-primary-light transition-colors" />
        <span className="ml-3 font-display text-3xl font-bold text-white group-hover:text-primary-light transition-colors">
          GoStays
        </span>
      </Link>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up" 
          afterSignInUrl={redirectUrl} // Redirect after successful sign-in
          appearance={{
            elements: {
              card: "shadow-none border-none", // Remove Clerk's default card shadow if we have our own
              headerTitle: "font-display text-secondary",
              headerSubtitle: "text-neutral-dark",
              socialButtonsBlockButton: "border-neutral-light hover:bg-neutral-lightest",
              socialButtonsBlockButtonText: "text-neutral-darkest",
              formFieldLabel: "text-neutral-darkest font-medium",
              formFieldInput: "input-field !py-2", // Use our custom input-field style
              formButtonPrimary: "btn btn-primary w-full !text-base", // Use our custom button styles
              footerActionText: "text-sm text-neutral-dark",
              footerActionLink: "text-primary hover:text-primary-dark font-semibold",
              dividerLine: "bg-neutral-light",
              dividerText: "text-neutral-dark text-sm",
            },
            variables: {
                colorPrimary: '#FE424D', // Your primary color
            }
          }}
        />
      </div>
       <p className="mt-8 text-center text-sm text-white/80">
        Don't have an account?{' '}
        <Link 
            to={`/sign-up${redirectUrl !== '/' ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`} 
            className="font-semibold text-white hover:text-primary-light underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;