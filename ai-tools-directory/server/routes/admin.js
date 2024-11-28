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

// Dashboard route with enhanced analytics
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Fetch various statistics
        const [
            totalUsers,
            newUsersToday,
            newUsersThisWeek,
            newUsersThisMonth,
            activeUsers,
            inactiveUsers,
            totalTools,
            totalReviews,
            totalPrompts,
            recentReviews,
            usersByRole,
            toolsByCategory,
            monthlyUserGrowth,
            topRatedTools
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
            User.countDocuments({ createdAt: { $gte: lastWeek } }),
            User.countDocuments({ createdAt: { $gte: lastMonth } }),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ status: 'inactive' }),
            Tool.countDocuments(),
            Review.countDocuments(),
            SmartPrompt.countDocuments(),
            Review.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'username')
                .populate('tool', 'name'),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]),
            Tool.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]),
            User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': -1, '_id.month': -1 } },
                { $limit: 12 }
            ]),
            Tool.aggregate([
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'tool',
                        as: 'reviews'
                    }
                },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        avgRating: {
                            $cond: {
                                if: { $eq: [{ $size: '$reviews' }, 0] },
                                then: 0,
                                else: { $avg: '$reviews.rating' }
                            }
                        },
                        reviewCount: { $size: '$reviews' }
                    }
                },
                { $sort: { avgRating: -1, reviewCount: -1 } },
                { $limit: 5 }
            ])
        ]);

        // Calculate growth rates
        const userGrowthRate = ((newUsersThisMonth / totalUsers) * 100).toFixed(1);
        const activeUserRate = ((activeUsers / totalUsers) * 100).toFixed(1);

        // Process monthly growth data for chart
        const monthlyGrowthData = monthlyUserGrowth.reverse().map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            users: item.count
        }));

        // Process category distribution
        const categoryData = toolsByCategory.map(item => ({
            category: item._id || 'Uncategorized',
            count: item.count
        }));

        // Calculate system health metrics
        const systemHealth = {
            userEngagement: (activeUserRate > 70) ? 'good' : (activeUserRate > 40) ? 'moderate' : 'needs attention',
            growthStatus: (userGrowthRate > 10) ? 'good' : (userGrowthRate > 5) ? 'moderate' : 'needs attention',
            reviewActivity: (recentReviews.length > 0) ? 'active' : 'inactive'
        };

        res.render('admin/dashboard', {
            stats: {
                users: {
                    total: totalUsers,
                    newToday: newUsersToday,
                    newThisWeek: newUsersThisWeek,
                    newThisMonth: newUsersThisMonth,
                    active: activeUsers,
                    inactive: inactiveUsers,
                    growthRate: userGrowthRate,
                    activeRate: activeUserRate,
                    byRole: usersByRole
                },
                tools: {
                    total: totalTools,
                    byCategory: categoryData,
                    topRated: topRatedTools
                },
                reviews: {
                    total: totalReviews,
                    recent: recentReviews
                },
                prompts: {
                    total: totalPrompts
                },
                system: systemHealth
            },
            charts: {
                monthlyGrowth: monthlyGrowthData
            }
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.render('admin/dashboard', { error: 'Failed to load dashboard data' });
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

// Users management page
router.get('/users', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const role = req.query.role || '';
        const status = req.query.status || '';

        // Build query
        const query = {};
        if (search) {
            query.$or = [
                { username: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        if (role) query.role = role;
        if (status) query.status = status;

        // Get user statistics
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        
        const [
            totalUsers,
            activeUsers,
            newUsersToday,
            newUsersThisMonth,
            userActivityStats,
            monthlyActivity,
            users,
            total
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
            User.countDocuments({ createdAt: { $gte: lastMonth } }),
            User.aggregate([
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'reviews'
                    }
                },
                {
                    $lookup: {
                        from: 'tools',
                        localField: '_id',
                        foreignField: 'creator',
                        as: 'tools'
                    }
                },
                {
                    $project: {
                        totalActions: {
                            $add: [
                                { $size: '$reviews' },
                                { $size: '$tools' }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgActivity: { $avg: '$totalActions' }
                    }
                }
            ]),
            User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 12 }
            ]),
            User.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(query)
        ]);

        // Calculate statistics
        const userGrowthRate = ((newUsersThisMonth / totalUsers) * 100).toFixed(1);
        const activeUserRate = ((activeUsers / totalUsers) * 100).toFixed(1);
        const avgUserActivity = userActivityStats[0]?.avgActivity.toFixed(1) || '0.0';

        // Process monthly activity data for chart
        const activityData = monthlyActivity.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            users: item.count
        }));

        // Prepare pagination data
        const pagination = {
            current: page,
            pages: Math.ceil(total / limit),
            total
        };

        res.render('admin/users', {
            users,
            pagination,
            search,
            query: req.query,
            stats: {
                totalUsers,
                activeUsers,
                newUsersToday,
                userGrowthRate,
                activeUserRate,
                avgUserActivity
            },
            activityData
        });
    } catch (error) {
        console.error('Users Error:', error);
        res.render('admin/users', { error: 'Failed to load users data' });
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

// API endpoints for user management
router.post('/api/users', isAdmin, [
    body('username').trim().isLength({ min: 3 }).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['user', 'admin']),
    body('status').isIn(['active', 'inactive'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role, status } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this username or email already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            status
        });

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.put('/api/users/:userId', isAdmin, [
    body('username').trim().isLength({ min: 3 }).escape().optional(),
    body('email').trim().isEmail().normalizeEmail().optional(),
    body('password').isLength({ min: 6 }).optional(),
    body('role').isIn(['user', 'admin']).optional(),
    body('status').isIn(['active', 'inactive']).optional()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;
        const updateData = { ...req.body };

        // If password is being updated, hash it
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // Check for username/email conflicts
        if (updateData.username || updateData.email) {
            const existingUser = await User.findOne({
                _id: { $ne: userId },
                $or: [
                    updateData.username ? { username: updateData.username } : null,
                    updateData.email ? { email: updateData.email } : null
                ].filter(Boolean)
            });

            if (existingUser) {
                return res.status(400).json({ 
                    error: 'Username or email already in use' 
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            userId, 
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/api/users/:userId', isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

router.get('/api/users/:userId', isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;
