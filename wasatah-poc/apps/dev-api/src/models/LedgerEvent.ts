import { getDatabase } from '../config/database.js';

export interface LedgerEvent {
  _id?: string;
  id: string;
  type: 'user_registered' | 'user_verified' | 'property_listed' | 'property_updated' | 
        'offer_made' | 'offer_accepted' | 'offer_rejected' | 'transaction_completed' | 
        'transfer_completed' | 'identity_verification' | 'deed_verification' | 
        'risk_assessment' | 'impersonation_detected' | 'impersonation_flag' | 
        'buyer_broker_linked' | 'zkp_check';
  timestamp: string;
  hash: string;
  actorId: string;
  actorName: string;
  details: Record<string, any>;
  signature?: string;
  blockNumber?: number;
  transactionIndex?: number;
}

export class LedgerEventModel {
  private static collection = 'ledger_events';

  static async create(event: Omit<LedgerEvent, '_id'>): Promise<LedgerEvent> {
    const db = getDatabase();
    const result = await db.collection(this.collection).insertOne(event);
    return { ...event, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<LedgerEvent | null> {
    const db = getDatabase();
    return await db.collection(this.collection).findOne({ id }) as LedgerEvent | null;
  }

  static async findAll(): Promise<LedgerEvent[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({}).sort({ timestamp: -1 }).toArray() as unknown as LedgerEvent[];
  }

  static async findByType(type: LedgerEvent['type']): Promise<LedgerEvent[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ type }).sort({ timestamp: -1 }).toArray() as unknown as LedgerEvent[];
  }

  static async findByActor(actorId: string): Promise<LedgerEvent[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ actorId }).sort({ timestamp: -1 }).toArray() as unknown as LedgerEvent[];
  }

  static async getRecent(limit: number = 10): Promise<LedgerEvent[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({}).sort({ timestamp: -1 }).limit(limit).toArray() as unknown as LedgerEvent[];
  }

  static async deleteAll(): Promise<number> {
    const db = getDatabase();
    const result = await db.collection(this.collection).deleteMany({});
    return result.deletedCount;
  }

  static async seed(events: LedgerEvent[]): Promise<void> {
    const db = getDatabase();
    await db.collection(this.collection).insertMany(events as any);
  }
}
