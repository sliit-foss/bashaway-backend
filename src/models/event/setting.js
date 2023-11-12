import mongoose from 'mongoose';

const PaymentSettingsSchema = new mongoose.Schema({
  _id: false,
  enabled: {
    type: Boolean,
    default: false
  },
  ticket_cost: {
    type: Number,
    default: 0
  },
  allow_coupons: {
    type: Boolean,
    default: true
  },
  speaker_discount_percentage: {
    type: Number,
    default: 100
  },
  early_bird_discount: {
    enabled: {
      type: Boolean,
      default: false
    },
    deadline: {
      type: Date,
      default: Date.now
    },
    percentage: {
      type: Number,
      default: 0
    }
  }
});

const VisualSettingsSchema = new mongoose.Schema({
  _id: false,
  color_code: {
    type: String,
    default: '#000000'
  }
});

const SettingSchema = new mongoose.Schema({
  _id: false,
  enabled: {
    type: Boolean,
    default: true
  },
  automatic_approval: {
    type: Boolean,
    default: true
  },
  registration_start: {
    type: Date,
    required: true
  },
  registration_end: {
    type: Date,
    required: true
  },
  payments: {
    type: PaymentSettingsSchema,
    default: {}
  },
  visuals: {
    type: VisualSettingsSchema,
    default: {}
  }
});

export default SettingSchema;
