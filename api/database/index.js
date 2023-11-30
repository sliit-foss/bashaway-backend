import { moduleLogger } from '@sliit-foss/module-logger';
import mongoose from 'mongoose';

const logger = moduleLogger('Database-connection');

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

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

export default connectDB;
