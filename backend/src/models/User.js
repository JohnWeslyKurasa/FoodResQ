const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a contact phone number'],
  },
  role: {
    type: String,
    enum: ['donor', 'recipient', 'volunteer', 'admin'],
    default: 'donor',
  },
  organizationName: {
    type: String,
    required: function() { return this.role === 'donor' || this.role === 'recipient'; },
    trim: true,
  },
  organizationType: {
    type: String,
    enum: [
      'Restaurant', 'Hotel', 'Caterer', 'Grocery Store', 'Bakery', 'Community Kitchen',
      'NGO', 'Charity', 'Shelter', 'Food Bank', 'Individual Volunteer', 'Other'
    ],
    default: 'Restaurant',
  },
  address: {
    type: String,
    required: [true, 'Please provide an address'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [78.3826, 17.4483], // Default Hitech City, Hyderabad
    },
  },
  servingCapacity: {
    type: Number,
    default: 50, // Typical daily meal serving capacity for NGOs
  },
  preferredCategories: {
    type: [String],
    default: ['Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables', 'Dairy', 'Packaged Food'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
