import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    discount_percentage: {
      type: Number,
      enum: [25, 50, 75, 100],
      default: 100
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  }
);

CouponSchema.plugin(mongoosePaginate);

CouponSchema.plugin(aggregatePaginate);

CouponSchema.index({ createdAt: 1 });

const Coupon = mongoose.model('Coupon', CouponSchema);

Coupon.syncIndexes();

export default Coupon;
