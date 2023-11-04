import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';

const MerchandiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    photo_url: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  }
);

MerchandiseSchema.plugin(mongoosePaginate);

MerchandiseSchema.plugin(aggregatePaginate);

MerchandiseSchema.index({ createdAt: 1 });

const Merchandise = mongoose.model('Merchandise', MerchandiseSchema);

Merchandise.syncIndexes();

export default Merchandise;
