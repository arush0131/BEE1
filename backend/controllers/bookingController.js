const { readData, writeData } = require('../utils/fileUtils');

const createBooking = async (req, res) => {
    try {
        const { transportId, type, date, passengers } = req.body;
        const userId = req.user.id;

        console.log('Creating booking with data:', { transportId, type, date, passengers, userId });

        // Read current data
        const [transports, bookings] = await Promise.all([
            readData('transports.json') || [],
            readData('bookings.json') || []
        ]);

        console.log('Found transports:', transports.length);
        console.log('Found bookings:', bookings.length);

        // Find the transport
        const transport = transports.find(t => t.id === transportId);
        if (!transport) {
            console.error('Transport not found:', transportId);
            return res.status(404).json({ message: 'Transport not found' });
        }

        console.log('Found transport:', transport);

        // Check if enough seats are available
        if (transport.availableSeats < passengers) {
            console.error('Not enough seats available:', { available: transport.availableSeats, requested: passengers });
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Create new booking
        const newBooking = {
            id: Date.now().toString(),
            userId,
            transportId,
            type,
            date,
            passengers,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        console.log('Creating new booking:', newBooking);

        // Update transport's available seats
        transport.availableSeats -= passengers;

        // Save changes
        await Promise.all([
            writeData('bookings.json', [...bookings, newBooking]),
            writeData('transports.json', transports)
        ]);

        console.log('Booking created successfully');
        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        console.log('Cancelling booking:', { id, userId });

        // Read current data
        const [transports, bookings] = await Promise.all([
            readData('transports.json') || [],
            readData('bookings.json') || []
        ]);

        // Find the booking
        const bookingIndex = bookings.findIndex(b => b.id === id && b.userId === userId);
        if (bookingIndex === -1) {
            console.error('Booking not found:', id);
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookings[bookingIndex];

        // Only allow cancellation of confirmed bookings
        if (booking.status !== 'confirmed') {
            console.error('Cannot cancel booking:', booking.status);
            return res.status(400).json({ message: 'Cannot cancel this booking' });
        }

        // Find the transport and update available seats
        const transport = transports.find(t => t.id === booking.transportId);
        if (transport) {
            transport.availableSeats += booking.passengers;
        }

        // Update booking status
        bookings[bookingIndex] = {
            ...booking,
            status: 'cancelled'
        };

        // Save changes
        await Promise.all([
            writeData('bookings.json', bookings),
            writeData('transports.json', transports)
        ]);

        console.log('Booking cancelled successfully');
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancellation error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching bookings for user:', userId);
        
        const bookings = await readData('bookings.json') || [];
        const userBookings = bookings.filter(b => b.userId === userId);
        
        console.log('Found bookings:', userBookings.length);
        res.json(userBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

module.exports = {
    createBooking,
    cancelBooking,
    getUserBookings
}; 