import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Route Imports
import authRoutes from './routes/auth';
import jobsRoutes from './routes/jobs';
import locationsRoutes from './routes/locations';
import paymentRoutes from './routes/payment';
import stellenanzeigenRoutes from './routes/stellenanzeigen-aufgeben';
import sucheJobRoutes from './routes/suche-einen-job';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Datenbankverbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/surveyjobs')
  .then(() => console.log('MongoDB verbunden'))
  .catch((err) => console.error('MongoDB Verbindungsfehler:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/stellenanzeigen', stellenanzeigenRoutes);
app.use('/api/suche', sucheJobRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check Route
app.get('/', (_: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server läuft' });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Etwas ist schiefgelaufen!' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 