const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://shahzaibhaider161_db_user:S930thurUvTd2XzY@cluster0.exzelqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'wasatah';

let client;
let db;

const connectToDatabase = async () => {
  if (db) {
    return db;
  }

  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Create collections and indexes
    await createCollections();
    
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
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
      
    } catch (error) {
      // Collection might already exist, that's okay
      if (error.code !== 48) {
        console.warn(`⚠️  Warning creating collection ${collectionName}:`, error.message);
      }
    }
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://prismatic-panda-fca344.netlify.app',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const db = await connectToDatabase();
    const path = event.path.replace('/api', '');
    
    // Route handling
    if (path === '/health') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ 
          status: 'ok', 
          timestamp: new Date().toISOString() 
        })
      };
    }

    // User authentication endpoints
    if (path === '/auth/login') {
      if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const collection = db.collection('users');
        
        const user = await collection.findOne({ 
          email: body.email,
          password: body.password // In production, use hashed passwords
        });
        
        if (!user) {
          return {
            statusCode: 401,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            },
            body: JSON.stringify({ 
              success: false,
              error: 'Invalid credentials' 
            })
          };
        }
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          body: JSON.stringify({ 
            success: true,
            data: { user: { ...user, password: undefined } }
          })
        };
      }
    }

    if (path === '/auth/register') {
      if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const collection = db.collection('users');
        
        // Check if user already exists
        const existingUser = await collection.findOne({ email: body.email });
        if (existingUser) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            },
            body: JSON.stringify({ 
              success: false,
              error: 'User already exists' 
            })
          };
        }
        
        // Create new user
        const newUser = {
          ...body,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          isActive: true,
          digitalId: {
            id: `DID-${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            verified: true,
            verificationMethod: 'NAFTA_SIM',
            issuedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            zkpProof: `zkp_proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            riskScore: Math.floor(Math.random() * 20) + 5,
          }
        };
        
        await collection.insertOne(newUser);
        
        return {
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          body: JSON.stringify({ 
            success: true,
            data: { user: { ...newUser, password: undefined } }
          })
        };
      }
    }

    if (path === '/ledger') {
      if (event.httpMethod === 'GET') {
        const collection = db.collection('ledger_events');
        const events = await collection.find({}).sort({ timestamp: -1 }).toArray();
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          body: JSON.stringify({ events })
        };
      }
      
      if (event.httpMethod === 'POST' && path.includes('/append')) {
        const body = JSON.parse(event.body);
        const collection = db.collection('ledger_events');
        
        const newEvent = {
          ...body,
          timestamp: new Date().toISOString(),
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        await collection.insertOne(newEvent);
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          body: JSON.stringify(newEvent)
        };
      }
      
      if (event.httpMethod === 'POST' && path.includes('/reset')) {
        const collection = db.collection('ledger_events');
        await collection.deleteMany({});
        
        // Insert seed data
        const seedData = [
          {
            id: 'event_1',
            type: 'PROPERTY_LISTED',
            actorId: 'seller_1',
            actorName: 'Ahmed Al-Rashid',
            timestamp: new Date().toISOString(),
            details: {
              propertyId: 'prop_1',
              propertyAddress: '123 Palm Street, Dubai Marina',
              listingPrice: 2500000
            }
          }
        ];
        
        await collection.insertMany(seedData);
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
          body: JSON.stringify({ events: seedData })
        };
      }
    }

    // Default response
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
