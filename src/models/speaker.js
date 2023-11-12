import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const SpeakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    photo_url: String,
    organization: String,
    designation: String,
    social_links: {
      github: String,
      linkedin: String
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  }
);

SpeakerSchema.plugin(mongoosePaginate);

SpeakerSchema.index({ createdAt: 1 });

const Speaker = mongoose.model('Speaker', SpeakerSchema);

Speaker.syncIndexes();

export default Speaker;
