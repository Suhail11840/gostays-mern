import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, ClerkLoading } from '@clerk/clerk-react';

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
  const { userId, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    // ClerkLoading can also be used here for a Clerk-specific loading state
    return <FullPageLoader message="Verifying authentication..." />;
  }

  if (!userId) {
    // Redirect to sign-in, preserving the intended destination
    return <Navigate to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return children;
};

// Admin Route Component (Basic placeholder - needs real role check)
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
//     return <Navigate to="/" replace state={{ message: "You do not have permission to access this page.", type: "error" }} />;
//   }
//   return children;
// };

// Main App Layout with Navbar and Footer
const AppLayout = () => (
  <div className="flex flex-col min-h-screen bg-neutral-lightest">
    <Navbar />
    <main className="flex-grow container-app py-6 md:py-8 page-enter-active"> {/* Added animation class */}
      <Suspense fallback={<FullPageLoader message="Loading page content..." />}>
        <Outlet /> {/* Child routes will render here */}
      </Suspense>
    </main>
    <Footer />
  </div>
);

// Layout for Auth pages (minimal, no main Navbar/Footer)
const AuthLayout = () => (
  <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-primary-light via-primary to-gradientTo p-4">
    <Suspense fallback={<FullPageLoader message="Loading authentication..." />}>
      <Outlet />
    </Suspense>
  </div>
);


function App() {
  return (


    <>

      <ClerkLoading> {/* Shows FullPageLoader while Clerk is initializing */}
        <FullPageLoader message="Initializing application..." />
      </ClerkLoading>

      {/* Use a fragment for multiple top-level elements if ClerkLoading is not used here */}
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="listings/:id" element={<ListingDetailPage />} />

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

        {/* Auth Routes with a different, minimal layout */}
        <Route element={<AuthLayout />}>
          <Route
            path="/sign-in/*"
            element={
              <SignedIn>
                <Navigate to="/" />
              </SignedIn>
            }
          />
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <SignInPage />
              </SignedOut>
            }
          />

          <Route
            path="/sign-up/*"
            element={
              <SignedIn>
                <Navigate to="/" />
              </SignedIn>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            }
          />
        </Route>

        {/* Fallback for unmatched routes (Optional - create a NotFoundPage.jsx) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-6xl font-display text-primary mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-secondary mb-6">Page Not Found</h2>
            <p className="text-neutral-dark mb-8">Oops! The page you're looking for doesn't seem to exist.</p>
            <Link to="/" className="btn btn-primary">Go Back Home</Link>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;