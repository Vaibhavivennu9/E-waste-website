const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
      enum: ['working', 'not_working', 'damaged', 'unknown'],
      default: 'unknown'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    description: String,
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
    enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Collection', collectionSchema);
