import { Link, useLocation } from 'react-router-dom';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useAuthStore } from '../stores/useAuthStore';
import { isReadonlyMode } from '../utils/api';

const TopBar = () => {
  const { resetLedger } = useLedgerStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const handleReset = async () => {
    try {
      await resetLedger();
      console.log('Demo data reset successfully');
    } catch (error) {
      console.error('Failed to reset demo data:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center">
              <span className="mr-2">🏠</span>
              Wasatah.app
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/signup')
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/role"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/role') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/buyer"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/buyer') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Buyer
                </Link>
                <Link
                  to="/seller"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/seller') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Seller
                </Link>
                <Link
                  to="/broker"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/broker') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Broker
                </Link>
                <Link
                  to="/explorer"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/explorer') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Explorer
                </Link>
                <Link
                  to="/about-zk"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about-zk') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  About ZK
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                >
                  Logout
                </button>
              </div>
            )}
            {!isReadonlyMode() && isAuthenticated && (
              <button
                onClick={handleReset}
                className="btn btn-secondary btn-sm"
              >
                🔄 Reset Demo
              </button>
            )}
            {isReadonlyMode() && (
              <div className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                📖 Read-Only Mode
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex items-center justify-around py-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  🔐 Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/signup')
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  ✨ Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/role"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/role') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/buyer"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/buyer') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  👤 Buyer
                </Link>
                <Link
                  to="/seller"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/seller') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  🏘️ Seller
                </Link>
                <Link
                  to="/broker"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/broker') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  🤝 Broker
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
