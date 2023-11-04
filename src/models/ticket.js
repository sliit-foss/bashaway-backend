import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';

const payments = {
  success: 'Success',
  failed: 'Failed',
  cancelled: 'Cancelled',
  pending: 'Pending',
  refunded: 'Refunded',
  chargebacked: 'Chargebacked'
};

const TicketSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    approved: {
      type: Boolean,
      default: false
    },
    transferred: {
      type: Boolean,
      default: false
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    payment_status: {
      type: String,
      enum: Object.values(payments),
      default: payments.pending
    },
    merchandise: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Merchandise'
        }
      ],
      default: []
    },
    survey: {
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
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  }
);

TicketSchema.plugin(mongoosePaginate);

TicketSchema.plugin(aggregatePaginate);

TicketSchema.index({ createdAt: 1 });

const Ticket = mongoose.model('Ticket', TicketSchema);

Ticket.syncIndexes();

export default Ticket;
