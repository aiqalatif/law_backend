const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/user'); 

const authMiddleware = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        console.log("Token Received:", token); // 👈 Debugging

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.replace('Bearer ', '');
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Decoded Token:", decodedToken); // 👈 Debugging

        const user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only admins can perform this action.' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};


module.exports = authMiddleware;
