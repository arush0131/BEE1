const express = require('express');
const router = express.Router();
const { getTransports } = require('../controllers/transportController');

// Public routes
router.get('/transports', getTransports);

module.exports = router; 