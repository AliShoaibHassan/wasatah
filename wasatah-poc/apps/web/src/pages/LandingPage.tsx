import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mx-auto h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center mb-8">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Wasatah
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The future of real estate transactions powered by blockchain technology, 
            AI, and Zero-Knowledge Proofs for secure, transparent property deals.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn btn-primary btn-lg px-8 py-4 text-lg"
            >
              🔐 Sign In
            </Link>
            <Link
              to="/signup"
              className="btn btn-secondary btn-lg px-8 py-4 text-lg"
            >
              ✨ Create Account
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-4">Secure Authentication</h3>
              <p className="text-gray-600">
                NAFTA-verified identity with Zero-Knowledge Proofs for maximum security and privacy.
              </p>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-semibold mb-4">Smart Property Listings</h3>
              <p className="text-gray-600">
                AI-powered property recommendations and blockchain-verified ownership records.
              </p>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-4">Transparent Transactions</h3>
              <p className="text-gray-600">
                Immutable ledger records of all transactions with smart contract automation.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Role Selection Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Role</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Buyer</h3>
              <p className="text-gray-600 mb-4">Looking to purchase properties</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Browse verified properties</li>
                <li>• Make secure offers</li>
                <li>• Track transaction progress</li>
              </ul>
            </div>

            <div className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Seller</h3>
              <p className="text-gray-600 mb-4">Looking to sell properties</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• List properties securely</li>
                <li>• Manage offers</li>
                <li>• Track sales analytics</li>
              </ul>
            </div>

            <div className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Broker</h3>
              <p className="text-gray-600 mb-4">Facilitate real estate deals</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Manage client portfolios</li>
                <li>• Facilitate negotiations</li>
                <li>• Earn commission rewards</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">🔍 About This Demo</h3>
            <p className="text-blue-800 mb-4">
              This is a proof-of-concept demonstration of blockchain-powered real estate transactions. 
              The system simulates NAFTA verification and Zero-Knowledge Proofs for identity verification.
            </p>
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> No real cryptography is used - this is for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
