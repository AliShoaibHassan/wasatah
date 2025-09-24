import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { useAuthStore } from '../stores/useAuthStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useRoleStore } from '../stores/useRoleStore';
import shortid from 'shortid';

const SimpleLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'broker'>('buyer');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const navigate = useNavigate();
  const { login, register, setUser } = useAuthStore();
  const { addEvent } = useLedgerStore();
  const { selectRole } = useRoleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle login
        await login({ email, password });
        
        // Add login event to ledger
        try {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            await addEvent('USER_LOGIN', currentUser.id, currentUser.name, {
              email: currentUser.email,
              role: currentUser.role
            });
          }
        } catch (error) {
          console.warn('Failed to add login event to ledger:', error);
        }
      } else {
        // Handle signup
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (!agreeToTerms) {
          throw new Error('You must agree to the terms and conditions');
        }

        // Register user via API
        await register({
          name,
          email,
          phone,
          password,
          role
        });

        // Add signup event to ledger
        try {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            await addEvent('USER_SIGNUP', currentUser.id, currentUser.name, {
              email: currentUser.email,
              role: currentUser.role,
              digitalId: currentUser.digitalId?.id
            });
          }
        } catch (error) {
          console.warn('Failed to add signup event to ledger:', error);
        }
      }

      // Navigate to role selection
      navigate('/role');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'buyer', title: 'Buyer', icon: '🏠', description: 'Looking to purchase properties' },
    { id: 'seller', title: 'Seller', icon: '💰', description: 'Looking to sell properties' },
    { id: 'broker', title: 'Broker', icon: '🤝', description: 'Facilitate real estate transactions' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
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

        {/* Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <Card className="shadow-xl">
          <CardBody className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required={!isLogin}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+966501234567"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to be a:
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {roles.map((roleOption) => (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => setRole(roleOption.id as any)}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          role === roleOption.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{roleOption.icon}</div>
                        <div className="font-medium text-sm">{roleOption.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    required
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-3 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Demo Info */}
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

export default SimpleLoginPage;
