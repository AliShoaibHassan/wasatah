import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { useAuthStore } from '../stores/useAuthStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useRoleStore } from '../stores/useRoleStore';
import shortid from 'shortid';

type AuthMode = 'login' | 'signup' | 'role-selection';

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller' | 'broker';
  agreeToTerms: boolean;
}

interface LoginForm {
  email: string;
  password: string;
}

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    agreeToTerms: false
  });
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'broker' | null>(null);

  const navigate = useNavigate();
  const { login, register, setUser, isAuthenticated } = useAuthStore();
  const { addEvent } = useLedgerStore();
  const { selectRole } = useRoleStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (signupForm.password !== signupForm.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (signupForm.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (!signupForm.agreeToTerms) {
        throw new Error('You must agree to the terms and conditions');
      }

      // Create user object
      const newUser = {
        id: 'user_' + shortid(),
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        role: signupForm.role,
        createdAt: new Date().toISOString(),
        isActive: true,
        digitalId: {
          id: 'DID-' + shortid(),
          userId: 'user_' + shortid(),
          verified: true,
          verificationMethod: 'NAFTA_SIM' as const,
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          zkpProof: 'zkp_proof_' + shortid(),
          riskScore: Math.floor(Math.random() * 20) + 5,
        }
      };

      // Register user via API
      await register({
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        password: signupForm.password,
        role: signupForm.role
      });

      // Add signup event to ledger
      try {
        await addEvent('USER_SIGNUP', newUser.id, newUser.name, {
          email: newUser.email,
          role: newUser.role,
          digitalId: newUser.digitalId.id,
          verificationMethod: 'NAFTA_SIM'
        });
      } catch (error) {
        console.warn('Failed to add signup event to ledger:', error);
      }

      // Move to role selection
      setMode('role-selection');
      setSelectedRole(signupForm.role);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Login via API
      await login(loginForm);

      // Add login event to ledger
      try {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          await addEvent('USER_LOGIN', currentUser.id, currentUser.name, {
            email: currentUser.email,
            role: currentUser.role,
            digitalId: currentUser.digitalId?.id
          });
        }
      } catch (error) {
        console.warn('Failed to add login event to ledger:', error);
      }

      // Move to role selection
      setMode('role-selection');
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setSelectedRole(currentUser.role as 'buyer' | 'seller' | 'broker');
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = (role: 'buyer' | 'seller' | 'broker') => {
    setSelectedRole(role);
    selectRole(role);
    
    // Navigate based on role
    switch (role) {
      case 'buyer':
        navigate('/buyer');
        break;
      case 'seller':
        navigate('/seller');
        break;
      case 'broker':
        navigate('/broker');
        break;
    }
  };

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Looking to purchase properties',
      icon: '🏠',
      features: ['Browse properties', 'Make offers', 'Track transactions']
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'Looking to sell properties',
      icon: '💰',
      features: ['List properties', 'Manage offers', 'Track sales']
    },
    {
      id: 'broker',
      title: 'Broker',
      description: 'Facilitate real estate transactions',
      icon: '🤝',
      features: ['Manage clients', 'Facilitate deals', 'Earn commissions']
    }
  ];

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

        {/* Mode Toggle */}
        {mode !== 'role-selection' && (
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('login')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'signup'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

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

        {/* Login Form */}
        {mode === 'login' && (
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Sign In to Your Account
              </h3>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your password"
                  />
                </div>

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
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Signup Form */}
        {mode === 'signup' && (
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Create Your Account
              </h3>
              
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      required
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+966501234567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Create a password"
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      required
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to be a:
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSignupForm({ ...signupForm, role: role.id as any })}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          signupForm.role === role.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{role.icon}</div>
                        <div className="font-medium text-sm">{role.title}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    required
                    checked={signupForm.agreeToTerms}
                    onChange={(e) => setSignupForm({ ...signupForm, agreeToTerms: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>

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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Role Selection */}
        {mode === 'role-selection' && (
          <Card className="shadow-xl">
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose Your Role
                </h3>
                <p className="text-gray-600">
                  Select how you'd like to use the platform
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                      selectedRole === role.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                    onClick={() => handleRoleSelection(role.id as any)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{role.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{role.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                      
                      <ul className="text-xs text-gray-500 space-y-1">
                        {role.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => selectedRole && handleRoleSelection(selectedRole)}
                  disabled={!selectedRole}
                  className="btn btn-primary px-8 py-3"
                >
                  Continue as {selectedRole?.charAt(0).toUpperCase() + selectedRole?.slice(1)}
                </button>
              </div>
            </CardBody>
          </Card>
        )}

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

export default AuthPage;
