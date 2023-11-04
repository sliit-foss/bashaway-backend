import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const mealPreferences = ['Vegetarian', 'Vegan', 'Non-Vegetarian'];

export const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const domains = [
  'High School Student',
  'Undergraduate',
  'Postgraduate',
  'Industry Professional',
  'Researcher',
  'Other'
];

export const roles = {
  superadmin: 'Super Admin',
  entrant: 'Entrant'
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
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
    photo_url: String,
    phone: String,
    nic: String,
    gender: {
      type: String,
      enum: genders
    },
    meal_preference: {
      type: String,
      enum: mealPreferences
    },
    tshirt_size: {
      type: String,
      enum: tshirtSizes
    },
    domain: {
      type: String,
      enum: domains
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.entrant
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

UserSchema.plugin(aggregatePaginate);

UserSchema.index({ createdAt: 1 });

const User = mongoose.model('User', UserSchema);

User.syncIndexes();

export default User;
