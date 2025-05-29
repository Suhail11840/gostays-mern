import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tailwind CSS and global styles
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';

// Import your publishable key from .env.local
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  // This will halt the app and make the error very clear in the console
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set in your .env.local file. Please add it to continue.");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure your index.html has <div id=\"root\"></div>.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);