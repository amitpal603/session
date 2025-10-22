const User = require('../models/user');

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, avatar, bio } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.session.user.id,
        {
          $set: {
            'profile.firstName': firstName,
            'profile.lastName': lastName,
            'profile.avatar': avatar,
            'profile.bio': bio
          }
        },
        { new: true, runValidators: true }
      );

      // Update session data
      if (user && req.session.user) {
        req.session.user.profile = user.profile;
        req.session.user.username = user.username;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Profile update failed',
        error: error.message
      });
    }
  },

  updatePreferences: async (req, res) => {
    try {
      const { theme, language, notifications } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.session.user.id,
        {
          $set: {
            'preferences.theme': theme,
            'preferences.language': language,
            'preferences.notifications': notifications
          }
        },
        { new: true }
      );

      // Update session preferences
      if (user && req.session.user) {
        req.session.user.preferences = user.preferences;
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        preferences: user.preferences
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

module.exports = userController;