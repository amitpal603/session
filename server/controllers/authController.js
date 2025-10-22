const User = require('../models/user')

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or username'
        });
      }

      const user = new User({
        username,
        email,
        password,
        profile: { firstName, lastName }
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Store user in session
      req.session.user = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        preferences: user.preferences,
        isLoggedIn: true,
        loginTime: new Date()
      };

      res.json({
        success: true,
        message: 'Login successful',
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  },

  logout: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Logout failed'
        });
      }

      res.clearCookie('authSession');
      res.json({
        success: true,
        message: 'Logout successful'
      });
    });
  },

  getCurrentUser: (req, res) => {
    if (req.session.user && req.session.user.isLoggedIn) {
      res.json({
        success: true,
        user: req.session.user
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  },

  updateSessionPreferences: (req, res) => {
    try {
      const { preferences } = req.body;

      if (preferences && req.session.user) {
        req.session.user.preferences = {
          ...req.session.user.preferences,
          ...preferences
        };
      }

      res.json({
        success: true,
        message: 'Preferences updated',
        preferences: req.session.user.preferences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update preferences',
        error: error.message
      });
    }
  }
};

module.exports = authController;