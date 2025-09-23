import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ledgerRoutes } from './routes/ledger.js';
import { userRoutes } from './routes/users.js';
import { propertyRoutes } from './routes/properties.js';
import { offerRoutes } from './routes/offers.js';
import { connectToDatabase } from './config/database.js';
import { seedDatabase } from './utils/seedData.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for localhost:5173 (Vite dev server)
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/ledger', ledgerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/offers', offerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Check if we need to seed the database
    const { LedgerEventModel } = await import('./models/LedgerEvent.js');
    const eventCount = await LedgerEventModel.findAll();
    
    if (eventCount.length === 0) {
      console.log('🌱 Database is empty, seeding with initial data...');
      await seedDatabase();
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Dev API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Ledger API: http://localhost:${PORT}/api/ledger`);
      console.log(`🗄️  Database: MongoDB Atlas (wasatah)`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
