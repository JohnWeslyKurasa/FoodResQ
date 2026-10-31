const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'foodresq_jwt_secret_key_2026_investor_ready_9921', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/v1/auth/register
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = 'donor',
      organizationName,
      organizationType,
      address,
      latitude,
      longitude,
      servingCapacity,
      preferredCategories,
      avgDailyMeals,
      vehicleType,
      availability,
    } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory registration fields (Name, Email, Password, Phone, Address).',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    const coordinates = [
      longitude ? parseFloat(longitude) : 78.3826,
      latitude ? parseFloat(latitude) : 17.4483,
    ];

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      organizationName: organizationName || (role === 'volunteer' ? 'Individual Volunteer' : name),
      organizationType: organizationType || (role === 'recipient' ? 'NGO' : role === 'volunteer' ? 'Individual Volunteer' : 'Restaurant'),
      address,
      location: {
        type: 'Point',
        coordinates,
      },
      servingCapacity: servingCapacity ? parseInt(servingCapacity, 10) : 50,
      preferredCategories: preferredCategories || ['Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables'],
      avgDailyMeals: avgDailyMeals ? parseInt(avgDailyMeals, 10) : 0,
      vehicleType: vehicleType || '',
      availability: availability || '',
      isVerified: true,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        address: user.address,
        location: user.location,
        isVerified: user.isVerified,
        servingCapacity: user.servingCapacity,
        preferredCategories: user.preferredCategories,
        avgDailyMeals: user.avgDailyMeals,
        vehicleType: user.vehicleType,
        availability: user.availability,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// POST /api/v1/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your FoodResQ account has been suspended. Please contact platform support.',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        address: user.address,
        location: user.location,
        isVerified: user.isVerified,
        servingCapacity: user.servingCapacity,
        preferredCategories: user.preferredCategories,
        avgDailyMeals: user.avgDailyMeals,
        vehicleType: user.vehicleType,
        availability: user.availability,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

// GET /api/v1/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

// PATCH /api/v1/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'organizationName', 'organizationType',
      'address', 'servingCapacity', 'preferredCategories', 'avatar'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile.',
    });
  }
};
