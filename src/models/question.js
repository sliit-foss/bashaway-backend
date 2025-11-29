import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { DIFFICULTY } from '@/constants';
import audit from '@/helpers/audit';

const QuestionSchema = new mongoose.Schema(
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
      enum: Object.values(DIFFICULTY),
      required: true,
      index: true
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
      default: true,
      index: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
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

QuestionSchema.plugin(audit);

QuestionSchema.plugin(mongoosePaginate);

QuestionSchema.index({ created_at: 1 });

const Question = mongoose.model('Question', QuestionSchema);

Question.syncIndexes();

export default Question;
