import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';

const SignUpPage = () => {
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
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in" 
          afterSignUpUrl={redirectUrl} // Redirect after successful sign-up (often to home or onboarding)
          appearance={{
            elements: {
              card: "shadow-none border-none",
              headerTitle: "font-display text-secondary",
              headerSubtitle: "text-neutral-dark",
              socialButtonsBlockButton: "border-neutral-light hover:bg-neutral-lightest",
              socialButtonsBlockButtonText: "text-neutral-darkest",
              formFieldLabel: "text-neutral-darkest font-medium",
              formFieldInput: "input-field !py-2",
              formButtonPrimary: "btn btn-primary w-full !text-base",
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
        Already have an account?{' '}
        <Link 
            to={`/sign-in${redirectUrl !== '/' ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`} 
            className="font-semibold text-white hover:text-primary-light underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;