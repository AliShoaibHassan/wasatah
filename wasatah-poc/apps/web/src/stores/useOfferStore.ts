import { create } from 'zustand';
import type { Offer, OfferForm, OfferStatus } from '../types/models';

interface OfferState {
  // State
  offers: Offer[];
  currentOffer: Offer | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadOffers: () => Promise<void>;
  loadOffer: (id: string) => Promise<Offer | null>;
  createOffer: (offerData: OfferForm) => Promise<Offer>;
  updateOfferStatus: (id: string, status: OfferStatus, message?: string) => Promise<Offer>;
  withdrawOffer: (id: string) => Promise<void>;
  getOffersByProperty: (propertyId: string) => Offer[];
  getOffersByBuyer: (buyerId: string) => Offer[];
  getOffersBySeller: (sellerId: string) => Offer[];
  getPendingOffers: () => Offer[];
  clearError: () => void;
}

export const useOfferStore = create<OfferState>((set, get) => ({
  // Initial state
  offers: [],
  currentOffer: null,
  isLoading: false,
  error: null,

  // Actions
  loadOffers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to load offers
      console.log('Loading offers...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock offers data
      const mockOffers: Offer[] = [
        {
          id: 'offer_001',
          propertyId: 'prop_001',
          buyerId: 'user_001',
          buyerName: 'Sarah Al-Mansouri',
          amount: 2500000,
          currency: 'SAR',
          message: 'I am very interested in this property. Please consider my offer.',
          status: 'pending',
          submittedAt: '2024-09-22T14:15:00Z',
          conditions: ['Subject to inspection', '30-day closing'],
        },
        {
          id: 'offer_002',
          propertyId: 'prop_001',
          buyerId: 'user_004',
          buyerName: 'Khalid Al-Rashid',
          amount: 2300000,
          currency: 'SAR',
          message: 'Cash offer, no conditions.',
          status: 'rejected',
          submittedAt: '2024-09-21T10:30:00Z',
          respondedAt: '2024-09-21T16:45:00Z',
        },
      ];
      
      set({
        offers: mockOffers,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load offers',
      });
    }
  },

  loadOffer: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to load single offer
      console.log('Loading offer:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offers = get().offers;
      const offer = offers.find(o => o.id === id) || null;
      
      set({
        currentOffer: offer,
        isLoading: false,
      });
      
      return offer;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load offer',
      });
      return null;
    }
  },

  createOffer: async (offerData: OfferForm) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to create offer
      console.log('Creating offer:', offerData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOffer: Offer = {
        id: `offer_${Date.now()}`,
        ...offerData,
        buyerId: 'current_user', // TODO: Get from auth store
        buyerName: 'Current User', // TODO: Get from auth store
        currency: 'SAR',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      
      const offers = get().offers;
      set({
        offers: [...offers, newOffer],
        isLoading: false,
      });
      
      return newOffer;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create offer',
      });
      throw error;
    }
  },

  updateOfferStatus: async (id: string, status: OfferStatus, message?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to update offer status
      console.log('Updating offer status:', id, status, message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offers = get().offers;
      const updatedOffers = offers.map(offer =>
        offer.id === id 
          ? { 
              ...offer, 
              status, 
              respondedAt: new Date().toISOString(),
              message: message || offer.message,
            }
          : offer
      );
      
      const currentOffer = get().currentOffer;
      set({
        offers: updatedOffers,
        currentOffer: currentOffer?.id === id 
          ? { 
              ...currentOffer, 
              status, 
              respondedAt: new Date().toISOString(),
              message: message || currentOffer.message,
            }
          : currentOffer,
        isLoading: false,
      });
      
      return updatedOffers.find(o => o.id === id)!;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update offer',
      });
      throw error;
    }
  },

  withdrawOffer: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to withdraw offer
      console.log('Withdrawing offer:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offers = get().offers;
      const updatedOffers = offers.map(offer =>
        offer.id === id 
          ? { 
              ...offer, 
              status: 'withdrawn' as OfferStatus,
              respondedAt: new Date().toISOString(),
            }
          : offer
      );
      
      const currentOffer = get().currentOffer;
      set({
        offers: updatedOffers,
        currentOffer: currentOffer?.id === id 
          ? { 
              ...currentOffer, 
              status: 'withdrawn' as OfferStatus,
              respondedAt: new Date().toISOString(),
            }
          : currentOffer,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to withdraw offer',
      });
    }
  },

  getOffersByProperty: (propertyId: string) => {
    return get().offers.filter(o => o.propertyId === propertyId);
  },

  getOffersByBuyer: (buyerId: string) => {
    return get().offers.filter(o => o.buyerId === buyerId);
  },

  getOffersBySeller: (_sellerId: string) => {
    // TODO: Implement logic to get offers for properties owned by seller
    // For now, return empty array
    return [];
  },

  getPendingOffers: () => {
    return get().offers.filter(o => o.status === 'pending');
  },

  clearError: () => {
    set({ error: null });
  },
}));
