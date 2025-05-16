const express = require('express');
const router = express.Router();
const { createBooking, getBookings, cancelBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Protected routes
router.use(auth);

// Booking routes
router.post('/', createBooking);
router.get('/', getBookings);
router.delete('/:id', cancelBooking);

module.exports = router; 