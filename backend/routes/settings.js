const express = require('express');
const User = require('../models/User');
const UserSettings = require('../models/UserSettings');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

function getDefaultSettings(user) {
  return {
    profile: {
      displayName: user.name,
      email: user.email,
    },
    appearance: { theme: 'system' },
    diaryPreferences: {
      defaultEntryView: 'list',
      confirmBeforeDelete: true,
      showEntryPreview: true,
    },
    notifications: {
      entryReminders: true,
      tagNotifications: false,
    },
  };
}

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const defaults = getDefaultSettings(req.user);
    const settings = await UserSettings.findOne({ userId: req.user._id });

    if (!settings) {
      return res.json(defaults);
    }

    return res.json({
      profile: defaults.profile, // User table is truth for profile
      appearance: settings.appearance || defaults.appearance,
      diaryPreferences: settings.diaryPreferences || defaults.diaryPreferences,
      notifications: settings.notifications || defaults.notifications,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { profile, appearance, diaryPreferences, notifications } = req.body;

    // Update profile in User model
    if (profile) {
      const user = await User.findById(req.user._id);
      user.name = profile.displayName;

      if (profile.email !== user.email) {
        const existing = await User.findOne({
          email: profile.email.toLowerCase(),
        });
        if (existing && existing._id.toString() !== user._id.toString()) {
          return res.status(400).json({ detail: 'Email already taken' });
        }
        user.email = profile.email.toLowerCase();
      }

      await user.save();
      // Update req.user so defaults reflect the new values
      req.user = user;
    }

    // Update or create UserSettings
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = new UserSettings({ userId: req.user._id });
    }

    if (appearance) settings.appearance = appearance;
    if (diaryPreferences) settings.diaryPreferences = diaryPreferences;
    if (notifications) settings.notifications = notifications;

    await settings.save();

    // Return fresh state
    const defaults = getDefaultSettings(req.user);
    return res.json({
      profile: defaults.profile,
      appearance: settings.appearance || defaults.appearance,
      diaryPreferences: settings.diaryPreferences || defaults.diaryPreferences,
      notifications: settings.notifications || defaults.notifications,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
