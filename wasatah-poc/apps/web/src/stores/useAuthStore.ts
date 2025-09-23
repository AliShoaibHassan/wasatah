import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginForm, DigitalID } from '../types/models';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginForm) => Promise<void>;
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
          // TODO: Implement actual login logic with API
          console.log('Login attempt:', credentials);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For demo purposes, just set a basic user structure
          // The actual user data will be set by the login page
          const mockUser: User = {
            id: 'temp_user',
            email: credentials.email,
            name: 'Loading...',
            phone: '+966501234567',
            role: 'buyer', // Default role, will be changed in role selection
            createdAt: new Date().toISOString(),
            isActive: true,
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
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
