# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


🏥 Health Wallet - Secure Medical Record ManagementHealth Wallet is a full-stack MERN-lite (SQLite instead of MongoDB) application designed to help users securely store and manage their medical reports, such as Blood Tests and X-rays. The platform supports three-tier authentication: Standard Email/Password, Firebase Google Login, and Simulated OTP Phone Authentication.🚀 Key FeaturesMulti-Channel Auth: Secure login via Email, Google (Firebase), or Phone Number with OTP verification.Medical Report Upload: Upload physical documents (PDFs/Images) with metadata like report type and date.Smart Dashboard: A personalized view to track and access all medical records in one place.Persistent Storage: Local storage of files on a dedicated drive with metadata persistence in SQLite.Shadcn/UI Design: A modern, responsive interface using Tailwind CSS and HSL-based medical themes.🛠️ Tech StackFrontendReact.js: Functional components with Hooks (useState, useEffect).Tailwind CSS: Custom HSL utility classes for a "Medical Blue" theme.Firebase SDK: Handles Google OAuth and user authentication state.React Router: Protected routes to ensure data privacy.BackendNode.js & Express: High-performance REST API architecture.SQLite3: Lightweight, file-based SQL database for local persistence.Multer: Middleware for handling multipart/form-data file uploads.JWT (JSON Web Token): Secure stateless authentication for API requests.Firebase Admin SDK: Server-side verification of Google ID tokens.📁 Project StructurePlaintexthealth-wallet/
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
🔧 Installation & Setup1. PrerequisitesNode.js (v16+)npm or yarn2. Backend SetupNavigate to the backend folder: cd backendInstall dependencies: npm installPlace your firebase-admin-key.json in backend/config/.Start the server: node server.js.3. Frontend SetupNavigate to the frontend folder: cd frontendInstall dependencies: npm installConfigure src/services/firebase.js with your Firebase Web Config.Launch the app: npm start.📡 API EndpointsMethodEndpointDescriptionPOST/api/auth/registerCreate a new user accountPOST/api/auth/firebase-loginVerify Google ID Token & loginPOST/api/auth/send-otpGenerate simulated 6-digit OTPPOST/api/auth/verify-otpVerify OTP and issue JWTPOST/api/reports/uploadUpload report with file & metadataGET/api/reports/user/:idFetch all reports for a specific user



