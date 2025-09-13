const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    category: {
      type: String,
      required: true,
      enum: ['laptop', 'desktop', 'mobile', 'tablet', 'monitor', 'keyboard', 'mouse', 'printer', 'router', 'other']
    },
    brand: String,
    model: String,
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    description: String,
    images: [String], // URLs to uploaded images
    estimatedValue: Number
  }],
  pickupAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    landmark: String
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTimeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'picked_up', 'delivered', 'cancelled'],
    default: 'available'
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  donationPurpose: {
    type: String,
    enum: ['education', 'charity', 'community', 'refurbishment', 'other'],
    required: true
  },
  notes: String,
  totalEstimatedValue: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
