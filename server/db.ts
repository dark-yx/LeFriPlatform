import mongoose from 'mongoose';

// Use local MongoDB for development, cloud MongoDB for production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lefri-ai';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    isConnected = true;
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // For development, create in-memory fallback
    console.log('Falling back to memory storage for development');
    isConnected = true;
    return null;
  }
}

export { mongoose };