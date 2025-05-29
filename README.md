# 🏨 GoStays - Your Journey, Your Stay

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/your-username/suhail11840-gostays-mern.svg?style=social&label=Star&maxAge=2592000)](https://github.com/your-username/suhail11840-gostays-mern/stargazers/)
[![Forks](https://img.shields.io/github/forks/your-username/suhail11840-gostays-mern.svg?style=social&label=Fork&maxAge=2592000)](https://github.com/your-username/suhail11840-gostays-mern/network/)

**GoStays** is a full-stack MERN application designed to be a modern, user-friendly platform for discovering, listing, and reviewing unique accommodations. Think of it as a feature-rich starting point for an Airbnb-like experience, built with a focus on clean code, modern technologies, and a great user experience.

---

<!-- Optional: Add a Banner/Logo here -->
<!-- <p align="center">
  <img src="path/to/your/banner_or_logo.png" alt="GoStays Banner" width="700"/>
</p> -->

---

## 🌟 Live Demo

**(Placeholder: Add your live demo link here if you deploy it!)**
`[Link to Live Demo]`

---

## 📸 Screenshots

**(Placeholder: Add screenshots of your application here!)**
*   *Homepage*
*   *Listings Page*
*   *Listing Detail Page*
*   *Create Listing Form*
*   *User Profile (Clerk)*

---

## 📋 Table of Contents

*   [About The Project](#about-the-project)
*   [Tech Stack](#-tech-stack)
*   [Key Features](#-key-features)
    *   [Implemented Features](#-implemented-features)
    *   [Future Enhancements](#-future-enhancements)
*   [Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Cloning the Repository](#cloning-the-repository)
    *   [Backend Setup](#-backend-setup)
    *   [Frontend Setup](#-frontend-setup)
*   [Project Structure](#-project-structure)
*   [Contributing](#-contributing)
*   [License](#-license)
*   [Contact](#-contact)

---

## 🗺️ About The Project

GoStays aims to provide a seamless experience for both travelers looking for unique places to stay and hosts wanting to list their properties. It emphasizes ease of use, robust functionality, and a visually appealing interface.

**Core Goals:**
*   Allow users to securely sign up, log in, and manage their profiles.
*   Enable hosts to create, manage, and showcase their property listings with multiple images and detailed information.
*   Facilitate travelers in discovering listings through search, filtering, and category browsing.
*   Provide a transparent review system for users to share their experiences.
*   Integrate mapping services for easy location visualization.

---

## 🛠️ Tech Stack

This project leverages a modern MERN stack along with several powerful services and libraries:

### Backend
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** NoSQL document database.
*   **Mongoose:** Elegant MongoDB object modeling for Node.js.
*   **Clerk (Backend SDK):** For user authentication (session management, JWTs) and webhook integration to sync user data.
*   **TomTom Maps API:** For geocoding listing addresses to geographical coordinates.
*   **Multer:** Middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **Joi:** Powerful schema description language and data validator.
*   **`jsonwebtoken` & `bcryptjs` (Typically used but Clerk handles core auth):** If custom auth was needed.
*   **`dotenv`:** For managing environment variables.
*   **`cors`:** For enabling Cross-Origin Resource Sharing.

### Frontend
*   **React 19:** A JavaScript library for building user interfaces.
*   **Vite:** Next-generation frontend tooling for fast development and optimized builds.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Clerk (React SDK):** For frontend authentication components (`<SignIn>`, `<SignUp>`, `<UserButton>`, hooks).
*   **React Router DOM v7:** For client-side routing and navigation.
*   **Axios:** Promise-based HTTP client for the browser and Node.js.
*   **React Icons:** Popular icon library.
*   **Poppins & Montserrat:** Modern, clean fonts for UI text and display.

### Database
*   **MongoDB Atlas / Local MongoDB Instance:** Flexible NoSQL database.

---

## ✨ Key Features

### ✅ Implemented Features

1.  **Secure User Authentication (via Clerk):**
    *   Seamless Sign Up & Sign In flows.
    *   Social logins (if configured in Clerk dashboard).
    *   User profile management (via Clerk's `<UserProfile />`).
    *   Automatic synchronization of user data (Clerk ID, email, username, profile image) to the local MongoDB database via webhooks and on-demand sync middleware.
2.  **Comprehensive Listing Management (CRUD):**
    *   **Create Listings:** Authenticated users can create new property listings.
        *   Input fields for title, description, price, location (address), country, and category.
        *   Support for **multiple images per listing**:
            *   Users can upload image files directly.
            *   Users can provide external image URLs.
        *   Automatic geocoding of the provided location to latitude/longitude using TomTom API.
    *   **Read Listings:**
        *   View all listings with primary image, title, category, price, and location.
        *   Detailed listing page showing all information, all images in a carousel, owner details, and reviews.
    *   **Update Listings:** Listing owners can edit their existing properties, including image management (add new, keep existing, remove old). Location updates trigger re-geocoding.
    *   **Delete Listings:** Listing owners can delete their properties. Associated reviews and locally uploaded images are also removed.
3.  **Interactive Review System:**
    *   Authenticated users can submit reviews (rating from 1-5 and a textual comment) for listings.
    *   Reviews are displayed on the listing detail page, showing author and creation date.
    *   Review authors can delete their own reviews.
4.  **Backend Geocoding:**
    *   Addresses provided for listings are converted into geographic coordinates (latitude, longitude) on the backend using the TomTom API. These coordinates are stored with the listing for future map display.
5.  **Basic Search & Filtering (Frontend):**
    *   Users can search listings by keywords (title, location, country).
    *   Filter listings by predefined categories (e.g., Beach, Mountains, City).
6.  **Image Handling:**
    *   Backend support for storing both uploaded images (served statically) and external image URLs.
    *   Frontend image carousel to display multiple images on listing cards and detail pages.
7.  **Responsive Design:**
    *   The frontend is built with Tailwind CSS, aiming for a responsive experience across various screen sizes.
8.  **Well-Structured API:**
    *   RESTful API endpoints for managing listings, reviews, and users.
    *   Joi validation for request payloads on the backend.
    *   Role-based authorization (owner checks for editing/deleting resources).

### 🚀 Future Enhancements

1.  **Advanced Frontend Mapping (TomTom/MapLibre GL JS):**
    *   Display listings on an interactive map on the `ListingsPage`.
    *   Show a map with a marker on the `ListingDetailPage`.
2.  **Enhanced Search & Filtering:**
    *   Filter by price range, amenities, number of guests, availability dates.
    *   Sort listings by price, rating, recency.
3.  **Booking System:**
    *   Calendar-based availability for listings.
    *   Users can request to book stays.
    *   Hosts can manage bookings (accept/reject).
    *   (Potentially) Payment gateway integration (Stripe, PayPal).
4.  **Simple Real-Time Chat:**
    *   Allow authenticated users (e.g., guest and host of a specific listing or booking) to communicate.
    *   Could use WebSockets (e.g., Socket.IO) for basic real-time messaging.
5.  **User Notifications:**
    *   In-app or email notifications for booking confirmations, new reviews, new messages.
6.  **Admin Dashboard Enhancements:**
    *   Full CRUD operations for users, listings, and reviews.
    *   Site statistics and analytics.
    *   Content moderation tools.
7.  **Image Optimization & Storage:**
    *   Use a cloud storage service (e.g., Cloudinary, AWS S3) for robust image hosting.
    *   Implement image optimization (resizing, compression, format conversion) on upload.
8.  **Comprehensive Testing:**
    *   Unit tests for backend controllers and services.
    *   Integration tests for API endpoints.
    *   Frontend component tests and end-to-end tests (e.g., using Cypress or Playwright).
9.  **SSR/SSG (Server-Side Rendering/Static Site Generation):**
    *   Explore Vite's SSR capabilities for improved SEO and initial page load performance for public-facing pages like listing details.
10. **User Experience (UX) Polish:**
    *   Advanced animations and transitions.
    *   Accessibility (a11y) improvements.
    *   Loading skeletons for better perceived performance.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** Version 20.15.0 or later (check `.nvmrc` or `package.json` engines).
    *   We recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage Node.js versions.
*   **npm** (Node Package Manager) or **yarn**.
*   **MongoDB:** A running instance of MongoDB (local or a free tier on MongoDB Atlas).
*   **Clerk Account:**
    *   Sign up for a free account at [Clerk.dev](https://clerk.dev/).
    *   Create a new application in your Clerk dashboard.
    *   Note down your **Publishable Key**, **Secret Key**, and **Webhook Signing Secret**.
*   **TomTom Developer Account:**
    *   Sign up for a free account at [TomTom Developer Portal](https://developer.tomtom.com/).
    *   Create an API Key for the Maps and Search APIs.

### Cloning the Repository

```bash
git clone https://github.com/Suhail11840/gostays-mern.git
cd gostays-mern
```

### ⚙️ Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Create an environment file:**
    Duplicate the `.env.example` (if provided) or create a new file named `.env` in the `backend` directory and add the following environment variables:

    ```env
    MONGO_URI="your_mongodb_connection_string" # e.g., mongodb://localhost:27017/gostays_db or Atlas URI
    PORT=8080 # Or any port you prefer for the backend

    CLIENT_URL="http://localhost:5173" # Default Vite frontend URL

    # Clerk Credentials
    CLERK_SECRET_KEY="your_clerk_secret_key_from_dashboard"
    # CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key" # Not strictly needed backend, but good to have
    CLERK_WEBHOOK_SIGNING_SECRET="your_clerk_webhook_signing_secret"

    # TomTom API Key
    MAP_TOKEN="your_tomtom_api_key"

    # Server Base URL (for constructing public URLs for uploads)
    SERVER_BASE_URL="http://localhost:8080" # Should match your backend's host and port
    ```

4.  **Configure Clerk Webhook (Important for User Sync):**
    *   In your Clerk Dashboard, go to your application settings.
    *   Navigate to "Webhooks".
    *   Click "Add Endpoint".
    *   For the **Endpoint URL**, use `YOUR_BACKEND_URL/api/users/webhook/clerk`.
        *   If running locally and need to expose your backend to the internet for Clerk, use a tool like [ngrok](https://ngrok.com/): `ngrok http 8080`. Then the URL would be `https://your-ngrok-subdomain.ngrok.io/api/users/webhook/clerk`.
    *   For **Message signing secret**, paste the `CLERK_WEBHOOK_SIGNING_SECRET` you got from Clerk and put in your `.env`.
    *   Select the events to listen to: `user.created`, `user.updated`, `user.deleted`.
    *   Save the webhook.

5.  **Run the backend server:**
    ```bash
    npm run dev # For development with Nodemon (auto-restarts on file changes)
    # or
    # npm start # For production
    ```
    The backend server should now be running (typically on `http://localhost:8080`).

### 🖼️ Frontend Setup

1.  **Navigate to the frontend directory (from the project root):**
    ```bash
    cd ../frontend
    # or if you are in the root:
    # cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Create an environment file:**
    Create a file named `.env.local` in the `frontend` directory and add the following:

    ```env
    VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key_from_dashboard"
    VITE_API_BASE_URL="http://localhost:8080/api" # URL of your backend API
    ```
    *   Ensure `VITE_API_BASE_URL` points to where your backend is running.

4.  **Configure Clerk Frontend:**
    *   In your Clerk Dashboard, ensure your application's "Frontend API Keys" section has the correct domains listed for development (e.g., `http://localhost:5173`) and production.

5.  **Run the frontend development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The frontend development server should now be running, typically on `http://localhost:5173`.

---

## 📂 Project Structure

The project is organized into two main directories: `backend` and `frontend`.

```
└── suhail11840-gostays-mern/
    ├── backend/
    │   ├── .env                  # Backend environment variables (ignored by Git)
    │   ├── package.json
    │   ├── server.js             # Main backend entry point
    │   ├── public/               # For static assets like uploaded images
    │   │   └── uploads/          # Uploaded images storage
    │   ├── controllers/          # Request handlers (business logic)
    │   ├── middleware/           # Custom Express middleware (auth, validation, multer)
    │   ├── models/               # Mongoose schemas and models
    │   ├── routes/               # API route definitions
    │   └── utils/                # Utility functions (error handlers, etc.)
    │
    └── frontend/
        ├── .env.local            # Frontend environment variables (ignored by Git)
        ├── package.json
        ├── vite.config.js        # Vite configuration
        ├── tailwind.config.js    # Tailwind CSS configuration
        ├── postcss.config.js     # PostCSS configuration
        ├── public/               # Static assets for Vite build
        └── src/
            ├── main.jsx          # Main entry point for React
            ├── App.jsx           # Root component with routing
            ├── index.css         # Global styles and Tailwind imports
            ├── assets/           # Local images, fonts for frontend
            ├── components/       # Reusable UI components (common, layout, feature-specific)
            ├── pages/            # Page-level components
            ├── services/         # API call functions (e.g., using Axios)
            └── ...               # Other frontend specific folders (contexts, hooks, etc.)
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE.txt` (you'll need to create this file) for more information.

A common `LICENSE.txt` for MIT:
```
MIT License

Copyright (c) [Year] [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📧 Contact

Suhail Panhwer - [@your_twitter_handle](https://twitter.com/your_twitter_handle) - your.email@example.com

Project Link: [https://github.com/your-username/suhail11840-gostays-mern](https://github.com/your-username/suhail11840-gostays-mern)

---

**Note on LaTeX:**
For complex mathematical expressions, you can use LaTeX within Markdown like this:
Inline math: `$E = mc^2$` which renders as $E = mc^2$.
Block math:
`$$ \sum_{i=1}^{n} x_i = x_1 + x_2 + \dots + x_n $$`
Which renders as:
$$ \sum_{i=1}^{n} x_i = x_1 + x_2 + \dots + x_n $$
However, for a project like GoStays, this is typically not needed in the README. Well-formatted code blocks (as used above) are standard.
```

**Remember to:**

1.  **Replace placeholders:**
    *   `your-username` with your GitHub username.
    *   `[Link to Live Demo]`
    *   Add actual screenshots.
    *   Update contact information.
    *   Fill in the year and your name/organization in the `LICENSE.txt` content if you create one.
2.  **Create a `LICENSE.txt` file** in your project root if you want to include the full MIT license text.
3.  Add this `README.md` to the root of your `suhail11840-gostays-mern` project.

**Commit Message Suggestion for this README:**

```
docs: Create comprehensive and professional README

- Added detailed project overview, tech stack, and features.
- Included setup instructions for backend and frontend.
- Outlined project structure and future enhancements.
- Added placeholders for live demo and screenshots.
- Included contribution guidelines and license information.
```



# Folder structure
```
└── gostays-mern-local/
    ├── backend/
    │   ├── .env                  # Backend environment variables
    │   ├── package.json
    │   ├── server.js             # Main backend entry point
    │   ├── middleware/
    │   │   ├── clerkAuth.js        # Clerk authentication middleware
    │   │   └── validateRequest.js  # Joi validation & authorization
    │   ├── controllers/
    │   │   ├── listingController.js
    │   │   ├── reviewController.js
    │   │   └── userController.js   # For Clerk webhooks & app-specific user data
    │   ├── models/
    │   │   ├── Listing.js
    │   │   ├── Review.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── listingRoutes.js
    │   │   ├── reviewRoutes.js
    │   │   └── userRoutes.js
    │   └── utils/
    │       ├── ExpressError.js
    │       └── asyncHandler.js
    │
    └── frontend/                 # React frontend (will be created by Vite)
        ├── .env.local            # Frontend environment variables (for Clerk Publishable Key)
        ├── package.json
        ├── vite.config.js
        ├── tailwind.config.js
        ├── postcss.config.js
        ├── public/
        │   └── (static assets like favicon)
        └── src/
            ├── main.jsx              # Main entry point for React
            ├── App.jsx
            ├── index.css             # Tailwind base styles
            ├── assets/               # Local images, fonts for frontend
            ├── components/           # Reusable UI components
            │   ├── auth/             # Clerk related components (SignIn, SignUp, UserButton)
            │   ├── common/           # Buttons, Modals, Loaders etc.
            │   ├── layout/           # Navbar, Footer, Layout wrappers
            │   └── listings/         # ListingCard, ListingForm, etc.
            ├── contexts/             # React Context API (if needed)
            ├── hooks/                # Custom React hooks
            ├── pages/                # Page-level components (HomePage, ListingDetailPage, AdminDashboard etc.)
            │   ├── Admin/
            │   │   └── DashboardPage.jsx
            │   ├── Auth/
            │   │   ├── SignInPage.jsx
            │   │   └── SignUpPage.jsx
            │   ├── Listings/
            │   │   ├── ListingCreatePage.jsx
            │   │   ├── ListingDetailPage.jsx
            │   │   ├── ListingEditPage.jsx
            │   │   └── ListingsPage.jsx
            │   └── User/
            │       └── UserProfilePage.jsx
            ├── services/             # API call functions (e.g., using Axios)
            │   └── api.js
            └── utils/                # Frontend utility functions
```

```
#!/bin/bash

# Create backend structure
mkdir -p backend/{middleware,controllers,models,routes,utils}
cd backend
touch .env package.json server.js
cd middleware
touch clerkAuth.js validateRequest.js
cd ../controllers
touch listingController.js reviewController.js userController.js
cd ../models
touch Listing.js Review.js User.js
cd ../routes
touch listingRoutes.js reviewRoutes.js userRoutes.js
cd ../utils
touch ExpressError.js asyncHandler.js
cd ../..

# Create frontend structure
mkdir -p frontend/{public,src/assets,src/components/{auth,common,layout,listings},src/contexts,src/hooks,src/pages/{Admin,Auth,Listings,User},src/services,src/utils}
cd frontend
touch .env.local package.json vite.config.js tailwind.config.js postcss.config.js
cd src
touch main.jsx App.jsx index.css
cd pages/Admin
touch DashboardPage.jsx
cd ../Auth
touch SignInPage.jsx SignUpPage.jsx
cd ../Listings
touch ListingCreatePage.jsx ListingDetailPage.jsx ListingEditPage.jsx ListingsPage.jsx
cd ../User
touch UserProfilePage.jsx
cd ../../services
touch api.js
```

```
git add .
git commit -m "Added new readme file "
git push -u origin main
```