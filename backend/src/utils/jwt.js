const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, secretKey, {
        expiresIn: '1h', // Token expiration time
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null; // Token is invalid
    }
};

module.exports = {
    generateToken,
    verifyToken,
};