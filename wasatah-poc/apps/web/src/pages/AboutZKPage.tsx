import { Link } from 'react-router-dom';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useEffect } from 'react';
import Badge from '../components/ui/Badge';

const AboutZKPage = () => {
  const { events, loadEvents } = useLedgerStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const zkpEvents = events.filter(event => event.type === 'zkp_check');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About Zero-Knowledge Proofs</h1>
        <p className="text-gray-600">Understanding ZKP technology in real estate transactions</p>
      </div>

      <div className="space-y-8">
        {/* What is ZKP */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">What are Zero-Knowledge Proofs?</h2>
          <p className="text-gray-700 mb-4">
            Zero-Knowledge Proofs (ZKPs) are cryptographic protocols that allow one party (the prover) 
            to prove to another party (the verifier) that they know a specific piece of information 
            without revealing the information itself.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Key Properties:</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li><strong>Completeness:</strong> If the statement is true, the verifier will be convinced</li>
              <li><strong>Soundness:</strong> If the statement is false, no prover can convince the verifier</li>
              <li><strong>Zero-Knowledge:</strong> The verifier learns nothing beyond the validity of the statement</li>
            </ul>
          </div>
        </div>

        {/* ZKP in Real Estate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">ZKP Applications in Real Estate</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Identity Verification</h3>
              <p className="text-gray-700 text-sm mb-3">
                Prove your identity meets KYC requirements without revealing personal details.
              </p>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 text-sm">
                  <strong>Example:</strong> "I am over 18 and a Saudi citizen" without revealing your exact age or ID number.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Financial Verification</h3>
              <p className="text-gray-700 text-sm mb-3">
                Prove you have sufficient funds without revealing your exact bank balance.
              </p>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 text-sm">
                  <strong>Example:</strong> "I have more than SAR 2.8M in liquid assets" without showing your full financial portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Benefits for Real Estate</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-medium text-gray-900 mb-2">Privacy Protection</h3>
              <p className="text-sm text-gray-600">
                Keep sensitive personal and financial information private while proving compliance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-medium text-gray-900 mb-2">Faster Transactions</h3>
              <p className="text-sm text-gray-600">
                Reduce verification time by eliminating the need for manual document review.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-medium text-gray-900 mb-2">Fraud Prevention</h3>
              <p className="text-sm text-gray-600">
                Cryptographic proofs make it impossible to fake verification credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Implementation</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current PoC Simulation</h3>
              <p className="text-gray-700 text-sm mb-3">
                In this demonstration, ZKP verification is simulated using visual indicators and mock cryptographic proofs. 
                The system shows ZKP verification badges and creates ledger events to demonstrate how real ZKP integration would work.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This is a proof-of-concept. Production implementation would use actual ZKP protocols like zk-SNARKs or zk-STARKs.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Simulated ZKP Features</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h4 className="font-medium text-blue-900 mb-2">KYC/AML Verification</h4>
                  <p className="text-blue-800 text-sm">
                    Simulated identity verification using NAFTA-SIM method with confidence scores and risk assessment.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <h4 className="font-medium text-green-900 mb-2">Biometric Verification</h4>
                  <p className="text-green-800 text-sm">
                    Mock biometric verification for enhanced security and fraud prevention.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <h4 className="font-medium text-purple-900 mb-2">Device Signals</h4>
                  <p className="text-purple-800 text-sm">
                    Simulated device fingerprinting and behavioral analysis for risk assessment.
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <h4 className="font-medium text-orange-900 mb-2">Financial Capability</h4>
                  <p className="text-orange-800 text-sm">
                    Mock proof of financial capability without revealing exact amounts.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Production Roadmap</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Integration with zk-SNARK libraries (e.g., Circom, SnarkJS)</li>
                <li>Custom circuits for real estate verification requirements</li>
                <li>Integration with existing KYC/AML providers</li>
                <li>Smart contract integration for on-chain verification</li>
                <li>Real biometric verification systems</li>
                <li>Advanced device fingerprinting and behavioral analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ZKP Events in Explorer */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">ZKP Events in Action</h2>
          <p className="text-gray-700 text-sm mb-4">
            View actual ZKP verification events recorded in our blockchain explorer. These events demonstrate 
            how ZKP verification would be tracked and verified in a real implementation.
          </p>
          
          {zkpEvents.length > 0 ? (
            <div className="space-y-3">
              {zkpEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-100 text-orange-800">
                        ZKP Check
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {event.hash.slice(0, 8)}...{event.hash.slice(-8)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Actor:</strong> {event.actorName} | 
                    <strong> Type:</strong> {event.details.verificationType || 'identity_verification'} | 
                    <strong> Verified:</strong> {event.details.verified ? '✅ Yes' : '❌ No'}
                    {event.details.confidence && (
                      <span> | <strong>Confidence:</strong> {Math.round(event.details.confidence * 100)}%</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link 
                  to="/explorer?filter=zkp_check" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All ZKP Events in Explorer →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No ZKP events found. Try performing some actions to generate ZKP verification events.</p>
              <Link 
                to="/explorer" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
              >
                View All Events in Explorer →
              </Link>
            </div>
          )}
        </div>

        {/* Learn More */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Learn More</h2>
          <div className="space-y-3">
            <a 
              href="https://z.cash/technology/zksnarks/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-primary-600">zk-SNARKs Explained</h3>
              <p className="text-sm text-gray-600">Comprehensive guide to zero-knowledge succinct non-interactive arguments of knowledge</p>
            </a>
            
            <a 
              href="https://starkware.co/stark/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-primary-600">zk-STARKs Technology</h3>
              <p className="text-sm text-gray-600">Scalable transparent arguments of knowledge for blockchain applications</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutZKPage;
