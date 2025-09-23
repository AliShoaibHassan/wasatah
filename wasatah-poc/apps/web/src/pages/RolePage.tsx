import { useNavigate } from 'react-router-dom';
import PageHeading from '../components/layout/PageHeading';
import { Card, CardBody } from '../components/ui/Card';
import { useRoleStore } from '../stores/useRoleStore';
import { useAuthStore } from '../stores/useAuthStore';

const RolePage = () => {
  const navigate = useNavigate();
  const { selectRole } = useRoleStore();
  const { user } = useAuthStore();

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Browse properties, make offers, and track your real estate journey',
      icon: '🏠',
      path: '/buyer',
      color: 'from-blue-500 to-blue-600',
      features: ['Property Search', 'Offer Management', 'Transaction Tracking']
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'List your properties, manage offers, and complete sales',
      icon: '🏘️',
      path: '/seller',
      color: 'from-green-500 to-green-600',
      features: ['Property Listing', 'Offer Review', 'Sale Management']
    },
    {
      id: 'broker',
      title: 'Broker',
      description: 'Connect buyers and sellers, facilitate transactions',
      icon: '🤝',
      path: '/broker',
      color: 'from-purple-500 to-purple-600',
      features: ['Client Matching', 'Transaction Facilitation', 'Commission Tracking']
    }
  ];

  const handleRoleSelect = (roleId: string, path: string) => {
    selectRole(roleId as 'buyer' | 'seller' | 'broker');
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeading
        title="Choose Your Role"
        subtitle="Select how you want to experience the Wasatah platform"
        className="text-center mb-8"
      />

      {/* User Info */}
      {user && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-lg text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {user.digitalId && (
                    <>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✅ NAFTA Verified (Simulated)
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        🔐 ZKP Verified (Simulated)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {roles.map((role) => (
          <Card
            key={role.id}
            hover
            onClick={() => handleRoleSelect(role.id, role.path)}
            className="text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <CardBody className="p-8">
              {/* Icon with gradient background */}
              <div className={`mx-auto h-20 w-20 bg-gradient-to-r ${role.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                <span className="text-3xl">{role.icon}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{role.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{role.description}</p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    {feature}
                  </div>
                ))}
              </div>
              
              {/* Action Button */}
              <button className={`w-full py-3 px-6 bg-gradient-to-r ${role.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                Enter as {role.title}
              </button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-4">Why Choose Wasatah?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <span className="mr-2">🔒</span>
              Blockchain Security
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">🤖</span>
              AI-Powered Insights
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">⚡</span>
              Instant Transactions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePage;
