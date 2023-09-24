// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();
// Import your config file


// router.get("/check", (req, res) => {
//     res.send("Auth running");
// });
// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Hash the password before saving it to the database


        //Check if user already exists
        const isUser = User.findOne({ email }).then((user) => {
            if (user) {
                return res.status(400).json({ error: 'User already exists' });
            }
        })

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        if(token){console.log(token)}

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;
