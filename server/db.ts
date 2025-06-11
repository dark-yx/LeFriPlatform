import mongoose from 'mongoose';

// Use environment variable for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  if (!MONGODB_URI) {
    console.log('No MongoDB URI provided, using memory storage for development');
    isConnected = true;
    return null;
  }

  try {
    await mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
    
    isConnected = true;
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to memory storage for development');
    isConnected = true;
    return null;
  }
}

export { mongoose };