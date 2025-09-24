import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginForm, DigitalID } from '../types/models';
import { apiClient } from '../utils/api';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setUser: (user: User) => void;
  verifyIdentity: (userId: string) => Promise<DigitalID>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.login(credentials.email, credentials.password);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.register(userData);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.error || 'Registration failed');
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      verifyIdentity: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Implement actual identity verification with NAFTA_SIM
          console.log('Verifying identity for user:', userId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock digital ID
          const digitalId: DigitalID = {
            id: 'digital_id_001',
            userId,
            verified: true,
            verificationMethod: 'NAFTA_SIM',
            issuedAt: new Date().toISOString(),
            riskScore: 15, // Low risk
            zkpProof: 'zkp_proof_12345', // Simulated ZKP proof
          };
          
          // Update user with digital ID
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, digitalId },
              isLoading: false,
            });
          }
          
          return digitalId;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Identity verification failed',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
