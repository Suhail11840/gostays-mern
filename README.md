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