// Update to the login route in backend/routes/auth.js

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Please enter both email and password',
      details: { 
        field: !email ? 'email' : 'password'
      }
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format',
      details: { field: 'email' }
    });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid credentials', 
        details: { field: 'email' }
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid credentials',
        details: { field: 'password' }
      });
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
