const express = require('express');
const { body, validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const { auth, collectorAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private
router.post('/', [
  auth,
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('pickupAddress.street').notEmpty().withMessage('Street address is required'),
  body('pickupAddress.city').notEmpty().withMessage('City is required'),
  body('pickupAddress.state').notEmpty().withMessage('State is required'),
  body('pickupAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('preferredDate').isISO8601().withMessage('Valid preferred date is required'),
  body('preferredTimeSlot').isIn(['morning', 'afternoon', 'evening']).withMessage('Valid time slot is required'),
  body('donationPurpose').isIn(['education', 'charity', 'community', 'refurbishment', 'other']).withMessage('Valid donation purpose is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donationData = {
      ...req.body,
      donor: req.user._id
    };

    // Calculate total estimated value
    const totalValue = donationData.items.reduce((sum, item) => {
      return sum + (item.estimatedValue || 0) * item.quantity;
    }, 0);
    donationData.totalEstimatedValue = totalValue;

    const donation = new Donation(donationData);
    await donation.save();

    await donation.populate('donor', 'name email phone');

    res.status(201).json({
      message: 'Donation created successfully',
      donation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error creating donation' });
  }
});

// @route   GET /api/donations
// @desc    Get donations (available for pickup or user's own)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Regular users can see available donations and their own donations
    if (req.user.role === 'user') {
      query.$or = [
        { status: 'available' },
        { donor: req.user._id }
      ];
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone')
      .populate('recipient', 'name email phone')
      .populate('assignedCollector', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ donations });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get a specific donation
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone address')
      .populate('recipient', 'name email phone')
      .populate('assignedCollector', 'name email phone');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user can access this donation
    if (req.user.role === 'user' && 
        donation.donor._id.toString() !== req.user._id.toString() &&
        donation.status !== 'available') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ donation });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error fetching donation' });
  }
});

// @route   PUT /api/donations/:id/reserve
// @desc    Reserve a donation for pickup
// @access  Private
router.put('/:id/reserve', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation is not available for reservation' });
    }

    donation.status = 'reserved';
    donation.recipient = req.user._id;
    await donation.save();

    await donation.populate('donor', 'name email phone');
    await donation.populate('recipient', 'name email phone');

    res.json({
      message: 'Donation reserved successfully',
      donation
    });
  } catch (error) {
    console.error('Reserve donation error:', error);
    res.status(500).json({ message: 'Server error reserving donation' });
  }
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status
// @access  Private (Collectors and Admins)
router.put('/:id/status', [auth, collectorAuth], async (req, res) => {
  try {
    const { status, notes } = req.body;

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    if (notes) donation.notes = notes;
    if (status === 'picked_up' || status === 'delivered') {
      donation.assignedCollector = req.user._id;
    }

    await donation.save();

    await donation.populate('donor', 'name email phone');
    await donation.populate('recipient', 'name email phone');
    await donation.populate('assignedCollector', 'name email phone');

    res.json({
      message: 'Donation status updated successfully',
      donation
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ message: 'Server error updating donation status' });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Cancel a donation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user can cancel this donation
    if (req.user.role === 'user' && donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if not delivered
    if (donation.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered donation' });
    }

    donation.status = 'cancelled';
    await donation.save();

    res.json({ message: 'Donation cancelled successfully' });
  } catch (error) {
    console.error('Cancel donation error:', error);
    res.status(500).json({ message: 'Server error cancelling donation' });
  }
});

module.exports = router;
