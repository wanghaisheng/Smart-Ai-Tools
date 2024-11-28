import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.redirect('/admin/login');
    }
};

// Admin login page
router.get('/login', (req, res) => {
    res.render('admin/login');
});

// Admin dashboard
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// Login POST endpoint
router.post('/login', [
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // In production, you should store this in a database
    const adminCredentials = {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
        const token = jwt.sign(
            { username: adminCredentials.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });

        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Logout endpoint
router.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

export default router;
