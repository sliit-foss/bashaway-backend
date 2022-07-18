import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

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
            enum: [],
            required: true
        },
        bash_only: {
            type: boolean,
            required: true
        },
        max_score: {
            type: number,
            required: true
        },
        enabled: {
            type: boolean,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        creator_lock: {
            type: boolean,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
)

QuestionSchema.plugin(mongoosePaginate)

QuestionSchema.index({ createdAt: 1 })

const Question = mongoose.model('Submission', QuestionSchema)

Question.syncIndexes()

export default Question