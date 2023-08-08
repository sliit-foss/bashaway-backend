import mongoose from 'mongoose';

const SettingsSchema = mongoose.Schema(
  {
    submissionDeadline: {
      type: Date,
      default: null
    },
    registrationDeadline: {
      type: Date,
      default: null
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const Settings = mongoose.model('Settings', SettingsSchema);

Settings.syncIndexes();

export default Settings;
