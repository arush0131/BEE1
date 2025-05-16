const { readData } = require('../utils/fileUtils');

const getTransports = async (req, res) => {
    try {
        const transports = await readData('transports.json') || [];
        res.json(transports);
    } catch (error) {
        console.error('Error fetching transports:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTransports
}; 