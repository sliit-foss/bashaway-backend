import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        score: {
            type: Number,
            default: 0,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        invite_codes: [
            {
                _id: false,
                type: String,
                required: true,
            },
        ],
        members: [
            {
                _id: false,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
    },
    {
        versionKey: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
);

GroupSchema.plugin(mongoosePaginate);

GroupSchema.index({ createdAt: 1 });

const Group = mongoose.model('Group', GroupSchema);

Group.syncIndexes();

export default Group;
