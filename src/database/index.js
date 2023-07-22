import logger from '../utils/logger';
import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, { keepAlive: true, connectTimeoutMS: 3000 }).catch((error) => {
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
