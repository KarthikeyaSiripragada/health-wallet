const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const initDB = require('./db');

const authRoutes = require('./routes/auth');
const vitalsRoutes = require('./routes/vitals');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. GLOBAL MIDDLEWARE (Place these BEFORE routes)
app.use(cors()); // Removes the duplicate at the bottom
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. ENSURE DIRECTORIES EXIST
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // Fixes "Upload failed"
}
app.use('/uploads', express.static(uploadsDir));

// 3. DATABASE INITIALIZATION
initDB().then((db) => {
    console.log("✅ SQLite Database Connected");

    app.use('/api/auth', authRoutes(db));
    app.use('/api/vitals', vitalsRoutes(db));
    app.use('/api/reports', reportRoutes(db));

    app.get('/api/healthcheck', (req, res) => {
        res.status(200).json({ status: "Server is healthy" });
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Server Error!' });
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Failed to initialize database:", err);
});