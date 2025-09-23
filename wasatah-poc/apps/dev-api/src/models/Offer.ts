import { getDatabase } from '../config/database.js';

export interface Offer {
  _id?: string;
  id: string;
  propertyId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  currency: string;
  message?: string;
  status: 'pending' | 'locked' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  submittedAt: string;
  respondedAt?: string;
  expiresAt?: string;
  conditions?: string[];
  brokerId?: string;
}

export class OfferModel {
  private static collection = 'offers';

  static async create(offer: Omit<Offer, '_id'>): Promise<Offer> {
    const db = getDatabase();
    const result = await db.collection(this.collection).insertOne(offer);
    return { ...offer, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<Offer | null> {
    const db = getDatabase();
    return await db.collection(this.collection).findOne({ id }) as Offer | null;
  }

  static async findAll(): Promise<Offer[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({}).toArray() as unknown as Offer[];
  }

  static async findByProperty(propertyId: string): Promise<Offer[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ propertyId }).toArray() as unknown as Offer[];
  }

  static async findByBuyer(buyerId: string): Promise<Offer[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ buyerId }).toArray() as unknown as Offer[];
  }

  static async findBySeller(sellerId: string): Promise<Offer[]> {
    const db = getDatabase();
    // This would require joining with properties collection
    // For now, we'll implement a simple approach
    const properties = await db.collection('properties').find({ ownerId: sellerId }).toArray() as any[];
    const propertyIds = properties.map(p => p.id);
    return await db.collection(this.collection).find({ propertyId: { $in: propertyIds } }).toArray() as unknown as Offer[];
  }

  static async update(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    const db = getDatabase();
    const result = await db.collection(this.collection).findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result as Offer | null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.collection(this.collection).deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async seed(offers: Offer[]): Promise<void> {
    const db = getDatabase();
    await db.collection(this.collection).insertMany(offers as any);
  }
}
