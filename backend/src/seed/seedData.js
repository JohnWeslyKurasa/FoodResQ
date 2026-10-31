const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const DonationHistory = require('../models/DonationHistory');
const Notification = require('../models/Notification');
const Report = require('../models/Report');
const { generatePickupTokens } = require('../services/pickupService');

const seedDatabase = async () => {
  try {
    console.log('[FoodResQ Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Donation.deleteMany({}),
      Request.deleteMany({}),
      DonationHistory.deleteMany({}),
      Notification.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log('[FoodResQ Seed] Creating initial demo accounts...');
    const hashedPassword = 'password123';

    // 1. Admin
    const admin = await User.create({
      name: 'Rohan Varma',
      email: 'admin@foodresq.org',
      password: hashedPassword,
      phone: '+91 98490 12345',
      role: 'admin',
      organizationName: 'FoodResQ Operations Team',
      organizationType: 'Other',
      address: 'Cyber Towers, Hitech City, Hyderabad, Telangana 500081',
      location: { type: 'Point', coordinates: [78.3772, 17.4504] },
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    // 2. Donors (3 Restaurants/Caterers/Hotels in Hyderabad)
    const donor1 = await User.create({
      name: 'Chef Suresh Reddy',
      email: 'donor@foodresq.org', // primary demo donor
      password: hashedPassword,
      phone: '+91 98491 55001',
      role: 'donor',
      organizationName: 'Paradise Biryani & Banquet',
      organizationType: 'Restaurant',
      address: 'Plot 12, Hitech City Main Rd, Madhapur, Hyderabad 500081',
      location: { type: 'Point', coordinates: [78.3826, 17.4483] }, // Madhapur
      isVerified: true,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    });

    const donor2 = await User.create({
      name: 'Anita Deshmukh',
      email: 'greenleaf@foodresq.org',
      password: hashedPassword,
      phone: '+91 98492 55002',
      role: 'donor',
      organizationName: 'Green Leaf Gourmet Caterers',
      organizationType: 'Caterer',
      address: 'ISB Road, Financial District, Gachibowli, Hyderabad 500032',
      location: { type: 'Point', coordinates: [78.3489, 17.4401] }, // Gachibowli
      isVerified: true,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=200&q=80',
    });

    const donor3 = await User.create({
      name: 'Vikramaditya Roy',
      email: 'grandpalace@foodresq.org',
      password: hashedPassword,
      phone: '+91 98493 55003',
      role: 'donor',
      organizationName: 'Grand Palace Luxury Hotel & Bakery',
      organizationType: 'Hotel',
      address: 'Road No 36, Jubilee Hills, Hyderabad 500033',
      location: { type: 'Point', coordinates: [78.4072, 17.4319] }, // Jubilee Hills
      isVerified: true,
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    });

    // 3. NGOs / Recipients (3 verified NGOs in Hyderabad)
    const ngo1 = await User.create({
      name: 'Kavita Menon',
      email: 'ngo@foodresq.org', // primary demo NGO
      password: hashedPassword,
      phone: '+91 98494 66001',
      role: 'recipient',
      organizationName: 'Akshaya Meals Foundation',
      organizationType: 'NGO',
      address: 'Near RTO Office, Kondapur, Hyderabad 500084',
      location: { type: 'Point', coordinates: [78.3614, 17.4622] }, // Kondapur (2.5 km from Madhapur)
      servingCapacity: 120,
      preferredCategories: ['Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables'],
      isVerified: true,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    });

    const ngo2 = await User.create({
      name: 'Arjun Singhal',
      email: 'robinhood@foodresq.org',
      password: hashedPassword,
      phone: '+91 98495 66002',
      role: 'recipient',
      organizationName: 'Robin Food Army Hyderabad',
      organizationType: 'Food Bank',
      address: 'KPHB Colony Phase 3, Kukatpally, Hyderabad 500072',
      location: { type: 'Point', coordinates: [78.3995, 17.4938] }, // Kukatpally
      servingCapacity: 250,
      preferredCategories: ['Vegetarian', 'Bakery', 'Packaged Food', 'Dairy'],
      isVerified: true,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });

    const ngo3 = await User.create({
      name: 'Dr. Fatima Sheikh',
      email: 'hopekitchen@foodresq.org',
      password: hashedPassword,
      phone: '+91 98496 66003',
      role: 'recipient',
      organizationName: 'Hope Community Kitchen & Shelter',
      organizationType: 'Shelter',
      address: 'Miyapur Main Road, Near Metro Station, Hyderabad 500049',
      location: { type: 'Point', coordinates: [78.3582, 17.4968] }, // Miyapur
      servingCapacity: 80,
      preferredCategories: ['Vegetarian', 'Vegetables', 'Fruits', 'Bakery'],
      isVerified: true,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    });

    // 4. Volunteers
    const volunteer1 = await User.create({
      name: 'Vikram Rao',
      email: 'volunteer@foodresq.org', // primary demo volunteer
      password: hashedPassword,
      phone: '+91 98497 77001',
      role: 'volunteer',
      organizationName: 'Individual Volunteer',
      organizationType: 'Individual Volunteer',
      address: 'Madhapur Village Road, Hyderabad 500081',
      location: { type: 'Point', coordinates: [78.3890, 17.4470] },
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    });

    const volunteer2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.volunteer@foodresq.org',
      password: hashedPassword,
      phone: '+91 98498 77002',
      role: 'volunteer',
      organizationName: 'Individual Volunteer',
      organizationType: 'Individual Volunteer',
      address: 'Kondapur Signal, Hyderabad 500084',
      location: { type: 'Point', coordinates: [78.3650, 17.4640] },
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });

    console.log('[FoodResQ Seed] Inserting realistic surplus food listings...');
    const now = new Date();

    const sampleDonations = [
      {
        title: 'Fresh Paneer Butter Masala & Steamed Basmati Rice',
        description: 'Surplus gourmet dinner prepared for corporate banquet. Hygienically sealed in heavy-duty food-grade insulated aluminum containers. Untouched and kept at 65°C.',
        category: 'Vegetarian',
        quantity: 85,
        quantityUnit: 'meals',
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 2 * 3600000),
        pickupStartTime: new Date(now.getTime() - 1 * 3600000),
        pickupEndTime: new Date(now.getTime() + 5 * 3600000),
        storageConditions: 'Keep Warm (>60°C)',
        handlingInstructions: 'Transport in insulated hot boxes. Safe for immediate distribution or within 4 hours.',
        allergenInfo: ['Dairy (Paneer, Butter, Cream)'],
        pickupAddress: 'Paradise Biryani Banquet Hall, Hitech City, Madhapur, Hyderabad',
        location: { type: 'Point', coordinates: [78.3826, 17.4483] },
        donorId: donor1._id,
        status: 'AVAILABLE',
        urgency: 'urgent',
      },
      {
        title: 'Authentic Hyderabadi Chicken Dum Biryani & Mirchi Ka Salan',
        description: 'Excess banquet batch from afternoon wedding celebration. Prepared with high grade basmati and tender chicken. Preserved in warm stainless food chafers.',
        category: 'Non-Vegetarian',
        quantity: 120,
        quantityUnit: 'meals',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 3 * 3600000),
        pickupStartTime: new Date(now.getTime() - 1 * 3600000),
        pickupEndTime: new Date(now.getTime() + 4 * 3600000),
        storageConditions: 'Keep Warm (>60°C)',
        handlingInstructions: 'Keep lid sealed until distribution. High calorie nutritious meal.',
        allergenInfo: ['Gluten', 'Peanuts (in Mirchi Ka Salan)'],
        pickupAddress: 'Paradise Biryani, Plot 12, Hitech City Main Rd, Hyderabad',
        location: { type: 'Point', coordinates: [78.3835, 17.4490] },
        donorId: donor1._id,
        status: 'AVAILABLE',
        urgency: 'normal',
      },
      {
        title: 'Assorted Artisanal Sourdough Breads & French Baguettes',
        description: 'Freshly baked morning batch unsold from cafe display. Fully edible, crusty, and perfect for soup kitchens and breakfast shelters.',
        category: 'Bakery',
        quantity: 45,
        quantityUnit: 'boxes',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 6 * 3600000),
        pickupStartTime: new Date(now.getTime() - 2 * 3600000),
        pickupEndTime: new Date(now.getTime() + 10 * 3600000),
        storageConditions: 'Room Temperature (15-25°C)',
        handlingInstructions: 'Store in dry environment. Shelf life 48 hours.',
        allergenInfo: ['Gluten', 'Wheat'],
        pickupAddress: 'Grand Palace Bakery, Road No 36, Jubilee Hills, Hyderabad',
        location: { type: 'Point', coordinates: [78.4072, 17.4319] },
        donorId: donor3._id,
        status: 'AVAILABLE',
        urgency: 'normal',
      },
      {
        title: 'Farm Fresh Organic Spinach, Bell Peppers & Tomatoes',
        description: 'Fresh surplus vegetables sourced for Sunday brunch buffet. Crisp, unwashed, Grade-A quality vegetables packed in breathable crates.',
        category: 'Vegetables',
        quantity: 60,
        quantityUnit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 10 * 3600000),
        pickupStartTime: new Date(now.getTime() - 3 * 3600000),
        pickupEndTime: new Date(now.getTime() + 14 * 3600000),
        storageConditions: 'Refrigerated (0-4°C)',
        handlingInstructions: 'Wash before culinary preparation.',
        allergenInfo: ['None reported'],
        pickupAddress: 'Green Leaf Gourmet, ISB Road, Financial District, Gachibowli, Hyderabad',
        location: { type: 'Point', coordinates: [78.3489, 17.4401] },
        donorId: donor2._id,
        status: 'AVAILABLE',
        urgency: 'normal',
      },
      {
        title: 'Crispy Butter Croissants & Choco Danish Pastries',
        description: 'Morning pastries from European bakery counter. Crisp flaky layers, rich butter flavor. Packaged in sanitized bakery cartons.',
        category: 'Bakery',
        quantity: 70,
        quantityUnit: 'portions',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 4 * 3600000),
        pickupStartTime: new Date(now.getTime() - 1 * 3600000),
        pickupEndTime: new Date(now.getTime() + 6 * 3600000),
        storageConditions: 'Room Temperature (15-25°C)',
        handlingInstructions: 'Handle gently to maintain pastry structure.',
        allergenInfo: ['Dairy', 'Gluten', 'Eggs', 'Soy'],
        pickupAddress: 'Grand Palace Luxury Hotel, Jubilee Hills, Hyderabad',
        location: { type: 'Point', coordinates: [78.4080, 17.4325] },
        donorId: donor3._id,
        status: 'AVAILABLE',
        urgency: 'urgent',
      },
      {
        title: 'Dal Tadka, Mix Veg Curry & Phulka Rotis',
        description: 'Healthy home-style wholesome dinner meal. Protein rich yellow dal and slow cooked seasonal vegetables with handmade whole wheat rotis.',
        category: 'Vegetarian',
        quantity: 110,
        quantityUnit: 'meals',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 2 * 3600000),
        pickupStartTime: new Date(now.getTime() - 1 * 3600000),
        pickupEndTime: new Date(now.getTime() + 3 * 3600000),
        storageConditions: 'Keep Warm (>60°C)',
        handlingInstructions: 'Ideal for immediate evening shelter meal service.',
        allergenInfo: ['Gluten (Rotis)'],
        pickupAddress: 'Green Leaf Catering Center, Gachibowli, Hyderabad',
        location: { type: 'Point', coordinates: [78.3510, 17.4420] },
        donorId: donor2._id,
        status: 'AVAILABLE',
        urgency: 'critical',
      },
      {
        title: 'Sweet Seasonal Alphonso Mangoes, Apples & Bananas',
        description: 'Fruit display from grand high-tea event. Whole uncut fresh fruits in pristine condition, ready for fruit salad or direct consumption.',
        category: 'Fruits',
        quantity: 50,
        quantityUnit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 8 * 3600000),
        pickupStartTime: new Date(now.getTime() - 2 * 3600000),
        pickupEndTime: new Date(now.getTime() + 18 * 3600000),
        storageConditions: 'Room Temperature (15-25°C)',
        handlingInstructions: 'Keep in ventilated trays.',
        allergenInfo: ['None reported'],
        pickupAddress: 'Grand Palace Hotel, Jubilee Hills, Hyderabad',
        location: { type: 'Point', coordinates: [78.4065, 17.4310] },
        donorId: donor3._id,
        status: 'AVAILABLE',
        urgency: 'normal',
      },
      {
        title: 'Sealed Greek Yogurt, Fresh Paneer & Flavored Milk Bottles',
        description: 'Dairy shipment overstock with 4 days until official best before date. Continuous cold chain maintained at 3°C.',
        category: 'Dairy',
        quantity: 90,
        quantityUnit: 'packets',
        imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 24 * 3600000),
        pickupStartTime: new Date(now.getTime() - 4 * 3600000),
        pickupEndTime: new Date(now.getTime() + 12 * 3600000),
        storageConditions: 'Refrigerated (0-4°C)',
        handlingInstructions: 'Maintain cold chain. Insulated ice bag recommended for transit.',
        allergenInfo: ['Dairy (Lactose)'],
        pickupAddress: 'Paradise Biryani Central Cold Room, Madhapur, Hyderabad',
        location: { type: 'Point', coordinates: [78.3810, 17.4475] },
        donorId: donor1._id,
        status: 'AVAILABLE',
        urgency: 'normal',
      },
      {
        title: 'Ready-to-Eat Nutritious Grain Bowls & Granola Bars',
        description: 'Factory-sealed protein-rich packaged grain bowls and oat granola snacks donated from tech campus cafeteria.',
        category: 'Packaged Food',
        quantity: 140,
        quantityUnit: 'portions',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 48 * 3600000),
        pickupStartTime: new Date(now.getTime() - 6 * 3600000),
        pickupEndTime: new Date(now.getTime() + 24 * 3600000),
        storageConditions: 'Room Temperature (15-25°C)',
        handlingInstructions: 'Dry storage, no refrigeration required.',
        allergenInfo: ['Nuts', 'Oats'],
        pickupAddress: 'Green Leaf Kitchen, Financial District, Gachibowli, Hyderabad',
        location: { type: 'Point', coordinates: [78.3530, 17.4390] },
        donorId: donor2._id,
        status: 'AVAILABLE',
        urgency: 'normal',
      },
      {
        title: 'South Indian Sambar, Coconut Chutney & Steamed Idlis',
        description: 'Breakfast surplus of 150 soft steamed idlis with piping hot lentil vegetable sambar. Cooked with pure ghee and fresh ground spices.',
        category: 'Vegetarian',
        quantity: 50,
        quantityUnit: 'meals',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        preparationTime: new Date(now.getTime() - 5 * 3600000),
        pickupStartTime: new Date(now.getTime() - 3 * 3600000),
        pickupEndTime: new Date(now.getTime() + 2 * 3600000),
        storageConditions: 'Keep Warm (>60°C)',
        handlingInstructions: 'Consume warm promptly.',
        allergenInfo: ['Coconut', 'Mustard seeds'],
        pickupAddress: 'Paradise Biryani, Madhapur, Hyderabad',
        location: { type: 'Point', coordinates: [78.3840, 17.4495] },
        donorId: donor1._id,
        status: 'AVAILABLE',
        urgency: 'critical',
      },
    ];

    const createdDonations = await Donation.insertMany(sampleDonations);
    console.log(`[FoodResQ Seed] Created ${createdDonations.length} surplus food listings.`);

    // 5. Create Realistic Requests (PENDING, ACCEPTED, COMPLETED)
    console.log('[FoodResQ Seed] Creating active and historical food requests...');

    // Request 1: PENDING request from Akshaya Meals to Paradise Biryani
    const pendingReq = await Request.create({
      donationId: createdDonations[0]._id, // Paneer Butter Masala
      recipientId: ngo1._id,
      requestedQuantity: 50,
      status: 'PENDING',
      notes: 'Request for our Kondapur children shelter evening dinner.',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(now.getTime() - 45 * 60000),
          updatedBy: ngo1._id,
          note: 'Request placed by Akshaya Meals Foundation for 50 meals.',
        },
      ],
    });
    // Reserve 50
    createdDonations[0].reservedQuantity = 50;
    createdDonations[0].status = 'PENDING';
    await createdDonations[0].save();

    // Request 2: ACCEPTED request with valid QR & OTP!
    const acceptedReq = await Request.create({
      donationId: createdDonations[1]._id, // Chicken Dum Biryani
      recipientId: ngo2._id,
      volunteerId: volunteer1._id,
      requestedQuantity: 80,
      status: 'ACCEPTED',
      notes: 'Distribution to daily-wage workers community in Kukatpally.',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(now.getTime() - 120 * 60000),
          updatedBy: ngo2._id,
          note: 'Request placed by Robin Food Army Hyderabad.',
        },
        {
          status: 'ACCEPTED',
          timestamp: new Date(now.getTime() - 60 * 60000),
          updatedBy: donor1._id,
          note: 'Accepted by Paradise Biryani. Pickup verification code generated.',
        },
      ],
    });

    const tokens = await generatePickupTokens(acceptedReq._id, createdDonations[1]._id, ngo2._id);
    acceptedReq.rawOtp = tokens.rawOtp;
    acceptedReq.pickupOtpHash = tokens.otpHash;
    acceptedReq.otpExpiresAt = tokens.otpExpiresAt;
    acceptedReq.qrPayload = tokens.qrPayload;
    await acceptedReq.save();

    createdDonations[1].reservedQuantity = 80;
    await createdDonations[1].save();

    // Request 3: COMPLETED historical request
    const completedReq = await Request.create({
      donationId: createdDonations[2]._id,
      recipientId: ngo3._id,
      volunteerId: volunteer2._id,
      requestedQuantity: 45,
      status: 'COMPLETED',
      notes: 'Delivered successfully to Miyapur elderly care home.',
      isOtpVerified: true,
      completedAt: new Date(now.getTime() - 24 * 3600000),
      statusHistory: [
        { status: 'PENDING', timestamp: new Date(now.getTime() - 28 * 3600000), updatedBy: ngo3._id },
        { status: 'ACCEPTED', timestamp: new Date(now.getTime() - 26 * 3600000), updatedBy: donor3._id },
        { status: 'PICKUP_IN_PROGRESS', timestamp: new Date(now.getTime() - 25 * 3600000), updatedBy: volunteer2._id },
        { status: 'COMPLETED', timestamp: new Date(now.getTime() - 24 * 3600000), updatedBy: volunteer2._id },
      ],
    });

    // 6. Create DonationHistory for verified impact calculations
    const history1 = await DonationHistory.create({
      donationId: createdDonations[2]._id,
      requestId: completedReq._id,
      donorId: donor3._id,
      recipientId: ngo3._id,
      volunteerId: volunteer2._id,
      verifiedQuantity: 45,
      quantityUnit: 'boxes',
      completedAt: new Date(now.getTime() - 24 * 3600000),
      donorRating: 5,
      recipientRating: 5,
      notes: 'Delivered promptly, fresh and hygienic.',
    });

    // Additional historical records for rich analytics
    await DonationHistory.create([
      {
        donationId: createdDonations[0]._id,
        requestId: pendingReq._id,
        donorId: donor1._id,
        recipientId: ngo1._id,
        volunteerId: volunteer1._id,
        verifiedQuantity: 150,
        quantityUnit: 'meals',
        completedAt: new Date(now.getTime() - 3 * 24 * 3600000),
        donorRating: 5,
        recipientRating: 5,
        notes: 'Redistributed to Kondapur community center.',
      },
      {
        donationId: createdDonations[3]._id,
        requestId: pendingReq._id,
        donorId: donor2._id,
        recipientId: ngo2._id,
        volunteerId: volunteer2._id,
        verifiedQuantity: 120,
        quantityUnit: 'kg',
        completedAt: new Date(now.getTime() - 7 * 24 * 3600000),
        donorRating: 5,
        recipientRating: 5,
        notes: 'Vegetables used for communal soup kitchen.',
      },
      {
        donationId: createdDonations[1]._id,
        requestId: acceptedReq._id,
        donorId: donor1._id,
        recipientId: ngo3._id,
        volunteerId: volunteer1._id,
        verifiedQuantity: 220,
        quantityUnit: 'meals',
        completedAt: new Date(now.getTime() - 14 * 24 * 3600000),
        donorRating: 5,
        recipientRating: 5,
        notes: 'Special weekend food drive.',
      },
    ]);

    // 7. Seed Notifications
    await Notification.create([
      {
        recipientUserId: donor1._id,
        title: 'New Food Request Received!',
        message: 'Akshaya Meals Foundation requested 50 meals of Fresh Paneer Butter Masala.',
        type: 'REQUEST_RECEIVED',
        relatedEntityId: pendingReq._id,
        isRead: false,
      },
      {
        recipientUserId: ngo2._id,
        title: 'Food Request Accepted!',
        message: 'Paradise Biryani accepted your request. Access your QR code and OTP for pickup.',
        type: 'REQUEST_ACCEPTED',
        relatedEntityId: acceptedReq._id,
        isRead: false,
      },
      {
        recipientUserId: volunteer1._id,
        title: 'Pickup Assignment Ready',
        message: 'New pickup ready at Paradise Biryani (Hitech City) bound for Kukatpally.',
        type: 'PICKUP_READY',
        relatedEntityId: acceptedReq._id,
        isRead: false,
      },
      {
        recipientUserId: admin._id,
        title: 'System Milestone Reached',
        message: 'FoodResQ platform has surpassed 500+ verified meals redistributed in Hyderabad!',
        type: 'GENERAL',
        isRead: true,
      },
    ]);

    // 8. Seed Sample Report for Admin Moderation
    await Report.create({
      reportedBy: ngo1._id,
      targetType: 'DONATION',
      targetId: createdDonations[0]._id.toString(),
      reason: 'Inquiry on storage temperature',
      details: 'Wanted to confirm if insulated containers will be provided during pickup.',
      status: 'PENDING',
    });

    console.log('[FoodResQ Seed] Seed data generated successfully!');
    return true;
  } catch (error) {
    console.error('[FoodResQ Seed Error]:', error);
    throw error;
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');
  connectDB().then(() => {
    seedDatabase().then(() => {
      console.log('[FoodResQ Seed] Finished seeding database.');
      process.exit(0);
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });
}
