const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authenticateToken = require('../middleware/authMiddleware'); // ✅ MISSING LINE
const reportController = require('../controllers/reportController');

module.exports = (db) => {
    const router = express.Router();

    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
        }
    });

    const upload = multer({ storage });

    // Upload report
    router.post(
        '/upload',
        authenticateToken,
        upload.single('report'),
        (req, res) => reportController.uploadReport(req, res, db)
    );

    // Share report
    router.post(
        '/share',
        authenticateToken,
        (req, res) => reportController.shareReport(req, res, db)
    );
    // Get my uploaded reports (OWNER VIEW)
    router.get(
        '/',
        authenticateToken,
        (req, res) => reportController.getMyReports(req, res, db)
    );
    // Reports shared with me
    router.get(
        '/shared',
        authenticateToken,
        (req, res) => reportController.getSharedWithMe(req, res, db)
    );

    // Download report
    router.get(
        '/download/:id',
        authenticateToken,
        (req, res) => reportController.downloadReport(req, res, db)
    );

    return router;
};
