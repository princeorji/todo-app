const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const verifyToken = (token) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
}

module.exports = {
    generateToken,
    verifyToken
}