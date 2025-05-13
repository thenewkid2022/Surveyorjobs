import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Connection Pool Konfiguration
const connectionOptions = {
  maxPoolSize: 10,      // Maximale Anzahl gleichzeitiger Verbindungen
  minPoolSize: 5,       // Minimale Anzahl aktiver Verbindungen
  socketTimeoutMS: 45000, // Timeout für Operationen
  connectTimeoutMS: 10000, // Timeout für Verbindungsaufbau
  serverSelectionTimeoutMS: 5000, // Timeout für Server-Auswahl
};

// Singleton-Pattern für die Verbindung
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

async function connectDB() {
  // Wenn bereits verbunden, gib die bestehende Verbindung zurück
  if (isConnected) {
    return mongoose;
  }

  // Wenn ein Verbindungsversuch läuft, warte darauf
  if (connectionPromise) {
    return connectionPromise;
  }

  // Starte neuen Verbindungsversuch
  connectionPromise = mongoose.connect(MONGODB_URI, connectionOptions)
    .then((mongoose) => {
      isConnected = true;
      console.log('MongoDB verbunden');

      // Event-Handler für Verbindungsprobleme
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB Verbindungsfehler:', err);
        isConnected = false;
        connectionPromise = null;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB Verbindung getrennt');
        isConnected = false;
        connectionPromise = null;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB Verbindung wiederhergestellt');
        isConnected = true;
      });

      return mongoose;
    })
    .catch((error) => {
      console.error('MongoDB Verbindungsfehler:', error);
      isConnected = false;
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

// Hilfsfunktion für Datenbankoperationen
export async function withDB<T>(operation: () => Promise<T>): Promise<T> {
  try {
    await connectDB();
    return await operation();
  } catch (error) {
    console.error('Datenbankoperation fehlgeschlagen:', error);
    throw error;
  }
}

export default connectDB; 