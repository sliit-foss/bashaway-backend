import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
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

const SettingSchema = new mongoose.Schema(
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
    },
    round_breakpoint: {
      type: Date,
      default: null
    },
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
