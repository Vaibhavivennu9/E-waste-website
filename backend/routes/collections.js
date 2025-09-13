const express = require('express');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const { auth, collectorAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/collections
// @desc    Create a new collection request
// @access  Private
router.post('/', [
  auth,
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('pickupAddress.street').notEmpty().withMessage('Street address is required'),
  body('pickupAddress.city').notEmpty().withMessage('City is required'),
  body('pickupAddress.state').notEmpty().withMessage('State is required'),
  body('pickupAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('preferredDate').isISO8601().withMessage('Valid preferred date is required'),
  body('preferredTimeSlot').isIn(['morning', 'afternoon', 'evening']).withMessage('Valid time slot is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const collectionData = {
      ...req.body,
      user: req.user._id
    };

    // Calculate total estimated value
    const totalValue = collectionData.items.reduce((sum, item) => {
      return sum + (item.estimatedValue || 0) * item.quantity;
    }, 0);
    collectionData.totalEstimatedValue = totalValue;

    const collection = new Collection(collectionData);
    await collection.save();

    await collection.populate('user', 'name email phone');

    res.status(201).json({
      message: 'Collection request created successfully',
      collection
    });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ message: 'Server error creating collection request' });
  }
});

// @route   GET /api/collections
// @desc    Get collections (user's own or all for collectors/admins)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Regular users can only see their own collections
    if (req.user.role === 'user') {
      query.user = req.user._id;
    }

    const collections = await Collection.find(query)
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ collections });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({ message: 'Server error fetching collections' });
  }
});

// @route   GET /api/collections/:id
// @desc    Get a specific collection
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('assignedCollector', 'name email phone');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if user can access this collection
    if (req.user.role === 'user' && collection.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ collection });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ message: 'Server error fetching collection' });
  }
});

// @route   PUT /api/collections/:id/status
// @desc    Update collection status
// @access  Private (Collectors and Admins)
router.put('/:id/status', [auth, collectorAuth], async (req, res) => {
  try {
    const { status, notes } = req.body;

    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    collection.status = status;
    if (notes) collection.notes = notes;
    if (status === 'scheduled' || status === 'in_progress') {
      collection.assignedCollector = req.user._id;
    }

    await collection.save();

    await collection.populate('user', 'name email phone');
    await collection.populate('assignedCollector', 'name email phone');

    res.json({
      message: 'Collection status updated successfully',
      collection
    });
  } catch (error) {
    console.error('Update collection status error:', error);
    res.status(500).json({ message: 'Server error updating collection status' });
  }
});

// @route   DELETE /api/collections/:id
// @desc    Cancel a collection request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if user can cancel this collection
    if (req.user.role === 'user' && collection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if not completed
    if (collection.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed collection' });
    }

    collection.status = 'cancelled';
    await collection.save();

    res.json({ message: 'Collection cancelled successfully' });
  } catch (error) {
    console.error('Cancel collection error:', error);
    res.status(500).json({ message: 'Server error cancelling collection' });
  }
});

module.exports = router;
