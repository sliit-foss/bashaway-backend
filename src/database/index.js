import { moduleLogger } from '@sliit-foss/module-logger';
import mongoose from 'mongoose';
import { MONGO_URI } from '@/config';

const logger = moduleLogger('Database-connection');

const connectDB = () => {
  mongoose.connect(MONGO_URI, { keepAlive: true, connectTimeoutMS: 3000 }).catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
  mongoose.connection.on('connected', () => {
    logger.info('Connected to database successfully');
  });
  mongoose.connection.on('error', (error) => {
    logger.error(`Error connecting to database: ${error}`);
  });
};

export default connectDB;
