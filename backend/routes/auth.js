const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(422).json({ detail: 'Name, email, and password are required.' });
    }
    if (name.length < 2 || name.length > 50) {
      return res.status(422).json({ detail: 'Name must be between 2 and 50 characters.' });
    }
    if (password.length < 6 || password.length > 128) {
      return res.status(422).json({ detail: 'Password must be between 6 and 128 characters.' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ detail: 'A user with this email already exists.' });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    return res.status(200).json(user.toJSON());
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ detail: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const expiresInMinutes = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES) || 1440;
    const token = jwt.sign(
      { sub: user.email },
      process.env.JWT_SECRET,
      { expiresIn: `${expiresInMinutes}m` }
    );

    return res.json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  return res.json(req.user.toJSON());
});

module.exports = router;
