import { getDatabase } from '../config/database.js';

export interface RiskFlag {
  _id?: string;
  id: string;
  userId: string;
  type: 'impersonation' | 'duplicate_identity' | 'suspicious_activity' | 'verification_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  isActive: boolean;
  metadata: Record<string, any>;
}

export class RiskFlagModel {
  private static collection = 'risk_flags';

  static async create(riskFlag: Omit<RiskFlag, '_id'>): Promise<RiskFlag> {
    const db = getDatabase();
    const result = await db.collection(this.collection).insertOne(riskFlag);
    return { ...riskFlag, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<RiskFlag | null> {
    const db = getDatabase();
    return await db.collection(this.collection).findOne({ id }) as RiskFlag | null;
  }

  static async findAll(): Promise<RiskFlag[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({}).toArray() as unknown as RiskFlag[];
  }

  static async findByUser(userId: string): Promise<RiskFlag[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ userId }).toArray() as unknown as RiskFlag[];
  }

  static async findActive(): Promise<RiskFlag[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ isActive: true }).toArray() as unknown as RiskFlag[];
  }

  static async findCritical(): Promise<RiskFlag[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ 
      isActive: true, 
      severity: { $in: ['critical', 'high'] } 
    }).toArray() as unknown as RiskFlag[];
  }

  static async update(id: string, updates: Partial<RiskFlag>): Promise<RiskFlag | null> {
    const db = getDatabase();
    const result = await db.collection(this.collection).findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result as RiskFlag | null;
  }

  static async resolve(id: string): Promise<RiskFlag | null> {
    const db = getDatabase();
    const result = await db.collection(this.collection).findOneAndUpdate(
      { id },
      { 
        $set: { 
          isActive: false, 
          resolvedAt: new Date().toISOString() 
        } 
      },
      { returnDocument: 'after' }
    );
    return result as RiskFlag | null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.collection(this.collection).deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async seed(riskFlags: RiskFlag[]): Promise<void> {
    const db = getDatabase();
    await db.collection(this.collection).insertMany(riskFlags as any);
  }
}
