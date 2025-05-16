const jwt = require('jsonwebtoken');
const { readData } = require('../utils/fileUtils');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = await readData('users.json') || [];
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth; 