const bcrypt = require('bcrypt');
const userSchema = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are requiredes' });
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const checkUser = await userSchema.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error during signup' });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json('Something is missing');
  }
  const user = await userSchema.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = await jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_EXPIRY }
    );
    res.status(200).json({ token: accessToken });
  } else {
    res.status(400).json('soryy');
  }
};

const currentUSer = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { userSignup, userLogin, currentUSer };
