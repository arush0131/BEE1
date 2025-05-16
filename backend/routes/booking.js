const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBooking, cancelBooking, getUserBookings } = require('../controllers/bookingController');

// Create a new booking
router.post('/', auth, createBooking);

// Get user's bookings
router.get('/my-bookings', auth, getUserBookings);

// Cancel a booking
router.post('/:id/cancel', auth, cancelBooking);

module.exports = router; 