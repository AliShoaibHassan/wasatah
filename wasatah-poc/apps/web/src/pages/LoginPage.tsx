import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { useAuthStore } from '../stores/useAuthStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import shortid from 'shortid';
import usersData from '../data/users.json';

const LoginPage = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setUser } = useAuthStore();
  const { addEvent } = useLedgerStore();

  const handleUserLogin = async (userId: string) => {
    setIsLoading(true);
    
    try {
      const userData = usersData.find(u => u.id === userId);
      if (!userData) {
        throw new Error('User not found');
      }

      // Create or update DigitalID if absent
      let digitalId = userData.digitalId;
      if (!digitalId) {
        digitalId = {
          id: 'DID-' + shortid(),
          userId: userData.id,
          verified: true,
          verificationMethod: 'NAFTA_SIM' as const,
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          zkpProof: 'zkp_proof_' + shortid(),
          riskScore: Math.floor(Math.random() * 20) + 5, // Random risk score 5-25
        };
      }

      // Update user with DigitalID
      const updatedUser = { 
        ...userData, 
        digitalId: {
          ...digitalId,
          verificationMethod: digitalId.verificationMethod as 'NAFTA_SIM' | 'KYC' | 'BIOMETRIC'
        }, 
        role: userData.role as 'buyer' | 'seller' | 'broker' 
      };
      
      // Login with the user data
      await login({ email: userData.email, password: 'demo' });
      
      // Set the complete user data in the store
      setUser(updatedUser);
      
      // Add ZKP check event to ledger
      try {
        await addEvent('zkp_check', userData.id, userData.name, {
          method: 'ZK_SIM',
          result: 'pass',
          digitalId: digitalId.id,
          verificationMethod: 'NAFTA_SIM'
        });
      } catch (error) {
        console.warn('Failed to add ZKP event to ledger:', error);
      }
      
      navigate('/role');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏠</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Wasatah
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Blockchain + AI Real Estate Platform
          </p>
        </div>

        {/* User Selection */}
        <Card className="shadow-xl">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a Demo User
              </h3>
              <p className="text-gray-600">
                Choose a user to experience the platform with pre-configured data
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {usersData.map((user) => (
                <div
                  key={user.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                    selectedUser === user.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{user.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                    <p className="text-xs text-gray-500 mb-4">Role: {user.role}</p>
                    
                    {/* Digital ID Status */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ NAFTA Verified (Simulated)
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🔐 ZKP Verified (Simulated)
                        </span>
                      </div>
                    </div>
                    
                    {user.digitalId && (
                      <div className="mt-3 text-xs text-gray-500">
                        <div>Digital ID: {user.digitalId.id}</div>
                        <div>Risk Score: {user.digitalId.riskScore}/100</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Login Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => selectedUser && handleUserLogin(selectedUser)}
                disabled={!selectedUser || isLoading}
                className="btn btn-primary px-8 py-3 flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              {!selectedUser && (
                <p className="mt-2 text-sm text-gray-500">
                  Please select a user to continue
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Info */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">🔍 About the Demo</h4>
            <p className="text-sm text-blue-800">
              This demo simulates NAFTA verification and Zero-Knowledge Proofs (ZKP) for identity verification. 
              No real cryptography is used - this is for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
