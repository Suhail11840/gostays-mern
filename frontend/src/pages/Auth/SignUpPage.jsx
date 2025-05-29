import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 overflow-hidden">
      {/* Cool animated gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #FE424D 0%, #1D3557 100%)',
          filter: 'blur(0px)',
        }}
      >
        {/* Extra gradient overlays for depth */}
        <div
          className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #FE424D 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 70% 70%, #1D3557 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #FE424D 0%, #1D3557 100%)',
            filter: 'blur(120px)',
          }}
        />
      </div>
      <div className="absolute top-6 left-6">
         <Link 
          to="/" 
          className="flex items-center text-white hover:text-neutral-lightest transition-colors duration-300 group"
          title="Back to Home"
        >
          <FiArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </div>
      <div className="text-center mb-8">
        <Link to="/" className="inline-block mb-6">
          <FaCompass className="h-16 w-16 text-white mx-auto" />
        </Link>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Join GoStays!</h1>
        <p className="text-neutral-lightest text-lg">Create an account to discover and share amazing places.</p>
      </div>
      <div className="w-full max-w-md p-8 md:p-10 rounded-xl">
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: '#FE424D',
              colorText: '#1D3557',
              borderRadius: '0.75rem',
            },
            elements: {
              formButtonPrimary: 'btn btn-primary w-full text-base py-3',
              card: 'shadow-none border-none',
              headerTitle: 'font-display text-2xl font-semibold text-secondary',
              headerSubtitle: 'text-neutral-dark',
              formFieldInput: 'input-field',
              footerActionLink: 'text-primary hover:text-primary-dark font-semibold'
            }
          }}
        />
      </div>
      <p className="mt-8 text-center text-sm text-neutral-lightest">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-semibold text-white hover:underline">
          Sign In Here
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;