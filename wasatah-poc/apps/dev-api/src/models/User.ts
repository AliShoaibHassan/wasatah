import { getDatabase } from '../config/database.js';

export interface User {
  _id?: string;
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'broker';
  digitalId?: {
    id: string;
    userId: string;
    verified: boolean;
    verificationMethod: 'NAFTA_SIM' | 'KYC' | 'BIOMETRIC';
    issuedAt: string;
    expiresAt?: string;
    zkpProof?: string;
    riskScore: number;
  };
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export class UserModel {
  private static collection = 'users';

  static async create(user: Omit<User, '_id'>): Promise<User> {
    const db = getDatabase();
    const result = await db.collection(this.collection).insertOne(user);
    return { ...user, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<User | null> {
    const db = getDatabase();
    return await db.collection(this.collection).findOne({ id }) as User | null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    return await db.collection(this.collection).findOne({ email }) as User | null;
  }

  static async findAll(): Promise<User[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({}).toArray() as unknown as User[];
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    const db = getDatabase();
    const result = await db.collection(this.collection).findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result as User | null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.collection(this.collection).deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async seed(users: User[]): Promise<void> {
    const db = getDatabase();
    await db.collection(this.collection).insertMany(users as any);
  }
}
