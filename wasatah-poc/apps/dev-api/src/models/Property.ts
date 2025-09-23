import { getDatabase } from '../config/database.js';

export interface Property {
  _id?: string;
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  propertyType: 'villa' | 'apartment' | 'house' | 'commercial';
  status: 'available' | 'pending' | 'sold' | 'off_market';
  ownerId: string;
  ownerName: string;
  deedVerified: boolean;
  ownershipHistory: Array<{
    ownerId: string;
    ownerName: string;
    fromDate: string;
    toDate?: string;
    transferType: 'purchase' | 'inheritance' | 'gift' | 'foreclosure';
    deedVerified: boolean;
    verificationAuthority?: string;
  }>;
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export class PropertyModel {
  private static collection = 'properties';

  static async create(property: Omit<Property, '_id'>): Promise<Property> {
    const db = getDatabase();
    const result = await db.collection(this.collection).insertOne(property);
    return { ...property, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<Property | null> {
    const db = getDatabase();
    return await db.collection(this.collection).findOne({ id }) as Property | null;
  }

  static async findAll(): Promise<Property[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({}).toArray() as unknown as Property[];
  }

  static async findByOwner(ownerId: string): Promise<Property[]> {
    const db = getDatabase();
    return await db.collection(this.collection).find({ ownerId }).toArray() as unknown as Property[];
  }

  static async update(id: string, updates: Partial<Property>): Promise<Property | null> {
    const db = getDatabase();
    const result = await db.collection(this.collection).findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result as Property | null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.collection(this.collection).deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async seed(properties: Property[]): Promise<void> {
    const db = getDatabase();
    await db.collection(this.collection).insertMany(properties as any);
  }
}
