import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const SettingSchema = mongoose.Schema(
    {
        submission_setting: {
            type: mongoose.Schema.Types.Date,
            required: true
        },
        registration_setting: {
            type: mongoose.Schema.Types.Date,
            required: true
        }
    },
    {
        versionKey: '__v',
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

SettingSchema.plugin(mongoosePaginate);

SettingSchema.index({ createdAt: 1 });

const Setting = mongoose.model('Setting', SettingSchema);

Setting.syncIndexes();

export default Setting;
