import { create } from 'zustand';
import type { RiskFlag, User, DigitalID } from '../types/models';

interface SecurityState {
  // State
  riskFlags: RiskFlag[];
  activeRiskFlags: RiskFlag[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadRiskFlags: () => Promise<void>;
  checkImpersonationRisk: (user: User) => Promise<RiskFlag[]>;
  evaluateImpersonation: (user: User, context: any) => Promise<RiskFlag[]>;
  assessIdentityRisk: (digitalId: DigitalID) => Promise<number>;
  createRiskFlag: (userId: string, type: RiskFlag['type'], severity: RiskFlag['severity'], description: string, metadata?: Record<string, any>) => Promise<RiskFlag>;
  resolveRiskFlag: (flagId: string) => Promise<void>;
  getRiskFlagsByUser: (userId: string) => RiskFlag[];
  getActiveRiskFlags: () => RiskFlag[];
  getCriticalRiskFlags: () => RiskFlag[];
  clearError: () => void;
}

export const useSecurityStore = create<SecurityState>((set, get) => ({
  // Initial state
  riskFlags: [],
  activeRiskFlags: [],
  isLoading: false,
  error: null,

  // Actions
  loadRiskFlags: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to load risk flags
      console.log('Loading risk flags...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock risk flags data
      const mockRiskFlags: RiskFlag[] = [
        {
          id: 'risk_001',
          userId: 'user_005',
          type: 'impersonation',
          severity: 'high',
          description: 'Potential identity impersonation detected - similar email pattern found',
          detectedAt: '2024-09-22T12:00:00Z',
          isActive: true,
          metadata: {
            emailPattern: 'test*@example.com',
            similarAccounts: ['user_006', 'user_007'],
            confidence: 0.85,
          },
        },
        {
          id: 'risk_002',
          userId: 'user_008',
          type: 'duplicate_identity',
          severity: 'medium',
          description: 'Duplicate phone number detected across multiple accounts',
          detectedAt: '2024-09-21T15:30:00Z',
          isActive: true,
          metadata: {
            phoneNumber: '+966501234567',
            duplicateAccounts: ['user_009'],
            confidence: 0.72,
          },
        },
      ];
      
      const activeFlags = mockRiskFlags.filter(flag => flag.isActive);
      
      set({
        riskFlags: mockRiskFlags,
        activeRiskFlags: activeFlags,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load risk flags',
      });
    }
  },

  checkImpersonationRisk: async (user: User) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement actual impersonation detection logic
      console.log('Checking impersonation risk for user:', user);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const riskFlags: RiskFlag[] = [];
      
      // Simulate risk detection logic
      if (user.email.includes('test') || user.email.includes('demo')) {
        const riskFlag: RiskFlag = {
          id: `risk_${Date.now()}`,
          userId: user.id,
          type: 'impersonation',
          severity: 'high',
          description: 'Test/demo email pattern detected - potential impersonation risk',
          detectedAt: new Date().toISOString(),
          isActive: true,
          metadata: {
            emailPattern: user.email,
            riskType: 'test_email',
            confidence: 0.9,
          },
        };
        riskFlags.push(riskFlag);
      }
      
      if (user.phone && user.phone.includes('123456')) {
        const riskFlag: RiskFlag = {
          id: `risk_${Date.now() + 1}`,
          userId: user.id,
          type: 'duplicate_identity',
          severity: 'medium',
          description: 'Suspicious phone number pattern detected',
          detectedAt: new Date().toISOString(),
          isActive: true,
          metadata: {
            phonePattern: user.phone,
            riskType: 'suspicious_phone',
            confidence: 0.7,
          },
        };
        riskFlags.push(riskFlag);
      }
      
      // Add new risk flags to store
      if (riskFlags.length > 0) {
        const currentFlags = get().riskFlags;
        const newFlags = [...currentFlags, ...riskFlags];
        const activeFlags = newFlags.filter(flag => flag.isActive);
        
        set({
          riskFlags: newFlags,
          activeRiskFlags: activeFlags,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
      
      return riskFlags;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check impersonation risk',
      });
      return [];
    }
  },

  evaluateImpersonation: async (user: User, context: any) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Evaluating impersonation for user:', user, 'context:', context);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const riskFlags: RiskFlag[] = [];
      
      // Rule 1: Duplicate email/phone across accounts
      const existingUsers = [
        { id: 'user_001', email: 'sarah@example.com', phone: '+966501234567' },
        { id: 'user_002', email: 'ahmed@example.com', phone: '+966501234568' },
        { id: 'user_003', email: 'fatima@example.com', phone: '+966501234569' }
      ];
      
      const duplicateEmail = existingUsers.find(u => u.email === user.email && u.id !== user.id);
      const duplicatePhone = user.phone && existingUsers.find(u => u.phone === user.phone && u.id !== user.id);
      
      if (duplicateEmail) {
        const riskFlag: RiskFlag = {
          id: `risk_${Date.now()}`,
          userId: user.id,
          type: 'impersonation',
          severity: 'high',
          description: 'Duplicate email address detected across multiple accounts',
          detectedAt: new Date().toISOString(),
          isActive: true,
          metadata: {
            email: user.email,
            duplicateAccountId: duplicateEmail.id,
            rule: 'duplicate_email',
            confidence: 0.95,
          },
        };
        riskFlags.push(riskFlag);
      }
      
      if (duplicatePhone) {
        const riskFlag: RiskFlag = {
          id: `risk_${Date.now() + 1}`,
          userId: user.id,
          type: 'impersonation',
          severity: 'high',
          description: 'Duplicate phone number detected across multiple accounts',
          detectedAt: new Date().toISOString(),
          isActive: true,
          metadata: {
            phone: user.phone,
            duplicateAccountId: duplicatePhone.id,
            rule: 'duplicate_phone',
            confidence: 0.9,
          },
        };
        riskFlags.push(riskFlag);
      }
      
      // Rule 2: Same DigitalID used across different accounts/roles
      if (user.digitalId) {
        const existingDigitalIds = [
          { id: 'digital_001', userId: 'user_001', role: 'buyer' },
          { id: 'digital_002', userId: 'user_002', role: 'seller' },
          { id: 'digital_003', userId: 'user_003', role: 'broker' }
        ];
        
        const duplicateDigitalId = existingDigitalIds.find(d => 
          d.id === user.digitalId?.id && d.userId !== user.id && d.role !== user.role
        );
        
        if (duplicateDigitalId) {
          const riskFlag: RiskFlag = {
            id: `risk_${Date.now() + 2}`,
            userId: user.id,
            type: 'impersonation',
            severity: 'critical',
            description: 'Same DigitalID used across different accounts with different roles',
            detectedAt: new Date().toISOString(),
            isActive: true,
            metadata: {
              digitalId: user.digitalId.id,
              duplicateAccountId: duplicateDigitalId.userId,
              duplicateRole: duplicateDigitalId.role,
              currentRole: user.role,
              rule: 'duplicate_digital_id',
              confidence: 0.98,
            },
          };
          riskFlags.push(riskFlag);
        }
      }
      
      // Rule 3: Velocity from localStorage fingerprint (N accounts in T minutes)
      const fingerprint = localStorage.getItem('user_fingerprint') || 'default_fingerprint';
      const accountCreationTimes = JSON.parse(localStorage.getItem('account_creation_times') || '[]');
      const now = Date.now();
      const timeWindow = 30 * 60 * 1000; // 30 minutes
      const maxAccounts = 3;
      
      const recentAccounts = accountCreationTimes.filter((time: number) => now - time < timeWindow);
      
      if (recentAccounts.length >= maxAccounts) {
        const riskFlag: RiskFlag = {
          id: `risk_${Date.now() + 3}`,
          userId: user.id,
          type: 'impersonation',
          severity: 'high',
          description: `High velocity account creation detected: ${recentAccounts.length} accounts in ${timeWindow / 60000} minutes`,
          detectedAt: new Date().toISOString(),
          isActive: true,
          metadata: {
            fingerprint,
            accountCount: recentAccounts.length,
            timeWindow: timeWindow / 60000,
            rule: 'velocity_check',
            confidence: 0.85,
          },
        };
        riskFlags.push(riskFlag);
      }
      
      // Add new risk flags to store
      if (riskFlags.length > 0) {
        const currentFlags = get().riskFlags;
        const newFlags = [...currentFlags, ...riskFlags];
        const activeFlags = newFlags.filter(flag => flag.isActive);
        
        set({
          riskFlags: newFlags,
          activeRiskFlags: activeFlags,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
      
      return riskFlags;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to evaluate impersonation',
      });
      return [];
    }
  },

  assessIdentityRisk: async (digitalId: DigitalID) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement actual identity risk assessment
      console.log('Assessing identity risk for digital ID:', digitalId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let riskScore = digitalId.riskScore || 0;
      
      // Simulate risk assessment logic
      if (digitalId.verificationMethod === 'NAFTA_SIM') {
        riskScore += 10; // NAFTA_SIM adds some risk
      }
      
      if (digitalId.zkpProof) {
        riskScore -= 5; // ZKP proof reduces risk
      }
      
      // Ensure risk score is within bounds
      riskScore = Math.max(0, Math.min(100, riskScore));
      
      set({ isLoading: false });
      
      return riskScore;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to assess identity risk',
      });
      return 50; // Default risk score
    }
  },

  createRiskFlag: async (userId: string, type: RiskFlag['type'], severity: RiskFlag['severity'], description: string, metadata?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to create risk flag
      console.log('Creating risk flag:', userId, type, severity, description, metadata);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRiskFlag: RiskFlag = {
        id: `risk_${Date.now()}`,
        userId,
        type,
        severity,
        description,
        detectedAt: new Date().toISOString(),
        isActive: true,
        metadata: metadata || {},
      };
      
      const riskFlags = get().riskFlags;
      const newFlags = [...riskFlags, newRiskFlag];
      const activeFlags = newFlags.filter(flag => flag.isActive);
      
      set({
        riskFlags: newFlags,
        activeRiskFlags: activeFlags,
        isLoading: false,
      });
      
      return newRiskFlag;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create risk flag',
      });
      throw error;
    }
  },

  resolveRiskFlag: async (flagId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to resolve risk flag
      console.log('Resolving risk flag:', flagId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const riskFlags = get().riskFlags;
      const updatedFlags = riskFlags.map(flag =>
        flag.id === flagId
          ? { ...flag, isActive: false, resolvedAt: new Date().toISOString() }
          : flag
      );
      
      const activeFlags = updatedFlags.filter(flag => flag.isActive);
      
      set({
        riskFlags: updatedFlags,
        activeRiskFlags: activeFlags,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to resolve risk flag',
      });
    }
  },

  getRiskFlagsByUser: (userId: string) => {
    return get().riskFlags.filter(flag => flag.userId === userId);
  },

  getActiveRiskFlags: () => {
    return get().activeRiskFlags;
  },

  getCriticalRiskFlags: () => {
    return get().activeRiskFlags.filter(flag => flag.severity === 'critical' || flag.severity === 'high');
  },

  clearError: () => {
    set({ error: null });
  },
}));
