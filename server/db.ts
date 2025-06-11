import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Obtener la URI de MongoDB desde las variables de entorno
const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase() {
  try {
    if (!MONGODB_URI) {
      console.warn('MONGODB_URI no está definida, usando almacenamiento en memoria');
      return;
    }

    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority' as const
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log('Conectado exitosamente a MongoDB en la nube');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    if (error instanceof Error) {
      if (error.message.includes('IP whitelist')) {
        console.error('Error: Tu IP no está en la lista blanca de MongoDB Atlas. Por favor, agrega tu IP actual en la configuración de MongoDB Atlas.');
      } else if (error.message.includes('Authentication failed')) {
        console.error('Error: Las credenciales de MongoDB son incorrectas. Por favor, verifica tu usuario y contraseña.');
      }
    }
    console.warn('Usando almacenamiento en memoria como respaldo');
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error al desconectar de MongoDB:', error);
  }
}

export { mongoose };