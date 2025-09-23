import { create } from 'zustand';
import type { Property, PropertyFilters, SearchParams, PropertyForm } from '../types/models';

interface PropertyState {
  // State
  properties: Property[];
  currentProperty: Property | null;
  filteredProperties: Property[];
  isLoading: boolean;
  error: string | null;
  filters: PropertyFilters;
  searchQuery: string;
  
  // Actions
  loadProperties: () => Promise<void>;
  loadProperty: (id: string) => Promise<Property | null>;
  createProperty: (propertyData: PropertyForm) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
  searchProperties: (params: SearchParams) => Promise<Property[]>;
  setFilters: (filters: PropertyFilters) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  getPropertiesByOwner: (ownerId: string) => Property[];
  getVerifiedProperties: () => Property[];
  clearError: () => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  // Initial state
  properties: [],
  currentProperty: null,
  filteredProperties: [],
  isLoading: false,
  error: null,
  filters: {},
  searchQuery: '',

  // Actions
  loadProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to load properties
      console.log('Loading properties...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock properties data
      const mockProperties: Property[] = [
        {
          id: 'prop_001',
          title: 'Luxury Villa in Riyadh',
          description: 'Beautiful modern villa with premium amenities',
          address: 'Al Olaya District',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          price: 2800000,
          currency: 'SAR',
          area: 450,
          bedrooms: 5,
          bathrooms: 4,
          yearBuilt: 2018,
          propertyType: 'villa',
          status: 'available',
          ownerId: 'user_002',
          ownerName: 'Ahmed Al-Rashid',
          deedVerified: true,
          ownershipHistory: [
            {
              ownerId: 'user_002',
              ownerName: 'Ahmed Al-Rashid',
              fromDate: '2020-01-01',
              transferType: 'purchase',
              deedVerified: true,
              verificationAuthority: 'Saudi Land Registry',
            },
            {
              ownerId: 'user_003',
              ownerName: 'Mohammed Al-Saud',
              fromDate: '2015-01-01',
              toDate: '2020-01-01',
              transferType: 'purchase',
              deedVerified: true,
              verificationAuthority: 'Saudi Land Registry',
            },
          ],
          images: ['/images/villa1.jpg', '/images/villa2.jpg'],
          features: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-09-22T00:00:00Z',
        },
      ];
      
      set({
        properties: mockProperties,
        filteredProperties: mockProperties,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load properties',
      });
    }
  },

  loadProperty: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to load single property
      console.log('Loading property:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const properties = get().properties;
      const property = properties.find(p => p.id === id) || null;
      
      set({
        currentProperty: property,
        isLoading: false,
      });
      
      return property;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load property',
      });
      return null;
    }
  },

  createProperty: async (propertyData: PropertyForm) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to create property
      console.log('Creating property:', propertyData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProperty: Property = {
        id: `prop_${Date.now()}`,
        ...propertyData,
        country: 'Saudi Arabia', // Default country
        currency: 'SAR', // Default currency
        status: 'available',
        ownerId: 'current_user', // TODO: Get from auth store
        ownerName: 'Current User', // TODO: Get from auth store
        deedVerified: false, // TODO: Implement deed verification
        ownershipHistory: [],
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const properties = get().properties;
      set({
        properties: [...properties, newProperty],
        isLoading: false,
      });
      
      return newProperty;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create property',
      });
      throw error;
    }
  },

  updateProperty: async (id: string, updates: Partial<Property>) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to update property
      console.log('Updating property:', id, updates);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const properties = get().properties;
      const updatedProperties = properties.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      
      const currentProperty = get().currentProperty;
      set({
        properties: updatedProperties,
        currentProperty: currentProperty?.id === id 
          ? { ...currentProperty, ...updates, updatedAt: new Date().toISOString() }
          : currentProperty,
        isLoading: false,
      });
      
      return updatedProperties.find(p => p.id === id)!;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update property',
      });
      throw error;
    }
  },

  deleteProperty: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to delete property
      console.log('Deleting property:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const properties = get().properties;
      const filteredProperties = properties.filter(p => p.id !== id);
      
      set({
        properties: filteredProperties,
        currentProperty: get().currentProperty?.id === id ? null : get().currentProperty,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete property',
      });
    }
  },

  searchProperties: async (params: SearchParams) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call for property search
      console.log('Searching properties:', params);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let results = get().properties;
      
      // Apply filters
      if (params.filters) {
        results = results.filter(property => {
          if (params.filters!.minPrice && property.price < params.filters!.minPrice!) return false;
          if (params.filters!.maxPrice && property.price > params.filters!.maxPrice!) return false;
          if (params.filters!.minArea && property.area < params.filters!.minArea!) return false;
          if (params.filters!.maxArea && property.area > params.filters!.maxArea!) return false;
          if (params.filters!.bedrooms && property.bedrooms < params.filters!.bedrooms!) return false;
          if (params.filters!.bathrooms && property.bathrooms < params.filters!.bathrooms!) return false;
          if (params.filters!.propertyType && property.propertyType !== params.filters!.propertyType) return false;
          if (params.filters!.city && !property.city.toLowerCase().includes(params.filters!.city!.toLowerCase())) return false;
          if (params.filters!.deedVerified !== undefined && property.deedVerified !== params.filters!.deedVerified) return false;
          return true;
        });
      }
      
      // Apply search query
      if (params.query) {
        const query = params.query.toLowerCase();
        results = results.filter(property =>
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query)
        );
      }
      
      set({
        filteredProperties: results,
        isLoading: false,
      });
      
      return results;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      });
      return [];
    }
  },

  setFilters: (filters: PropertyFilters) => {
    set({ filters });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearFilters: () => {
    set({ filters: {}, searchQuery: '' });
  },

  getPropertiesByOwner: (ownerId: string) => {
    return get().properties.filter(p => p.ownerId === ownerId);
  },

  getVerifiedProperties: () => {
    return get().properties.filter(p => p.deedVerified);
  },

  clearError: () => {
    set({ error: null });
  },
}));
