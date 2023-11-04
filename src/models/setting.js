import mongoose from 'mongoose';

const LeaderboardSchema = mongoose.Schema({
  freezed: {
    type: Boolean,
    default: false
  },
  freeze_at: {
    type: Date,
    default: null
  },
  freeze_vanguard: {
    type: Number,
    default: 3
  }
});

const SettingSchema = mongoose.Schema(
  {
    leaderboard: {
      type: LeaderboardSchema,
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
