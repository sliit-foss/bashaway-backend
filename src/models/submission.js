import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const SubmissionSchema = mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
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
        }
    },
    {
        versionKey: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

SubmissionSchema.plugin(mongoosePaginate);

SubmissionSchema.index({ createdAt: 1 });

const Submission = mongoose.model('Submission', SubmissionSchema);

Submission.syncIndexes();

export default Submission;