import mongoose from 'mongoose';

const SettingSchema = mongoose.Schema(
  {
    submission_deadline: {
      type: Date,
      default: null
    },
    registration_deadline: {
      type: Date,
      default: null
    },
    contest_start: {
      type: Date,
      default: null
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const Setting = mongoose.model('Setting', SettingSchema);

Setting.syncIndexes();

export default Setting;
