import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    verification_code: {
      type: String,
      required: false
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true
    },
    photo_url: {
      type: String,
      required: false
    },
    university: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'GROUP'],
      default: 'GROUP',
      required: true
    },
    score: {
      type: Number,
      required: false
    },
    members: {
      type: [
        {
          _id: false,
          name: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true
          },
          phone: {
            type: String,
            required: true
          },
          academic_year: {
            type: Number,
            required: true,
            min: [1, 'Academic year should be from 1 to 4'],
            max: [4, 'Academic year should be from 1 to 4']
          }
        }
      ],
      required: false
    }
  },
  {
    versionKey: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

UserSchema.plugin(aggregatePaginate);

UserSchema.index({ createdAt: 1 });

const User = mongoose.model('User', UserSchema);

User.syncIndexes();

export default User;
