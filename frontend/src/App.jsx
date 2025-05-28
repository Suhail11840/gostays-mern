import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut } from '@clerk/clerk-react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FullPageLoader from './components/common/FullPageLoader'; // We'll create this

// Page Components (Lazy Loaded for better performance)
const HomePage = lazy(() => import('./pages/HomePage'));
const ListingsPage = lazy(() => import('./pages/Listings/ListingsPage'));
const ListingDetailPage = lazy(() => import('./pages/Listings/ListingDetailPage'));
const ListingCreatePage = lazy(() => import('./pages/Listings/ListingCreatePage'));
const ListingEditPage = lazy(() => import('./pages/Listings/ListingEditPage'));
const SignInPage = lazy(() => import('./pages/Auth/SignInPage'));
const SignUpPage = lazy(() => import('./pages/Auth/SignUpPage'));
const UserProfilePage = lazy(() => import('./pages/User/UserProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/Admin/DashboardPage')); // Placeholder for admin

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return <FullPageLoader message="Authenticating..." />;
  }

  if (!userId) {
    // If not signed in, redirect to sign-in page
    // You can pass the intended path to redirect back after sign-in
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

// Admin Route Component (Placeholder - needs role check from backend/Clerk custom claims)
const AdminRoute = ({ children }) => {
  const { userId, isLoaded, user } = useAuth(); // Clerk's user object
  // In a real app, you'd check for an 'admin' role from `user.publicMetadata` or custom claims
  // For now, we'll just check if signed in.
  // const isAdmin = user?.publicMetadata?.role === 'admin'; // Example
  const isAdmin = true; // Placeholder: replace with actual admin check

  if (!isLoaded) {
    return <FullPageLoader message="Verifying admin access..." />;
  }

  if (!userId || !isAdmin) {
    return <Navigate to="/" replace />; // Redirect non-admins to home
  }
  return children;
};


// Main App Layout
const AppLayout = () => (
  <div className="flex flex-col min-h-screen bg-neutral-lightest">
    <Navbar />
    <main className="flex-grow container-app py-6 md:py-10">
      <Suspense fallback={<FullPageLoader message="Loading page..." />}>
        <Outlet /> {/* Child routes will render here */}
      </Suspense>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Routes with Navbar and Footer */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        
        {/* Protected Routes */}
        <Route path="listings/new" element={<ProtectedRoute><ListingCreatePage /></ProtectedRoute>} />
        <Route path="listings/:id/edit" element={<ProtectedRoute><ListingEditPage /></ProtectedRoute>} />
        <Route path="profile/*" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} /> {/* Clerk UserProfile page often has sub-routes */}

        {/* Admin Routes (Placeholder) */}
        <Route path="admin/*" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      </Route>

      {/* Auth Routes (Typically standalone without full Navbar/Footer or with a minimal one) */}
      <Route path="/sign-in/*" element={<SignedOut><SignInPage /></SignedOut>} />
      <Route path="/sign-up/*" element={<SignedOut><SignUpPage /></SignedOut>} />
      
      {/* Redirect signed in users trying to access sign-in/sign-up */}
      <Route path="/sign-in/*" element={<SignedIn><Navigate to="/" /></SignedIn>} />
      <Route path="/sign-up/*" element={<SignedIn><Navigate to="/" /></SignedIn>} />

      {/* Fallback for unmatched routes (optional) */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;