import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    photo_url: {
        type: String,
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

UserSchema.plugin(mongoosePaginate);

UserSchema.index({ createdAt: 1 });

const User = mongoose.model('User', UserSchema);

User.syncIndexes();

export default User;
