import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const challengeDifficulties = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
  extreme: 'EXTREME'
};

const ChallengeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: Object.values(challengeDifficulties),
      required: true
    },
    constraints: [
      {
        type: String
      }
    ],
    max_score: {
      type: Number,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creator_lock: {
      type: Boolean,
      default: false
    },
    codebase_url: {
      type: String,
      required: true
    },
    strict_inputs: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

ChallengeSchema.plugin(mongoosePaginate);

ChallengeSchema.index({ createdAt: 1 });

const Challenge = mongoose.model('Challenge', ChallengeSchema);

Challenge.syncIndexes();

export default Challenge;
