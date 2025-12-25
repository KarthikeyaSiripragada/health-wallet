const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');
const authenticateToken = require('../middleware/authMiddleware');

module.exports = (db) => {
    // Both routes are protected by the gatekeeper
    router.post('/', authenticateToken, (req, res) => vitalsController.addVital(req, res, db));
    router.get('/', authenticateToken, (req, res) => vitalsController.getVitals(req, res, db));
    
    return router;
};