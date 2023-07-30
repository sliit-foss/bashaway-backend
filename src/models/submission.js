import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const SubmissionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    link: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: false
    },
    graded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

SubmissionSchema.plugin(mongoosePaginate);

SubmissionSchema.index({ createdAt: 1 });

const Submission = mongoose.model('Submission', SubmissionSchema);

Submission.syncIndexes();

export default Submission;
