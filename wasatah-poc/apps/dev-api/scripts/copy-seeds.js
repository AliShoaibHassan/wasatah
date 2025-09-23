#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const DATA_DIR = join(__dirname, '../data');
const SEED_FILE = join(DATA_DIR, 'ledger.seed.json');
const LEDGER_FILE = join(DATA_DIR, 'ledger.json');

console.log('🌱 Setting up seed data for dev-api...');

try {
  // Ensure data directory exists
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory');
  }

  // Check if seed file exists
  if (!existsSync(SEED_FILE)) {
    console.error('❌ Seed file not found:', SEED_FILE);
    console.log('Please ensure ledger.seed.json exists in the data directory');
    process.exit(1);
  }

  // Copy seed data to ledger.json
  const seedData = readFileSync(SEED_FILE, 'utf8');
  writeFileSync(LEDGER_FILE, seedData);
  
  console.log('✅ Seed data copied to ledger.json');
  console.log('📊 Ledger initialized with', JSON.parse(seedData).length, 'events');
  console.log('🚀 Ready to start dev-api server');
  
} catch (error) {
  console.error('❌ Error setting up seed data:', error.message);
  process.exit(1);
}