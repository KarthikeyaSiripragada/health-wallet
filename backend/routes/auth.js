const express = require('express');
// Ensure all functions are destructured correctly from the controller
const { register, login, firebaseLogin, sendOTP, verifyOTP } = require('../controllers/authController');

module.exports = (db) => {
    const router = express.Router();

    router.post('/register', (req, res) => register(req, res, db));
    router.post('/login', (req, res) => login(req, res, db));
    
    // This is the line that was likely failing
    router.post('/firebase-login', (req, res) => firebaseLogin(req, res, db));
    
    router.post('/send-otp', (req, res) => sendOTP(req, res));
    router.post('/verify-otp', (req, res) => verifyOTP(req, res, db));

    return router;
};  