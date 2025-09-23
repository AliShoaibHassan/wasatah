import { useState, useEffect } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useOfferStore } from '../stores/useOfferStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import Notification from '../components/Notification';

const BuyerPage = () => {
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    createOffer, 
    updateOfferStatus,
    getOffersByBuyer, 
    loadOffers
  } = useOfferStore();

  const { addEvent } = useLedgerStore();

  const property = {
    id: 'prop_001',
    title: 'Luxury Villa in Al-Nakheel District',
    address: '123 Al-Nakheel St, Riyadh',
    price: 2800000,
    area: '450 sqm',
    bedrooms: 5,
    bathrooms: 6,
    yearBuilt: 2018,
    features: ['Swimming Pool', 'Private Garden', 'Smart Home System', '2-Car Garage'],
    images: ['/images/villa1.jpg', '/images/villa2.jpg', '/images/villa3.jpg'],
    deedVerified: true,
    zkpVerified: true,
    riskScore: 15
  };

  // Load offers on component mount
  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Get current user's offers (using current_user as buyerId for now)
  const myOffers = getOffersByBuyer('current_user');

  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const offerData = {
        propertyId: property.id,
        amount: parseInt(offerAmount),
        message: offerMessage,
        conditions: []
      };
      
      const newOffer = await createOffer(offerData);
      
      // Update offer status to "locked" after creation
      await updateOfferStatus(newOffer.id, 'locked');
      
      // Add ledger event for offer_made
      await addEvent('offer_made', 'current_user', 'Current User', {
        offerId: newOffer.id,
        propertyId: property.id,
        amount: parseInt(offerAmount),
        message: offerMessage,
        status: 'locked',
        submittedAt: newOffer.submittedAt
      });
      
      // Reset form
      setOfferAmount('');
      setOfferMessage('');
      
      // Show success message with locked status
      setNotification({
        message: 'Offer submitted and locked successfully! 🔒',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to submit offer:', error);
      setNotification({
        message: 'Failed to submit offer. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
        <p className="text-gray-600">Browse verified properties and make offers</p>
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
                  
                  {/* Verification Badges */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant="success">
                      ✅ Deed Verified
                    </Badge>
                    <Badge variant="primary">
                      🔐 ZKP Verified
                    </Badge>
                    <Badge variant="success">
                      🛡️ Low Risk ({property.riskScore}%)
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatCurrency(property.price)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Asking Price</div>
                </div>
              </div>

              {/* Property Images */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {property.images.map((_, index) => (
                  <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">🏠 Image {index + 1}</span>
                  </div>
                ))}
              </div>

              {/* Property Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{property.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">{property.yearBuilt}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="space-y-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Make Offer Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-6">Make an Offer</h2>
              
              <form onSubmit={handleMakeOffer} className="space-y-4">
                <div>
                  <label htmlFor="offerAmount" className="form-label">
                    Offer Amount (SAR)
                  </label>
                  <input
                    type="number"
                    id="offerAmount"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="form-input"
                    placeholder="Enter your offer amount"
                    min="0"
                    step="1000"
                    required
                  />
                  {offerAmount && (
                    <div className="mt-2 text-sm text-gray-600">
                      {formatCurrency(parseInt(offerAmount) || 0)}
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="offerMessage" className="form-label">
                    Message to Seller
                  </label>
                  <textarea
                    id="offerMessage"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    rows={4}
                    className="form-input"
                    placeholder="Add a message to the seller (optional)"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !offerAmount}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Offer...
                    </>
                  ) : (
                    'Submit Offer'
                  )}
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for a successful offer:</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Research comparable properties in the area</li>
                  <li>• Consider the property's condition and features</li>
                  <li>• Be respectful in your message to the seller</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* My Offers */}
      <Card className="mt-8">
        <CardBody className="p-6">
          <h2 className="text-xl font-semibold mb-6">My Offers</h2>
          
          {myOffers.length > 0 ? (
            <div className="space-y-4">
              {myOffers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{property.title}</h3>
                      <p className="text-lg font-bold text-primary-600">{formatCurrency(offer.amount)}</p>
                    </div>
                    <Badge 
                      variant={
                        offer.status === 'locked' ? 'primary' :
                        offer.status === 'pending' ? 'warning' : 
                        offer.status === 'accepted' ? 'success' : 'danger'
                      }
                    >
                      {offer.status === 'locked' ? '🔒 Offer Locked' :
                       offer.status === 'pending' ? '⏳ Pending' : 
                       offer.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{offer.message}</p>
                  <p className="text-sm text-gray-500">
                    Submitted {new Date(offer.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-600">No offers submitted yet</p>
              <p className="text-sm text-gray-500">Make your first offer on a property above</p>
            </div>
          )}
        </CardBody>
      </Card>

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

export default BuyerPage;
