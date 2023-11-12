import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';
import SettingSchema from './setting';

const EventSchema = new mongoose.Schema(
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
    capacity: {
      type: Number,
      required: true
    },
    photo_url: String,
    event_date: {
      type: Date,
      required: true
    },
    tags: [String],
    settings: {
      type: SettingSchema,
      default: {}
    },
    faqs: {
      type: [
        {
          _id: false,
          question: {
            type: String,
            required: true
          },
          answer: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },
    speakers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Speaker'
        }
      ],
      default: []
    },
    survey: {
      type: [String],
      default: []
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creator_lock: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  }
);

EventSchema.plugin(mongoosePaginate);

EventSchema.plugin(aggregatePaginate);

EventSchema.index({ createdAt: 1 });

const Event = mongoose.model('Event', EventSchema);

Event.syncIndexes();

export default Event;
