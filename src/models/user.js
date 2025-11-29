import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { GENDER, MEAL_PREFERENCE, ROLE } from '@/constants';
import audit from '@/helpers/audit';

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
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    verification_code: {
      type: String
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    is_active: {
      type: Boolean,
      default: true
    },
    eliminated: {
      type: Boolean,
      index: true
    },
    photo_url: {
      type: String
    },
    university: {
      type: String
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.GROUP,
      index: true
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
          },
          nic: {
            type: String
          },
          gender: {
            type: String,
            enum: Object.values(GENDER)
          },
          meal_preference: {
            type: String,
            enum: Object.values(MEAL_PREFERENCE)
          },
          student_id_url: {
            type: String
          }
        }
      ]
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

UserSchema.plugin(audit);

UserSchema.plugin(aggregatePaginate);

UserSchema.index({ created_at: 1 });

const User = mongoose.model('User', UserSchema);

User.syncIndexes();

export default User;
