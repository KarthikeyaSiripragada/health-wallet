# Health-Wallet-Care2ai-
Health Wallet is a full-stack MERN-lite (SQLite instead of MongoDB) application designed to help users securely store and manage their medical reports, such as Blood Tests and X-rays. The platform supports three-tier authentication: Standard Email/Password, Firebase Google Login, and Simulated OTP Phone Authentication.
Key Features
Multi-Channel Auth: Secure login via Email, Google (Firebase), or Phone Number with OTP verification.

Medical Report Upload: Upload physical documents (PDFs/Images) with metadata like report type and date.

Smart Dashboard: A personalized view to track and access all medical records in one place.

Persistent Storage: Local storage of files on a dedicated drive with metadata persistence in SQLite.

Shadcn/UI Design: A modern, responsive interface using Tailwind CSS and HSL-based medical themes.

Frontend
React.js: Functional components with Hooks (useState, useEffect).

Tailwind CSS: Custom HSL utility classes for a "Medical Blue" theme.

Firebase SDK: Handles Google OAuth and user authentication state.

React Router: Protected routes to ensure data privacy.

Backend
Node.js & Express: High-performance REST API architecture.

SQLite3: Lightweight, file-based SQL database for local persistence.

Multer: Middleware for handling multipart/form-data file uploads.

JWT (JSON Web Token): Secure stateless authentication for API requests.

Firebase Admin SDK: Server-side verification of Google ID tokens.


health-wallet/
├── backend/
│   ├── config/             # Firebase Admin JSON keys
│   ├── controllers/        # Auth and Report logic
│   ├── routes/             # Express API routes
│   ├── uploads/            # Local storage for medical files
│   ├── database.sqlite     # SQLite DB file (E: drive)
│   └── server.js           # App entry point
└── frontend/
    ├── src/
    │   ├── components/     # Navbar and UI elements
    │   ├── pages/          # Login, Dashboard, Reports
    │   └── services/       # Axios API & Firebase config




    
