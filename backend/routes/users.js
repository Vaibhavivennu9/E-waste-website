const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Collection = require('../models/Collection');
const Donation = require('../models/Donation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's collections
    const collections = await Collection.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's donations
    const donations = await Donation.find({ donor: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get statistics
    const collectionStats = await Collection.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const donationStats = await Donation.aggregate([
      { $match: { donor: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      collections,
      donations,
      stats: {
        collections: collectionStats,
        donations: donationStats
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/users/collectors
// @desc    Get all collectors
// @access  Private (Admin)
router.get('/collectors', [auth, adminAuth], async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ collectors });
  } catch (error) {
    console.error('Get collectors error:', error);
    res.status(500).json({ message: 'Server error fetching collectors' });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin)
router.put('/:id/role', [
  auth,
  adminAuth,
  body('role').isIn(['user', 'collector', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

module.exports = router;
