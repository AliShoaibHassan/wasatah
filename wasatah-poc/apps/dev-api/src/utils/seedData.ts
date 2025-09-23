import { UserModel, User } from '../models/User.js';
import { PropertyModel, Property } from '../models/Property.js';
import { OfferModel, Offer } from '../models/Offer.js';
import { LedgerEventModel, LedgerEvent } from '../models/LedgerEvent.js';
import { RiskFlagModel, RiskFlag } from '../models/RiskFlag.js';

export const seedDatabase = async (): Promise<void> => {
  console.log('🌱 Seeding database with initial data...');

  // Clear existing data
  await LedgerEventModel.deleteAll();
  console.log('🗑️  Cleared existing data');

  // Seed Users
  const users: User[] = [
    {
      id: 'user_001',
      email: 'sarah@example.com',
      name: 'Sarah Al-Mansouri',
      phone: '+966501234567',
      role: 'buyer',
      digitalId: {
        id: 'DID-001',
        userId: 'user_001',
        verified: true,
        verificationMethod: 'NAFTA_SIM',
        issuedAt: '2024-09-20T08:00:00Z',
        expiresAt: '2025-09-20T08:00:00Z',
        zkpProof: 'zkp_proof_001',
        riskScore: 15
      },
      createdAt: '2024-09-20T08:00:00Z',
      lastLoginAt: '2024-09-22T14:30:00Z',
      isActive: true
    },
    {
      id: 'user_002',
      email: 'ahmed@example.com',
      name: 'Ahmed Al-Rashid',
      phone: '+966501234568',
      role: 'seller',
      digitalId: {
        id: 'DID-002',
        userId: 'user_002',
        verified: true,
        verificationMethod: 'KYC',
        issuedAt: '2024-09-20T08:15:00Z',
        expiresAt: '2025-09-20T08:15:00Z',
        zkpProof: 'zkp_proof_002',
        riskScore: 10
      },
      createdAt: '2024-09-20T08:15:00Z',
      lastLoginAt: '2024-09-22T15:00:00Z',
      isActive: true
    },
    {
      id: 'broker_001',
      email: 'broker@wasatah.com',
      name: 'Current Broker',
      phone: '+966501234569',
      role: 'broker',
      digitalId: {
        id: 'DID-003',
        userId: 'broker_001',
        verified: true,
        verificationMethod: 'BIOMETRIC',
        issuedAt: '2024-09-20T08:30:00Z',
        expiresAt: '2025-09-20T08:30:00Z',
        zkpProof: 'zkp_proof_003',
        riskScore: 5
      },
      createdAt: '2024-09-20T08:30:00Z',
      lastLoginAt: '2024-09-22T16:00:00Z',
      isActive: true
    }
  ];

  await UserModel.seed(users);
  console.log('👥 Seeded users');

  // Seed Properties
  const properties: Property[] = [
    {
      id: 'prop_001',
      title: 'Luxury Villa in Al-Nakheel District',
      description: 'A stunning 4-bedroom luxury villa located in the prestigious Al-Nakheel district of Riyadh. This modern property features contemporary design, premium finishes, and a private garden perfect for family living.',
      address: 'Al-Nakheel District, Riyadh 12345',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      price: 2800000,
      currency: 'SAR',
      area: 450,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2020,
      propertyType: 'villa',
      status: 'available',
      ownerId: 'user_002',
      ownerName: 'Ahmed Al-Rashid',
      deedVerified: true,
      ownershipHistory: [
        {
          ownerId: 'user_002',
          ownerName: 'Ahmed Al-Rashid',
          fromDate: '2020-01-15T00:00:00Z',
          transferType: 'purchase',
          deedVerified: true,
          verificationAuthority: 'Saudi Land Registry'
        }
      ],
      images: ['/images/villa1.jpg', '/images/villa2.jpg', '/images/villa3.jpg'],
      features: ['Swimming Pool', 'Private Garden', 'Smart Home System', '2-Car Garage'],
      createdAt: '2024-09-20T09:00:00Z',
      updatedAt: '2024-09-20T09:00:00Z'
    }
  ];

  await PropertyModel.seed(properties);
  console.log('🏠 Seeded properties');

  // Seed Offers
  const offers: Offer[] = [
    {
      id: 'offer_001',
      propertyId: 'prop_001',
      buyerId: 'user_001',
      buyerName: 'Sarah Al-Mansouri',
      amount: 2500000,
      currency: 'SAR',
      message: 'I am very interested in this property. Please consider my offer.',
      status: 'locked',
      submittedAt: '2024-09-20T14:15:00Z',
      conditions: ['Subject to inspection', '30-day closing']
    }
  ];

  await OfferModel.seed(offers);
  console.log('💰 Seeded offers');

  // Seed Ledger Events
  const events: LedgerEvent[] = [
    {
      id: 'event_001',
      type: 'user_registered',
      timestamp: '2024-09-20T08:00:00Z',
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      actorId: 'user_001',
      actorName: 'Sarah Al-Mansouri',
      details: {
        email: 'sarah@example.com',
        role: 'buyer',
        verificationMethod: 'NAFTA_SIM'
      },
      signature: '0xabc123def456',
      blockNumber: 1,
      transactionIndex: 0
    },
    {
      id: 'event_002',
      type: 'user_verified',
      timestamp: '2024-09-20T08:15:00Z',
      hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      actorId: 'user_001',
      actorName: 'Sarah Al-Mansouri',
      details: {
        verificationStatus: 'verified',
        method: 'NAFTA_SIM',
        confidence: 0.95
      },
      signature: '0xdef456ghi789',
      blockNumber: 2,
      transactionIndex: 0
    },
    {
      id: 'event_003',
      type: 'property_listed',
      timestamp: '2024-09-20T09:00:00Z',
      hash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      actorId: 'user_002',
      actorName: 'Ahmed Al-Rashid',
      details: {
        propertyId: 'prop_001',
        title: 'Luxury Villa in Al-Nakheel District',
        price: 2800000,
        currency: 'SAR',
        deedVerified: true
      },
      signature: '0xghi789jkl012',
      blockNumber: 3,
      transactionIndex: 0
    },
    {
      id: 'event_004',
      type: 'offer_made',
      timestamp: '2024-09-20T14:15:00Z',
      hash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      actorId: 'user_001',
      actorName: 'Sarah Al-Mansouri',
      details: {
        offerId: 'offer_001',
        propertyId: 'prop_001',
        amount: 2500000,
        currency: 'SAR',
        status: 'locked',
        message: 'I am very interested in this property. Please consider my offer.'
      },
      signature: '0xjkl012mno345',
      blockNumber: 4,
      transactionIndex: 0
    },
    {
      id: 'event_005',
      type: 'zkp_check',
      timestamp: '2024-09-20T15:30:00Z',
      hash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      actorId: 'user_001',
      actorName: 'Sarah Al-Mansouri',
      details: {
        verificationType: 'identity_verification',
        zkpProof: 'zkp_proof_001',
        verified: true,
        confidence: 0.98
      },
      signature: '0xmno345pqr678',
      blockNumber: 5,
      transactionIndex: 0
    }
  ];

  await LedgerEventModel.seed(events);
  console.log('📝 Seeded ledger events');

  // Seed Risk Flags
  const riskFlags: RiskFlag[] = [
    {
      id: 'risk_001',
      userId: 'user_001',
      type: 'impersonation',
      severity: 'high',
      description: 'Potential identity impersonation detected - similar email pattern found',
      detectedAt: '2024-09-22T12:00:00Z',
      isActive: true,
      metadata: {
        emailPattern: 'test*@example.com',
        similarAccounts: ['user_006', 'user_007'],
        confidence: 0.85
      }
    }
  ];

  await RiskFlagModel.seed(riskFlags);
  console.log('⚠️  Seeded risk flags');

  console.log('✅ Database seeding completed!');
};
