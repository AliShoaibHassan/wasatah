// Data utility helpers for Wasatah.app PoC
import type { User, Property, LedgerEvent } from '../types/models';

// Import seed data
import usersSeed from '../data/users.json';
import propertiesSeed from '../data/property.json';
import ledgerSeed from '../data/ledger.seed.json';

// Type definitions for seed data
type SeedData = {
  users: User[];
  properties: Property[];
  ledgerEvents: LedgerEvent[];
};

// Deep clone utility function
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

// Load seed data at runtime
export function loadSeedData(): SeedData {
  return {
    users: deepClone(usersSeed as User[]),
    properties: deepClone(propertiesSeed as Property[]),
    ledgerEvents: deepClone(ledgerSeed as LedgerEvent[]),
  };
}

// Clone seed objects for in-memory editing
export function cloneSeedUsers(): User[] {
  return deepClone(usersSeed as User[]);
}

export function cloneSeedProperties(): Property[] {
  return deepClone(propertiesSeed as Property[]);
}

export function cloneSeedLedgerEvents(): LedgerEvent[] {
  return deepClone(ledgerSeed as LedgerEvent[]);
}

// Generate unique IDs
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate blockchain-like hash
export function generateHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Generate signature
export function generateSignature(): string {
  return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create new ledger event
export function createLedgerEvent(
  type: LedgerEvent['type'],
  actorId: string,
  actorName: string,
  details: Record<string, any>
): LedgerEvent {
  return {
    id: generateId('tx'),
    type,
    timestamp: new Date().toISOString(),
    hash: generateHash(),
    actorId,
    actorName,
    details,
    signature: generateSignature(),
    blockNumber: 1000 + Math.floor(Math.random() * 1000),
    transactionIndex: Math.floor(Math.random() * 10),
  };
}

// Find user by email
export function findUserByEmail(users: User[], email: string): User | undefined {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Find property by ID
export function findPropertyById(properties: Property[], propertyId: string): Property | undefined {
  return properties.find(property => property.id === propertyId);
}

// Find ledger events by type
export function findLedgerEventsByType(events: LedgerEvent[], type: LedgerEvent['type']): LedgerEvent[] {
  return events.filter(event => event.type === type);
}

// Get recent ledger events
export function getRecentLedgerEvents(events: LedgerEvent[], limit: number = 10): LedgerEvent[] {
  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Export seed data for direct access
export const seedData = {
  users: usersSeed as User[],
  properties: propertiesSeed as Property[],
  ledgerEvents: ledgerSeed as LedgerEvent[],
};