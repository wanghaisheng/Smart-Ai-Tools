import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Tool from '../models/Tool.js';
import Review from '../models/Review.js';
import ApiKey from '../models/ApiKey.js';
import Category from '../models/Category.js';
import Notification from '../models/Notification.js';
import SmartPrompt from '../models/SmartPrompt.js';

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
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalTools,
            totalReviews,
            totalPrompts,
            recentUsers,
            recentTools,
            recentPrompts,
            notifications
        ] = await Promise.all([
            User.countDocuments(),
            Tool.countDocuments(),
            Review.countDocuments(),
            SmartPrompt.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(5),
            Tool.find().sort({ createdAt: -1 }).limit(5),
            SmartPrompt.find().sort({ createdAt: -1 }).limit(5),
            Notification.find().sort({ createdAt: -1 }).limit(10)
        ]);

        res.render('admin/dashboard', {
            stats: {
                totalUsers,
                totalTools,
                totalReviews,
                totalPrompts
            },
            recentActivity: {
                users: recentUsers,
                tools: recentTools,
                prompts: recentPrompts,
                notifications
            }
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).render('admin/dashboard', { error: 'Failed to load dashboard data' });
    }
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

// Admin users page
router.get('/users', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? { 
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [users, totalUsers] = await Promise.all([
            User.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments(query)
        ]);

        res.render('admin/users', {
            users,
            pagination: {
                current: page,
                pages: Math.ceil(totalUsers / limit),
                total: totalUsers
            },
            search
        });
    } catch (error) {
        console.error('Users Page Error:', error);
        res.status(500).render('admin/users', { error: 'Failed to load users data' });
    }
});

// Admin analytics page
router.get('/analytics', isAdmin, async (req, res) => {
    try {
        const [
            userStats,
            toolStats,
            reviewStats,
            categoryStats
        ] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Tool.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Review.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Category.aggregate([
                {
                    $lookup: {
                        from: "tools",
                        localField: "_id",
                        foreignField: "category",
                        as: "tools"
                    }
                },
                {
                    $project: {
                        name: 1,
                        toolCount: { $size: "$tools" }
                    }
                }
            ])
        ]);

        res.render('admin/analytics', {
            analytics: {
                userStats,
                toolStats,
                reviewStats,
                categoryStats
            }
        });
    } catch (error) {
        console.error('Analytics Page Error:', error);
        res.status(500).render('admin/analytics', { error: 'Failed to load analytics data' });
    }
});

// Admin settings page
router.get('/settings', isAdmin, async (req, res) => {
    try {
        const [
            apiKeys,
            categories,
            systemNotifications
        ] = await Promise.all([
            ApiKey.find().sort({ createdAt: -1 }).limit(5),
            Category.find().sort({ name: 1 }),
            Notification.find({ type: 'system' }).sort({ createdAt: -1 }).limit(10)
        ]);

        res.render('admin/settings', {
            settings: {
                apiKeys,
                categories,
                systemNotifications
            }
        });
    } catch (error) {
        console.error('Settings Page Error:', error);
        res.status(500).render('admin/settings', { error: 'Failed to load settings data' });
    }
});

// Tools Manager Page
router.get('/tools-manager', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? { 
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [tools, totalTools, categories] = await Promise.all([
            Tool.find(query)
                .populate('category')
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Tool.countDocuments(query),
            Category.find().sort({ name: 1 })
        ]);

        res.render('admin/tools-manager', {
            tools,
            categories,
            pagination: {
                current: page,
                pages: Math.ceil(totalTools / limit),
                total: totalTools
            },
            search
        });
    } catch (error) {
        console.error('Tools Manager Error:', error);
        res.status(500).render('admin/tools-manager', { error: 'Failed to load tools data' });
    }
});

// Prompts Manager Page
router.get('/prompts-manager', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search
            ? { 
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const [prompts, totalPrompts] = await Promise.all([
            SmartPrompt.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            SmartPrompt.countDocuments(query)
        ]);

        res.render('admin/prompts-manager', {
            prompts,
            pagination: {
                current: page,
                pages: Math.ceil(totalPrompts / limit),
                total: totalPrompts
            },
            search
        });
    } catch (error) {
        console.error('Prompts Manager Error:', error);
        res.status(500).render('admin/prompts-manager', { error: 'Failed to load prompts data' });
    }
});

// API endpoints for admin actions
router.post('/api/users/:userId/status', isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        
        await User.findByIdAndUpdate(userId, { status });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

router.post('/api/categories', isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

router.delete('/api/categories/:categoryId', isAdmin, async (req, res) => {
    try {
        const { categoryId } = req.params;
        await Category.findByIdAndDelete(categoryId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// API endpoints for tools management
router.post('/api/tools', isAdmin, async (req, res) => {
    try {
        const tool = new Tool(req.body);
        await tool.save();
        res.json(tool);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tool' });
    }
});

router.put('/api/tools/:toolId', isAdmin, async (req, res) => {
    try {
        const { toolId } = req.params;
        const tool = await Tool.findByIdAndUpdate(toolId, req.body, { new: true });
        res.json(tool);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tool' });
    }
});

router.delete('/api/tools/:toolId', isAdmin, async (req, res) => {
    try {
        const { toolId } = req.params;
        await Tool.findByIdAndDelete(toolId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tool' });
    }
});

// API endpoints for prompts management
router.post('/api/prompts', isAdmin, async (req, res) => {
    try {
        const prompt = new SmartPrompt(req.body);
        await prompt.save();
        res.json(prompt);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create prompt' });
    }
});

router.put('/api/prompts/:promptId', isAdmin, async (req, res) => {
    try {
        const { promptId } = req.params;
        const prompt = await SmartPrompt.findByIdAndUpdate(promptId, req.body, { new: true });
        res.json(prompt);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update prompt' });
    }
});

router.delete('/api/prompts/:promptId', isAdmin, async (req, res) => {
    try {
        const { promptId } = req.params;
        await SmartPrompt.findByIdAndDelete(promptId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete prompt' });
    }
});

export default router;
