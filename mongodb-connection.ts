import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || '');
    console.log('MongoDB connected successfully!');
    return mongoose.connection.readyState;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return mongoose.connection.readyState;
  }
};

export default connectDB;
