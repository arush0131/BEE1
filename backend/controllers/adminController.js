const { readData, writeData } = require('../utils/fileUtils');

const addTransport = async (req, res) => {
    try {
        const { type, name, from, to, departureTime, arrivalTime, price, seats } = req.body;
        const transports = await readData('transports.json') || [];

        const newTransport = {
            id: Date.now().toString(),
            type,
            name,
            from,
            to,
            departureTime,
            arrivalTime,
            price,
            seats,
            availableSeats: seats
        };

        transports.push(newTransport);
        await writeData('transports.json', transports);

        res.status(201).json(newTransport);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTransport = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const transports = await readData('transports.json') || [];

        const transportIndex = transports.findIndex(t => t.id === id);
        if (transportIndex === -1) {
            return res.status(404).json({ message: 'Transport not found' });
        }

        transports[transportIndex] = {
            ...transports[transportIndex],
            ...updates
        };

        await writeData('transports.json', transports);
        res.json(transports[transportIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTransport = async (req, res) => {
    try {
        const { id } = req.params;
        const transports = await readData('transports.json') || [];

        const transportIndex = transports.findIndex(t => t.id === id);
        if (transportIndex === -1) {
            return res.status(404).json({ message: 'Transport not found' });
        }

        transports.splice(transportIndex, 1);
        await writeData('transports.json', transports);

        res.json({ message: 'Transport deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await readData('bookings.json') || [];
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addTransport,
    updateTransport,
    deleteTransport,
    getAllBookings
}; 