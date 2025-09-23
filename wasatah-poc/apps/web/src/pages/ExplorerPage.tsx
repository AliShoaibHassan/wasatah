import { useState, useEffect } from 'react';
import { useLedgerStore } from '../stores/useLedgerStore';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import type { EventType, LedgerEvent } from '../types/models';

const ExplorerPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<EventType | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { events, loadEvents, isLoading } = useLedgerStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const eventTypes: EventType[] = [
    'user_registered',
    'user_verified', 
    'property_listed',
    'property_updated',
    'offer_made',
    'offer_accepted',
    'offer_rejected',
    'transaction_completed',
    'transfer_completed',
    'identity_verification',
    'deed_verification',
    'risk_assessment',
    'impersonation_detected',
    'impersonation_flag',
    'buyer_broker_linked',
    'zkp_check'
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.type === selectedFilter);

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'user_registered':
      case 'user_verified':
        return 'bg-green-100 text-green-800';
      case 'property_listed':
      case 'property_updated':
        return 'bg-blue-100 text-blue-800';
      case 'offer_made':
      case 'offer_accepted':
      case 'offer_rejected':
        return 'bg-yellow-100 text-yellow-800';
      case 'transaction_completed':
      case 'transfer_completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'identity_verification':
      case 'deed_verification':
        return 'bg-purple-100 text-purple-800';
      case 'risk_assessment':
      case 'impersonation_detected':
      case 'impersonation_flag':
        return 'bg-red-100 text-red-800';
      case 'buyer_broker_linked':
        return 'bg-indigo-100 text-indigo-800';
      case 'zkp_check':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventType = (type: EventType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const copyToClipboard = async (event: LedgerEvent) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(event, null, 2));
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blockchain Explorer</h1>
        <p className="text-gray-600">View all transactions and verifications on the Wasatah network</p>
      </div>

      {/* Filter Chips */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatEventType(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-600">No events found for the selected filter.</p>
            </CardBody>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge className={getTypeColor(event.type)}>
                      {formatEventType(event.type)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(event)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {copiedId === event.id ? '✓ Copied' : 'Copy JSON'}
                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-mono text-gray-600 break-all">
                    <span className="font-medium">Hash:</span> {truncateHash(event.hash)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Actor:</span> {event.actorName} ({event.actorId})
                  </div>
                </div>

                {/* Metadata Table */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Event Details</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(event.details).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <div className="text-gray-600 mt-1 break-words">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {event.signature && (
                  <div className="mt-4 text-sm">
                    <span className="font-medium text-gray-700">Signature:</span>
                    <div className="font-mono text-gray-600 break-all mt-1">
                      {truncateHash(event.signature)}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Network Stats */}
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center p-6">
            <div className="text-2xl font-bold text-primary-600">{events.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-6">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type.includes('verification')).length}
            </div>
            <div className="text-sm text-gray-600">Verifications</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-6">
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.type.includes('offer')).length}
            </div>
            <div className="text-sm text-gray-600">Offers</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-6">
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(e => e.type.includes('transaction') || e.type.includes('transfer')).length}
            </div>
            <div className="text-sm text-gray-600">Transactions</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ExplorerPage;
