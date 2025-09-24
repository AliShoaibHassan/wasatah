import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://shahzaibhaider161_db_user:S930thurUvTd2XzY@cluster0.exzelqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'wasatah';

let client: MongoClient;
let db: Db;

// In-memory storage for development
const inMemoryStore: Record<string, any[]> = {};

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    await createCollections();
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.log('🔄 Falling back to in-memory storage...');
    
    // Fallback to in-memory storage
    db = {
    collection: (name: string) => ({
      findOne: (query: any) => {
        const docs = inMemoryStore[name] || [];
        return Promise.resolve(docs.find(doc => {
          if (!query) return false;
          return Object.keys(query).every(key => doc[key] === query[key]);
        }) || null);
      },
      find: (query: any = {}) => ({
        toArray: () => {
          const docs = inMemoryStore[name] || [];
          return Promise.resolve(docs.filter(doc => {
            if (!query || Object.keys(query).length === 0) return true;
            return Object.keys(query).every(key => doc[key] === query[key]);
          }));
        },
        sort: (sortQuery: any) => ({
          toArray: () => {
            const docs = inMemoryStore[name] || [];
            return Promise.resolve(docs.sort((a, b) => {
              for (const [key, direction] of Object.entries(sortQuery)) {
                const aVal = a[key];
                const bVal = b[key];
                if (aVal < bVal) return direction === 1 ? -1 : 1;
                if (aVal > bVal) return direction === 1 ? 1 : -1;
              }
              return 0;
            }));
          },
          limit: (limit: number) => ({
            toArray: () => {
              const docs = inMemoryStore[name] || [];
              return Promise.resolve(docs.slice(0, limit));
            }
          })
        })
      }),
      insertOne: (doc: any) => {
        if (!inMemoryStore[name]) inMemoryStore[name] = [];
        const newDoc = { ...doc, _id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
        inMemoryStore[name].push(newDoc);
        return Promise.resolve({ insertedId: newDoc._id });
      },
      insertMany: (docs: any[]) => {
        if (!inMemoryStore[name]) inMemoryStore[name] = [];
        const newDocs = docs.map(doc => ({ ...doc, _id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }));
        inMemoryStore[name].push(...newDocs);
        return Promise.resolve({ insertedCount: newDocs.length });
      },
      findOneAndUpdate: (query: any, update: any, options: any) => {
        const docs = inMemoryStore[name] || [];
        const index = docs.findIndex(doc => {
          if (!query) return false;
          return Object.keys(query).every(key => doc[key] === query[key]);
        });
        
        if (index === -1) return Promise.resolve(null);
        
        const updatedDoc = { ...docs[index], ...update.$set };
        docs[index] = updatedDoc;
        return Promise.resolve(updatedDoc);
      },
      deleteOne: (query: any) => {
        const docs = inMemoryStore[name] || [];
        const index = docs.findIndex(doc => {
          if (!query) return false;
          return Object.keys(query).every(key => doc[key] === query[key]);
        });
        
        if (index !== -1) {
          docs.splice(index, 1);
          return Promise.resolve({ deletedCount: 1 });
        }
        return Promise.resolve({ deletedCount: 0 });
      },
      deleteMany: (query: any) => {
        const docs = inMemoryStore[name] || [];
        const initialLength = docs.length;
        const filteredDocs = docs.filter(doc => {
          if (!query) return false;
          return !Object.keys(query).every(key => doc[key] === query[key]);
        });
        inMemoryStore[name] = filteredDocs;
        return Promise.resolve({ deletedCount: initialLength - filteredDocs.length });
      },
      createCollection: () => {
        if (!inMemoryStore[name]) inMemoryStore[name] = [];
        return Promise.resolve();
      }
    })
  } as any;
  
    console.log('⚠️  Using in-memory fallback - data will not persist between restarts');
    return db;
  }
};

const createCollections = async () => {
  const collections = [
    'users',
    'properties', 
    'offers',
    'ledger_events',
    'risk_flags'
  ];

  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName);
      console.log(`📁 Created collection: ${collectionName}`);
      
      // Create indexes for better performance
      if (collectionName === 'users') {
        await db.collection(collectionName).createIndex({ email: 1 }, { unique: true });
        await db.collection(collectionName).createIndex({ id: 1 }, { unique: true });
      }
      if (collectionName === 'ledger_events') {
        await db.collection(collectionName).createIndex({ timestamp: -1 });
        await db.collection(collectionName).createIndex({ actorId: 1 });
      }
      if (collectionName === 'properties') {
        await db.collection(collectionName).createIndex({ id: 1 }, { unique: true });
        await db.collection(collectionName).createIndex({ status: 1 });
      }
      
    } catch (error: any) {
      // Collection might already exist, that's okay
      if (error.code !== 48) { // MongoDB error code for collection already exists
        console.warn(`⚠️  Warning creating collection ${collectionName}:`, error.message);
      }
    }
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
};
