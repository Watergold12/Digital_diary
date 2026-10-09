const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  appearance: {
    type: Object,
    default: { theme: 'system' },
  },
  diaryPreferences: {
    type: Object,
    default: {
      defaultEntryView: 'list',
      confirmBeforeDelete: true,
      showEntryPreview: true,
    },
  },
  notifications: {
    type: Object,
    default: {
      entryReminders: true,
      tagNotifications: false,
    },
  },
});

userSettingsSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.userId;
    return ret;
  },
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
