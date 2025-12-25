exports.shareReport = async (req, res, db) => {
    const { report_id, viewer_email } = req.body;
    const ownerId = req.user.id;

    try {
        const viewer = await db.get(
            'SELECT id FROM users WHERE email = ?',
            [viewer_email]
        );
        if (!viewer) {
            return res.status(404).json({ error: "User with this email not found" });
        }

        const report = await db.get(
            'SELECT id FROM reports WHERE id = ? AND userId = ?',
            [report_id, ownerId]
        );
        if (!report) {
            return res.status(403).json({ error: "You do not own this report" });
        }

        await db.run(
            'INSERT INTO access_control (report_id, owner_id, shared_with_user_id) VALUES (?, ?, ?)',
            [report_id, ownerId, viewer.id]
        );

        res.json({ message: `Report shared with ${viewer_email}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to share report" });
    }
};

exports.getSharedWithMe = async (req, res, db) => {
    const userId = req.user.id;

    try {
        const sharedReports = await db.all(`
            SELECT r.*
            FROM reports r
            JOIN access_control ac ON r.id = ac.report_id
            WHERE ac.shared_with_user_id = ?
        `, [userId]);

        res.json(sharedReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch shared reports" });
    }
};
exports.getMyReports = async (req, res, db) => {
    try {
        const userId = req.user.id;

        const reports = await db.all(
            'SELECT * FROM reports WHERE userId = ? ORDER BY id DESC',
            [userId]
        );

        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
exports.uploadReport = async (req, res, db) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const userId = req.user.id;
        const { type, date } = req.body;

        const filePath = `uploads/${req.file.filename}`;

        await db.run(
            'INSERT INTO reports (userId, type, date, filePath) VALUES (?, ?, ?, ?)',
            [userId, type, date, filePath]
        );

        res.status(201).json({ message: "Report uploaded", filePath });
    } catch (error) {
        console.error("UPLOAD ERROR:", error.message);
        res.status(500).json({ error: "Failed to upload report" });
    }
};
const path = require('path');
const fs = require('fs');

exports.downloadReport = async (req, res, db) => {
    try {
        const reportId = req.params.id;
        const userId = req.user.id;

        // 1️⃣ Check ownership OR shared access
        const report = await db.get(`
            SELECT r.*
            FROM reports r
            LEFT JOIN access_control ac
              ON r.id = ac.report_id
            WHERE r.id = ?
              AND (r.userId = ? OR ac.shared_with_user_id = ?)
        `, [reportId, userId, userId]);

        if (!report) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // 2️⃣ Resolve absolute file path
        const filePath = path.join(__dirname, '..', report.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // 3️⃣ Send file securely
        res.download(filePath);
    } catch (err) {
        console.error('DOWNLOAD ERROR:', err);
        res.status(500).json({ error: 'Download failed' });
    }
};
