import { useState } from 'react';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useSecurityStore } from '../stores/useSecurityStore';
import { createPseudoSignature } from '../utils/crypto';
import { isReadonlyMode } from '../utils/api';
import Notification from '../components/Notification';
import Badge from '../components/ui/Badge';

const BrokerPage = () => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const { addEvent } = useLedgerStore();
  const { evaluateImpersonation } = useSecurityStore();

  const mockBuyers = [
    { id: 'buyer_001', name: 'Sarah Al-Mansouri', email: 'sarah@example.com' },
    { id: 'buyer_002', name: 'Ahmed Al-Rashid', email: 'ahmed@example.com' },
    { id: 'buyer_003', name: 'Fatima Al-Zahra', email: 'fatima@example.com' }
  ];

  const mockSellers = [
    { id: 'seller_001', name: 'Khalid Al-Sabah', email: 'khalid@example.com' },
    { id: 'seller_002', name: 'Noura Al-Mutairi', email: 'noura@example.com' },
    { id: 'seller_003', name: 'Omar Al-Ghamdi', email: 'omar@example.com' }
  ];

  const mockProperties = [
    { id: 'prop_001', title: 'Luxury Villa - Riyadh', price: 2800000 },
    { id: 'prop_002', title: 'Modern Apartment - Jeddah', price: 1800000 },
    { id: 'prop_003', title: 'Townhouse - Dammam', price: 1200000 }
  ];

  const handleLinkBuyerSeller = async () => {
    if (!selectedBuyer || !selectedSeller || !selectedProperty) {
      setNotification({
        message: 'Please select buyer, seller, and property',
        type: 'error',
        isVisible: true
      });
      return;
    }

    setIsLinking(true);
    
    try {
      const buyer = mockBuyers.find(b => b.id === selectedBuyer);
      const seller = mockSellers.find(s => s.id === selectedSeller);
      const property = mockProperties.find(p => p.id === selectedProperty);

      await addEvent('buyer_broker_linked', 'broker_001', 'Current Broker', {
        buyerId: selectedBuyer,
        sellerId: selectedSeller,
        propertyId: selectedProperty,
        buyerName: buyer?.name,
        sellerName: seller?.name,
        propertyTitle: property?.title,
        linkedAt: new Date().toISOString()
      });

      setNotification({
        message: 'Buyer and Seller successfully linked! 🔗',
        type: 'success',
        isVisible: true
      });

      setShowLinkModal(false);
      setSelectedBuyer('');
      setSelectedSeller('');
      setSelectedProperty('');
    } catch (error) {
      console.error('Failed to link buyer and seller:', error);
      setNotification({
        message: 'Failed to link buyer and seller. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleTestImpersonation = async () => {
    const testUser = {
      id: 'test_user_001',
      email: 'sarah@example.com', // This will trigger duplicate email rule
      name: 'Test User',
      phone: '+966501234567', // This will trigger duplicate phone rule
      role: 'broker' as const,
      digitalId: {
        id: 'digital_001', // This will trigger duplicate DigitalID rule
        userId: 'test_user_001',
        verified: true,
        verificationMethod: 'NAFTA_SIM' as const,
        issuedAt: new Date().toISOString(),
        riskScore: 25
      },
      createdAt: new Date().toISOString(),
      isActive: true
    };

    try {
      const riskFlags = await evaluateImpersonation(testUser, { page: 'broker' });
      
      setNotification({
        message: `Impersonation evaluation completed. Found ${riskFlags.length} risk flag(s).`,
        type: riskFlags.length > 0 ? 'error' : 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to evaluate impersonation:', error);
      setNotification({
        message: 'Failed to evaluate impersonation. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleCompleteTransaction = async (connectionId: string, buyerId: string, sellerId: string, propertyId: string, amount: number) => {
    try {
      const transactionPayload = {
        connectionId,
        buyerId,
        sellerId,
        propertyId,
        amount,
        completedAt: new Date().toISOString(),
        brokerId: 'broker_001'
      };

      const signature = createPseudoSignature(transactionPayload);

      await addEvent('transfer_completed', 'broker_001', 'Current Broker', {
        ...transactionPayload,
        signature,
        transactionHash: `tx_${Date.now()}`,
        status: 'completed'
      });

      setNotification({
        message: 'Transaction completed successfully! 🎉',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to complete transaction:', error);
      setNotification({
        message: 'Failed to complete transaction. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Broker Dashboard</h1>
          <p className="text-gray-600">Connect buyers and sellers in the Wasatah network</p>
        </div>
        <div className="flex space-x-3">
          {!isReadonlyMode() && (
            <button
              onClick={handleTestImpersonation}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <span>🛡️</span>
              <span>Test Security</span>
            </button>
          )}
          {!isReadonlyMode() && (
            <button
              onClick={() => setShowLinkModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <span>🔗</span>
              <span>Link Buyer & Seller</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Connections */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Active Connections</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Luxury Villa - Riyadh</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Active</Badge>
                  <Badge variant="primary">🔐 ZKP Verified</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Seller: Ahmed Al-Rashid</p>
                <p>Buyer: Sarah Al-Mansouri</p>
                <p>Offer: SAR 2,500,000</p>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700">
                  Facilitate Meeting
                </button>
                {!isReadonlyMode() && (
                  <button 
                    onClick={() => handleCompleteTransaction('conn_001', 'buyer_001', 'seller_001', 'prop_001', 2500000)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                  >
                    Complete Transaction
                  </button>
                )}
              </div>
            </div>
            
            {/* Success state example */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-800">Modern Apartment - Jeddah</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Linked Successfully</Badge>
                  <Badge variant="primary">🔐 ZKP Verified</Badge>
                </div>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>Seller: Noura Al-Mutairi</p>
                <p>Buyer: Fatima Al-Zahra</p>
                <p>Property: Modern Apartment - Jeddah</p>
                <p className="text-xs text-green-600 mt-2">✅ buyer_broker_linked event created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Properties</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Modern Apartment - Jeddah</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Price: SAR 1,800,000</p>
                <p>Status: Available</p>
                <p>Seller: Fatima Al-Zahra</p>
              </div>
              <div className="mt-3">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200">
                  Connect Buyers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Broker Statistics</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">12</div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Completed Deals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">SAR 45M</div>
            <div className="text-sm text-gray-600">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
        </div>
      </div>

      {/* Link Buyer & Seller Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Link Buyer & Seller</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Buyer
                </label>
                <select
                  value={selectedBuyer}
                  onChange={(e) => setSelectedBuyer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a buyer...</option>
                  {mockBuyers.map((buyer) => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name} ({buyer.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seller
                </label>
                <select
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a seller...</option>
                  {mockSellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name} ({seller.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a property...</option>
                  {mockProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} - SAR {property.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isLinking}
              >
                Cancel
              </button>
              <button
                onClick={handleLinkBuyerSeller}
                disabled={isLinking || !selectedBuyer || !selectedSeller || !selectedProperty}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLinking ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Linking...</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Link & Create Event</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default BrokerPage;
