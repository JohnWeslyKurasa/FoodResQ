const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide food title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide food description'],
  },
  category: {
    type: String,
    required: [true, 'Food category is required'],
    enum: [
      'Vegetarian',
      'Non-Vegetarian',
      'Bakery',
      'Fruits',
      'Vegetables',
      'Dairy',
      'Packaged Food',
      'Other'
    ],
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: [1, 'Quantity must be at least 1'],
  },
  quantityUnit: {
    type: String,
    enum: ['meals', 'kg', 'boxes', 'portions', 'packets'],
    default: 'meals',
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  preparationTime: {
    type: Date,
    required: [true, 'Preparation date and time is required'],
  },
  listingTime: {
    type: Date,
    default: Date.now,
  },
  pickupStartTime: {
    type: Date,
    required: [true, 'Pickup start time is required'],
  },
  pickupEndTime: {
    type: Date,
    required: [true, 'Pickup end time is required'],
  },
  useByDate: {
    type: Date,
  },
  storageConditions: {
    type: String,
    enum: ['Refrigerated (0-4°C)', 'Frozen (-18°C)', 'Room Temperature (15-25°C)', 'Keep Warm (>60°C)'],
    default: 'Room Temperature (15-25°C)',
  },
  handlingInstructions: {
    type: String,
    default: 'Keep covered in insulated food-grade containers during transport.',
  },
  allergenInfo: {
    type: [String],
    default: ['None specified'],
  },
  pickupAddress: {
    type: String,
    required: [true, 'Pickup address is required'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [78.3826, 17.4483],
    },
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'PENDING', 'ACCEPTED', 'PICKUP_IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'CANCELLED'],
    default: 'AVAILABLE',
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'critical'],
    default: 'normal',
  },
}, {
  timestamps: true,
});

donationSchema.index({ location: '2dsphere' });
donationSchema.index({ status: 1, pickupEndTime: 1 });

donationSchema.virtual('remainingQuantity').get(function() {
  return Math.max(0, this.quantity - (this.reservedQuantity || 0));
});

donationSchema.set('toJSON', { virtuals: true });
donationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
