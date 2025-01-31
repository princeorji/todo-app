const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        await user.save();

        const accessToken = generateToken({ id: user._id, email: user.email });

        res.status(201).json({ accessToken });
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const accessToken = generateToken({ id: user._id, email: user.email });

        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login
}