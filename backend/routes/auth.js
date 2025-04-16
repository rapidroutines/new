const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { 
  sendPasswordResetEmail, 
  sendResetSuccessEmail,
  sendWelcomeEmail
} = require('../utils/emailService');

// Validation helper function
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};


// Validation helper function
const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number, and allows special characters
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  return passwordRegex.test(password);
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number' 
    });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Save user to database
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Welcome email send failed:', emailError);
      // Non-critical error, so we'll still return success
    }

    // Return token and user data
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joined: user.joined,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login timestamp
    user.lastLogin = Date.now();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token and user data
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joined: user.joined,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(200).json({ message: 'If an account exists with this email, a password reset link will be sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiration
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${req.headers.origin || 'https://rapidroutines.org'}/reset-password/${resetToken}`;

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (emailError) {
      console.error('Password reset email send failed:', emailError);
      return res.status(500).json({ message: 'Error sending password reset email' });
    }

    res.status(200).json({ message: 'Password reset email sent. Please check your inbox.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  // Validate input
  if (!token) {
    return res.status(400).json({ message: 'Reset token is required' });
  }

  // Validate password
  if (!password) {
    return res.status(400).json({ message: 'New password is required' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number' 
    });
  }

  try {
    // Hash the token for comparison
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send password reset success email
    try {
      await sendResetSuccessEmail(user.email);
    } catch (emailError) {
      console.error('Password reset success email send failed:', emailError);
      // Non-critical error, so we'll still return success
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', auth, async (req, res) => {
  const { name, email } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (email && !validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name
    user.name = name;

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if new email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joined: user.joined,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;
