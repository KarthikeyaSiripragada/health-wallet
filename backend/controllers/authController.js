const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const path = require('path');
const JWT_SECRET = 'healthwallet_secret_123';

// 1. Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../config/firebase-admin-key.json');

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(require(serviceAccountPath))
        });
        console.log("✅ Firebase Admin Initialized Successfully");
    }
} catch (error) {
    console.error("❌ Firebase Initialization Failed:", error.message);
}

// 2. State & Constants
const otpStore = new Map();

// 3. Google / Firebase Login
exports.firebaseLogin = async (req, res, db) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Firebase token missing" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, name } = decodedToken;

        let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            const result = await db.run(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name || 'Google User', email, 'google_authenticated']
            );
            user = { id: result.lastID, name: name || 'Google User', email };
        }

        const localToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: localToken, user });
    } catch (err) {
        console.error("❌ GOOGLE LOGIN ERROR:", err.message);
        res.status(401).json({ error: "Invalid Google Token" });
    }
};

// 4. Phone OTP – Send
exports.sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(phoneNumber, {
            otp,
            expires: Date.now() + 300000 // 5 min
        });

        console.log(`🚀 [SIMULATED OTP] for ${phoneNumber}: ${otp}`);
        res.json({ message: "OTP sent successfully" });
    } catch {
        res.status(500).json({ error: "Failed to generate OTP" });
    }
};

// 5. Phone OTP – Verify & Login
exports.verifyOTP = async (req, res, db) => {
    try {
        const { phoneNumber, otp } = req.body;
        const record = otpStore.get(phoneNumber);

        if (!record || record.otp !== otp || Date.now() > record.expires) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }

        otpStore.delete(phoneNumber);

        let user = await db.get('SELECT * FROM users WHERE phone = ?', [phoneNumber]);

        if (!user) {
            const tempEmail = `phone_${phoneNumber}@healthwallet.com`;
            const result = await db.run(
                'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
                ['Phone User', tempEmail, phoneNumber, 'otp_auth']
            );
            user = {
                id: result.lastID,
                name: 'Phone User',
                email: tempEmail,
                phone: phoneNumber
            };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error("❌ OTP VERIFY ERROR:", err.message);
        res.status(500).json({ error: "OTP verification failed" });
    }
};

// 6. Email / Password Login
exports.login = async (req, res, db) => {
    try {
        const { email, password } = req.body;
        const user = await db.get(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    } catch {
        res.status(500).json({ error: "Login process failed" });
    }
};

// 7. Registration
exports.register = async (req, res, db) => {
    try {
        const { name, email, password } = req.body;
        const result = await db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );

        res.status(201).json({ message: "User created", userId: result.lastID });
    } catch (err) {
        console.error("❌ REGISTER ERROR:", err.message);
        res.status(500).json({ error: "User already exists or DB error" });
    }
};
