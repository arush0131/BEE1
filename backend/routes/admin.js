const express = require('express');
const router = express.Router();
const { addTransport, updateTransport, deleteTransport, getAllBookings } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protected admin routes
router.use(auth);
router.use(adminAuth);

// Admin routes
router.post('/transport', addTransport);
router.put('/transport/:id', updateTransport);
router.delete('/transport/:id', deleteTransport);
router.get('/bookings', getAllBookings);

module.exports = router; 