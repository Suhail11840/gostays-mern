// frontend/src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, ClerkLoading, ClerkLoaded } from '@clerk/clerk-react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FullPageLoader from './components/common/FullPageLoader';

// Page Components (Lazy Loaded for better performance)
const HomePage = lazy(() => import('./pages/HomePage'));
const ListingsPage = lazy(() => import('./pages/Listings/ListingsPage'));
const ListingDetailPage = lazy(() => import('./pages/Listings/ListingDetailPage'));
const ListingCreatePage = lazy(() => import('./pages/Listings/ListingCreatePage'));
const ListingEditPage = lazy(() => import('./pages/Listings/ListingEditPage'));
const SignInPage = lazy(() => import('./pages/Auth/SignInPage'));
const SignUpPage = lazy(() => import('./pages/Auth/SignUpPage'));
const UserProfilePage = lazy(() => import('./pages/User/UserProfilePage')); // For Clerk's <UserProfile />
// const AdminDashboardPage = lazy(() => import('./pages/Admin/DashboardPage')); // Placeholder for admin

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userId, isLoaded } = useAuth(); // isLoaded from Clerk indicates if Clerk state is ready
  const location = useLocation();

  if (!isLoaded) {
    // While Clerk is determining auth state, show a loader
    return <FullPageLoader message="Verifying authentication..." />;
  }

  if (!userId) {
    // If Clerk is loaded and there's no userId, then redirect
    return <Navigate to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  // If Clerk is loaded and userId exists, render children
  return children;
};

// Admin Route Component (Placeholder - needs real role check)
// const AdminRoute = ({ children }) => {
//   const { userId, isLoaded, user } = useAuth();
//   const location = useLocation();
//   // In a real app, check for an 'admin' role from user.publicMetadata or organizationRoles
//   // const isAdmin = user?.publicMetadata?.role === 'admin' || user?.organizationMemberships?.some(m => m.role === 'org:admin');
//   const isAdmin = true; // Placeholder: REPLACE with actual admin check

//   if (!isLoaded) {
//     return <FullPageLoader message="Verifying admin access..." />;
//   }

//   if (!userId) { // Not signed in at all
//     return <Navigate to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname + location.search)}`} replace />;
//   }
//   if (!isAdmin) { // Signed in, but not admin
//     // return <Navigate to="/" replace state={{ message: "You do not have permission to access this page.", type: "error" }} />;
//      return (
//        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
//          <h1 className="text-4xl font-display text-red-600 mb-4">Access Denied</h1>
//          <p className="text-neutral-dark mb-8">You do not have permission to access this page.</p>
//          <Link to="/" className="btn btn-primary">Go Back Home</Link>
//        </div>
//      );
//   }
//   return children;
// };

// Main App Layout with Navbar and Footer
const AppLayout = () => (
  <div className="flex flex-col min-h-screen bg-neutral-lightest">
    <Navbar />
    {/* page-enter-active class can be used for page transition animations if you set them up */}
    <main className="flex-grow container-app py-6 md:py-8">
      <Suspense fallback={<FullPageLoader message="Loading page content..." />}>
        <Outlet /> {/* Child routes will render here */}
      </Suspense>
    </main>
    <Footer />
  </div>
);

// This component is essentially just an Outlet for auth pages now,
// if SignInPage/SignUpPage handle their own full-screen styling.
// If you want a shared minimal wrapper around auth pages, this is where it would go.
const AuthPagesWrapper = () => (
    <Suspense fallback={<FullPageLoader message="Loading authentication module..." />}>
      <Outlet />
    </Suspense>
);

function App() {
  const { isSignedIn } = useAuth(); // Get isSignedIn state here AFTER Clerk is loaded.

  return (
    <>
      {/* ClerkLoading shows a loader ONLY during the initial Clerk.js script load and initialization */}
      <ClerkLoading>
        <FullPageLoader message="Initializing GoStays..." />
      </ClerkLoading>

      {/* ClerkLoaded ensures that the rest of the app (especially logic depending on auth state)
          renders only AFTER Clerk has fully initialized and determined the auth state. */}
      <ClerkLoaded>
        <Routes>
          {/* Routes with Navbar and Footer */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="listings" element={<ListingsPage />} />
            <Route path="listings/:id" element={<ListingDetailPage />} />

            {/* Protected Routes */}
            <Route
              path="listings/new"
              element={<ProtectedRoute><ListingCreatePage /></ProtectedRoute>}
            />
            <Route
              path="listings/:id/edit"
              element={<ProtectedRoute><ListingEditPage /></ProtectedRoute>}
            />
            <Route
              path="profile/*" // Clerk's UserProfile manages its own sub-routes
              element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>}
            />

            {/* Example of an Admin Route (currently commented out) */}
            {/* <Route 
              path="admin/*" 
              element={<AdminRoute><AdminDashboardPage /></AdminRoute>} 
            /> */}
          </Route>

          {/* Auth Routes:
              - We check `isSignedIn` state provided by `useAuth()`.
              - If signed in and trying to access auth pages, redirect to home.
              - If signed out, show the respective auth page.
              - SignInPage and SignUpPage are lazy-loaded, so they need Suspense.
          */}
          <Route
            path="/sign-in/*"
            element={
              isSignedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Suspense fallback={<FullPageLoader message="Loading Sign In..." />}>
                  <SignInPage />
                </Suspense>
              )
            }
          />
          <Route
            path="/sign-up/*"
            element={
              isSignedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Suspense fallback={<FullPageLoader message="Loading Sign Up..." />}>
                  <SignUpPage />
                </Suspense>
              )
            }
          />
          
          {/* Fallback for unmatched routes (Simple 404 page) */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-neutral-lightest">
              <div className="bg-white p-8 md:p-12 rounded-xl shadow-sleek-lg">
                <h1 className="text-6xl font-display text-primary mb-4 animate-pulseHalka">404</h1>
                <h2 className="text-3xl font-semibold text-secondary mb-6">Page Not Found</h2>
                <p className="text-neutral-dark mb-8 max-w-md mx-auto">
                  Oops! It seems the page you're looking for has taken a detour.
                  Let's get you back on track.
                </p>
                <Link to="/" className="btn btn-primary">
                  Go Back Home
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </ClerkLoaded>
    </>
  );
}

export default App;