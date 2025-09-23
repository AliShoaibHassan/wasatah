import { create } from 'zustand';
import type { LedgerEvent, EventType } from '../types/models';
import { apiClient, isReadonlyMode } from '../utils/api';
import { cloneSeedLedgerEvents } from '../utils/data';

interface LedgerState {
  // State
  events: LedgerEvent[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadEvents: () => Promise<void>;
  addEvent: (type: EventType, actorId: string, actorName: string, details: Record<string, any>) => Promise<LedgerEvent>;
  getEventsByType: (type: EventType) => LedgerEvent[];
  getEventsByActor: (actorId: string) => LedgerEvent[];
  getRecentEvents: (limit?: number) => LedgerEvent[];
  clearEvents: () => void;
  clearError: () => void;
  resetLedger: () => Promise<void>;
}

export const useLedgerStore = create<LedgerState>((set, get) => ({
  // Initial state
  events: [],
  isLoading: false,
  error: null,

  // Actions
  loadEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (isReadonlyMode()) {
        // In read-only mode, load from bundled seed data
        console.log('Loading ledger events from seed data (read-only mode)...');
        const seedEvents = cloneSeedLedgerEvents();
        set({
          events: seedEvents,
          isLoading: false,
        });
        return;
      }

      // Try to load from API
      console.log('Loading ledger events from API...');
      const response = await apiClient.getLedgerEvents();
      
      if (response.success && response.data) {
        set({
          events: response.data.events || [],
          isLoading: false,
        });
      } else {
        // Fallback to seed data if API fails
        console.warn('API failed, falling back to seed data:', response.error);
        const seedEvents = cloneSeedLedgerEvents();
        set({
          events: seedEvents,
          isLoading: false,
        });
      }
    } catch (error) {
      // Fallback to seed data on any error
      console.warn('Error loading from API, falling back to seed data:', error);
      const seedEvents = cloneSeedLedgerEvents();
      set({
        events: seedEvents,
        isLoading: false,
      });
    }
  },

  addEvent: async (type: EventType, actorId: string, actorName: string, details: Record<string, any>) => {
    set({ isLoading: true, error: null });
    
    try {
      if (isReadonlyMode()) {
        throw new Error('Cannot add events in read-only mode');
      }

      console.log('Adding ledger event via API:', type, actorId, actorName, details);
      
      // Call API to append event
      const response = await apiClient.appendLedgerEvent(type, actorId, actorName, details);
      
      if (response.success && response.data) {
        // Add the new event to the local state
        const events = get().events;
        set({
          events: [response.data, ...events], // Add to beginning for chronological order
          isLoading: false,
        });
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add ledger event');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add ledger event',
      });
      throw error;
    }
  },

  getEventsByType: (type: EventType) => {
    return get().events.filter(e => e.type === type);
  },

  getEventsByActor: (actorId: string) => {
    return get().events.filter(e => e.actorId === actorId);
  },

  getRecentEvents: (limit: number = 10) => {
    return get().events.slice(0, limit);
  },

  clearEvents: () => {
    set({ events: [] });
  },

  clearError: () => {
    set({ error: null });
  },

  resetLedger: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (isReadonlyMode()) {
        // In read-only mode, just reload from seed data
        const seedEvents = cloneSeedLedgerEvents();
        set({
          events: seedEvents,
          isLoading: false,
        });
        return;
      }

      console.log('Resetting ledger via API...');
      const response = await apiClient.resetLedger();
      
      if (response.success && response.data) {
        set({
          events: response.data.events || [],
          isLoading: false,
        });
      } else {
        throw new Error(response.error || 'Failed to reset ledger');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset ledger',
      });
      throw error;
    }
  },
}));
