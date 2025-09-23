import { Router } from 'express';
import { LedgerEventModel } from '../models/LedgerEvent.js';
import { seedDatabase } from '../utils/seedData.js';
import crypto from 'crypto-js';

const router = Router();

// Validate ledger event structure
const validateLedgerEvent = (event: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!event.type || typeof event.type !== 'string') {
    errors.push('Event type is required and must be a string');
  }
  
  if (!event.actorId || typeof event.actorId !== 'string') {
    errors.push('Actor ID is required and must be a string');
  }
  
  if (!event.actorName || typeof event.actorName !== 'string') {
    errors.push('Actor name is required and must be a string');
  }
  
  if (!event.details || typeof event.details !== 'object') {
    errors.push('Event details are required and must be an object');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Generate SHA256 hash for event
const generateEventHash = (event: any): string => {
  const eventString = JSON.stringify({
    type: event.type,
    actorId: event.actorId,
    actorName: event.actorName,
    details: event.details,
    timestamp: event.timestamp
  });
  return '0x' + crypto.SHA256(eventString).toString();
};

// Generate unique ID
const generateEventId = (): string => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate signature
const generateSignature = (): string => {
  return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// GET /api/ledger - Get all ledger events
router.get('/', async (req, res) => {
  try {
    const events = await LedgerEventModel.findAll();
    res.json({ events });
  } catch (error) {
    console.error('Error reading ledger:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to read ledger',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/ledger/append - Add new ledger event with validation
router.post('/append', async (req, res) => {
  try {
    // Validate event structure
    const validation = validateLedgerEvent(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event data',
        details: validation.errors
      });
    }
    
    // Get current event count for block number
    const allEvents = await LedgerEventModel.findAll();
    
    // Create new event with proper structure
    const timestamp = new Date().toISOString();
    const newEvent = {
      id: generateEventId(),
      type: req.body.type,
      timestamp,
      hash: '', // Will be set after creating the event
      actorId: req.body.actorId,
      actorName: req.body.actorName,
      details: req.body.details,
      signature: generateSignature(),
      blockNumber: 1000 + allEvents.length,
      transactionIndex: 0
    };
    
    // Generate hash for the event
    newEvent.hash = generateEventHash(newEvent);
    
    // Save to database
    const savedEvent = await LedgerEventModel.create(newEvent);
    
    console.log(`📝 Added ledger event: ${savedEvent.type} by ${savedEvent.actorName}`);
    
    return res.status(201).json({
      success: true,
      data: savedEvent,
      message: 'Event added successfully'
    });
    
  } catch (error) {
    console.error('Error appending to ledger:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to append event to ledger',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/ledger/reset - Reset ledger to seed data
router.post('/reset', async (req, res) => {
  try {
    // Clear all existing data and reseed
    await seedDatabase();
    
    // Get the seeded events
    const events = await LedgerEventModel.findAll();
    
    console.log('🔄 Database reset and seeded with fresh data');
    
    res.json({
      success: true,
      message: 'Database reset successfully',
      data: {
        events,
        count: events.length
      }
    });
    
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset database',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as ledgerRoutes };