import { default as context } from 'express-http-context';
import { plugin } from '@sliit-foss/mongoose-audit';
import { default as mongoose } from 'mongoose';
import { ctxUser } from '@/constants';

export const audit = (schema, opts) => {
  schema.plugin(plugin, {
    getUser: () => {
      const userId = context.get(ctxUser)?._id;
      if (userId) return new mongoose.Types.ObjectId(userId);
      return 'System';
    },
    exclude: ['created_at', 'updated_at'],
    ...opts
  });
};

export default audit;
