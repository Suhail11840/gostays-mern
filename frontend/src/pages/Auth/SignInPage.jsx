import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';


const SignInPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1D3557 0%, #FE424D 100%)',
      }}
    >
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
        <h1 className="font-display text-4xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-neutral-lightest text-lg">Sign in to continue your GoStays adventure.</p>
      </div>
      <div className="w-full max-w-md p-8 md:p-10 rounded-xl ">
        <SignIn 
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
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
              socialButtonsBlockButton: 'border-neutral-light hover:bg-neutral-lightest',
              formFieldInput: 'input-field',
              footerActionLink: 'text-primary hover:text-primary-dark font-semibold'
            }
          }}
        />
      </div>
      <p className="mt-8 text-center text-sm text-neutral-lightest">
        Don't have an account?{' '}
        <Link to="/sign-up" className="font-semibold text-white hover:underline">
          Sign Up Here
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;