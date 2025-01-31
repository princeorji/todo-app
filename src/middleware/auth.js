const { verifyToken } = require('../utils/jwt')

const protect  = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        return res.status(401).json({ message: 'No authentication provided' })
    }

    const [, token] = bearer.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'Bearer has no token' })
    }

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token provided' })
    }
}

module.exports = protect;