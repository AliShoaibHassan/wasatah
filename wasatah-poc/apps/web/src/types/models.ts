// Core Types for Wasatah.app PoC

export type Role = 'buyer' | 'seller' | 'broker';

export interface DigitalID {
  id: string;
  userId: string;
  verified: boolean;
  verificationMethod: 'NAFTA_SIM' | 'KYC' | 'BIOMETRIC';
  issuedAt: string;
  expiresAt?: string;
  zkpProof?: string; // ZKP-like proof tag (simulated)
  riskScore: number; // 0-100, lower is better
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  digitalId?: DigitalID;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface OwnershipHop {
  ownerId: string;
  ownerName: string;
  fromDate: string;
  toDate?: string; // undefined means current owner
  transferType: 'purchase' | 'inheritance' | 'gift' | 'foreclosure';
  deedVerified: boolean;
  verificationAuthority?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  area: number; // in square meters
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  propertyType: 'villa' | 'apartment' | 'house' | 'commercial';
  status: 'available' | 'pending' | 'sold' | 'off_market';
  ownerId: string;
  ownerName: string;
  deedVerified: boolean;
  ownershipHistory: OwnershipHop[];
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus = 'pending' | 'locked' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';

export interface Offer {
  id: string;
  propertyId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  currency: string;
  message?: string;
  status: OfferStatus;
  submittedAt: string;
  respondedAt?: string;
  expiresAt?: string;
  conditions?: string[];
  brokerId?: string; // If broker facilitated
}

export type EventType = 
  | 'user_registered'
  | 'user_verified'
  | 'property_listed'
  | 'property_updated'
  | 'offer_made'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'transaction_completed'
  | 'transfer_completed'
  | 'identity_verification'
  | 'deed_verification'
  | 'risk_assessment'
  | 'impersonation_detected'
  | 'impersonation_flag'
  | 'buyer_broker_linked'
  | 'zkp_check';

export interface LedgerEvent {
  id: string;
  type: EventType;
  timestamp: string;
  hash: string; // Simulated blockchain hash
  actorId: string;
  actorName: string;
  details: Record<string, any>;
  signature?: string; // Simulated cryptographic signature
  blockNumber?: number; // Simulated block number
  transactionIndex?: number;
}

export interface RiskFlag {
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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface OfferForm {
  propertyId: string;
  amount: number;
  message?: string;
  conditions?: string[];
}

export interface PropertyForm {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  propertyType: Property['propertyType'];
  features: string[];
}

// Filter and Search Types
export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: Property['propertyType'];
  city?: string;
  deedVerified?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: PropertyFilters;
  sortBy?: 'price' | 'area' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Dashboard Data Types
export interface DashboardStats {
  totalProperties: number;
  activeOffers: number;
  completedTransactions: number;
  totalValue: number;
  currency: string;
}

export interface UserDashboard {
  user: User;
  stats: DashboardStats;
  recentActivity: LedgerEvent[];
  riskFlags: RiskFlag[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'offer' | 'transaction' | 'verification' | 'risk' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// ZKP Proof Types (Simulated)
export interface ZKPProof {
  id: string;
  type: 'identity_verification' | 'financial_capability' | 'property_ownership';
  proof: string; // Simulated proof data
  verified: boolean;
  verifiedAt: string;
  expiresAt?: string;
  metadata: Record<string, any>;
}

// Broker Connection Types
export interface BrokerConnection {
  id: string;
  brokerId: string;
  brokerName: string;
  buyerId?: string;
  sellerId?: string;
  propertyId?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}
