import { useState, useEffect } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import propertyData from '../data/property.json';
import { useRoleStore } from '../stores/useRoleStore';
import { useOfferStore } from '../stores/useOfferStore';
import { usePropertyStore } from '../stores/usePropertyStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { createPseudoSignature } from '../utils/crypto';
import { isReadonlyMode } from '../utils/api';
import PropertyEditModal from '../components/PropertyEditModal';
import Notification from '../components/Notification';

const SellerPage = () => {
  const navigate = useNavigate();
  const { } = useRoleStore();
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });
  
  const { 
    updateOfferStatus, 
    getOffersByProperty, 
    loadOffers, 
    isLoading: offersLoading 
  } = useOfferStore();
  
  const { 
    loadProperty
  } = usePropertyStore();

  const { addEvent } = useLedgerStore();
  
  // Get the featured property from the seed data
  const property = propertyData[0] as any;

  // Load offers and property on component mount
  useEffect(() => {
    loadOffers();
    loadProperty(property.id);
  }, [loadOffers, loadProperty, property.id]);

  // Get offers for this property
  const propertyOffers = getOffersByProperty(property.id);

  // Use the ownership history from the property data
  const ownershipHistory = property.ownershipHistory;

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      await updateOfferStatus(offerId, status);
      setNotification({
        message: `Offer ${action}ed successfully!`,
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error(`Failed to ${action} offer:`, error);
      setNotification({
        message: `Failed to ${action} offer. Please try again.`,
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleEditProperty = () => {
    setIsEditing(true);
  };

  const handleCompleteTransaction = async (offerId: string, buyerId: string, amount: number) => {
    try {
      const transactionPayload = {
        offerId,
        buyerId,
        sellerId: property.ownerId,
        propertyId: property.id,
        amount,
        completedAt: new Date().toISOString(),
        sellerName: property.ownerName
      };

      const signature = createPseudoSignature(transactionPayload);

      await addEvent('transfer_completed', property.ownerId, property.ownerName, {
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your property listings and track offers</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="success" className="text-sm">
              ✅ Deed Verified
            </Badge>
            <button 
              onClick={() => navigate('/explorer')}
              className="btn btn-secondary"
            >
              🔍 Open Explorer
            </button>
            <button 
              onClick={handleEditProperty}
              className="btn btn-primary"
            >
              📝 Edit Property
            </button>
          </div>
        </div>
      </div>

      {/* Role Checklist */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">🏘️ Seller Role Capabilities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  List and manage property listings
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Review and respond to offers
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Track ownership history and deed verification
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Access blockchain property records
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Manage transaction documentation
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  View property analytics and insights
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
                  <p className="text-gray-600 mb-4">{property.address}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>🏠 {property.area} sqm</span>
                    <span>🛏️ {property.bedrooms} beds</span>
                    <span>🚿 {property.bathrooms} baths</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {property.currency} {property.price.toLocaleString()}
                  </div>
                  <Badge variant="success" className="mt-2">
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Property Images */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {property.images.map((_: any, index: number) => (
                  <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">🏠 Image {index + 1}</span>
                  </div>
                ))}
              </div>

              {/* Ownership History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Ownership History</h3>
                <div className="space-y-3">
                  {ownershipHistory.map((owner: any, index: number) => {
                    const fromDate = new Date(owner.fromDate).toLocaleDateString();
                    const toDate = owner.toDate ? new Date(owner.toDate).toLocaleDateString() : 'Present';
                    const isCurrentOwner = !owner.toDate;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-semibold">
                              {owner.ownerName.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{owner.ownerName}</div>
                            <div className="text-sm text-gray-500">{fromDate} - {toDate}</div>
                            <div className="text-xs text-gray-400 capitalize">{owner.transferType}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={owner.deedVerified ? 'success' : 'warning'}>
                            {owner.deedVerified ? '✅ Deed Verified' : '⏳ Pending'}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            {isCurrentOwner ? 'Current Owner' : 'Previous Owner'}
                          </div>
                          {owner.verificationAuthority && (
                            <div className="text-xs text-gray-400 mt-1">
                              {owner.verificationAuthority}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Offers Sidebar */}
        <div>
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Offers</h2>
                <Badge variant="primary">{propertyOffers.length} Total</Badge>
              </div>
              
              <div className="space-y-4">
                {propertyOffers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-lg font-bold text-primary-600">
                        {new Intl.NumberFormat('en-SA', {
                          style: 'currency',
                          currency: 'SAR',
                          minimumFractionDigits: 0
                        }).format(offer.amount)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(offer.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="font-medium text-gray-900">{offer.buyerName}</div>
                      <div className="text-sm text-gray-500">Buyer ID: {offer.buyerId}</div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{offer.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={offer.status === 'pending' ? 'warning' : offer.status === 'accepted' ? 'success' : 'danger'}
                      >
                        {offer.status === 'pending' ? '⏳ Pending' : 
                         offer.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                      </Badge>
                      
                      {offer.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleOfferAction(offer.id, 'accept')}
                            className="btn btn-success btn-sm"
                            disabled={offersLoading}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleOfferAction(offer.id, 'decline')}
                            className="btn btn-danger btn-sm"
                            disabled={offersLoading}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      
                      {offer.status === 'accepted' && !isReadonlyMode() && (
                        <button 
                          onClick={() => handleCompleteTransaction(offer.id, offer.buyerId, offer.amount)}
                          className="btn btn-primary btn-sm"
                        >
                          Complete Transaction
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Property Edit Modal */}
      <PropertyEditModal
        property={property}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />

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

export default SellerPage;
