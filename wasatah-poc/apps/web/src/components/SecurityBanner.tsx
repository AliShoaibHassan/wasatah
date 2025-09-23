import { useState, useEffect } from 'react';
import { useSecurityStore } from '../stores/useSecurityStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import type { RiskFlag } from '../types/models';

const SecurityBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { activeRiskFlags, getCriticalRiskFlags, resolveRiskFlag } = useSecurityStore();
  const { addEvent } = useLedgerStore();

  useEffect(() => {
    const criticalFlags = getCriticalRiskFlags();
    setIsVisible(criticalFlags.length > 0);
  }, [activeRiskFlags, getCriticalRiskFlags]);

  const handleDismiss = async (flagId: string) => {
    try {
      await resolveRiskFlag(flagId);
      setIsVisible(getCriticalRiskFlags().length === 0);
    } catch (error) {
      console.error('Failed to dismiss risk flag:', error);
    }
  };

  const handleCreateEvent = async (flag: RiskFlag) => {
    try {
      await addEvent('impersonation_flag', flag.userId, 'Security System', {
        riskFlagId: flag.id,
        type: flag.type,
        severity: flag.severity,
        description: flag.description,
        metadata: flag.metadata,
        detectedAt: flag.detectedAt
      });
    } catch (error) {
      console.error('Failed to create impersonation_flag event:', error);
    }
  };

  if (!isVisible) return null;

  const criticalFlags = getCriticalRiskFlags();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">
                Security Alert: {criticalFlags.length} Risk Flag{criticalFlags.length > 1 ? 's' : ''} Detected
              </h3>
              <p className="text-xs opacity-90">
                Potential impersonation or security risks have been identified
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                criticalFlags.forEach(flag => {
                  handleCreateEvent(flag);
                });
              }}
              className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-xs font-medium transition-colors"
            >
              Log Event
            </button>
            <button
              onClick={() => {
                criticalFlags.forEach(flag => handleDismiss(flag.id));
              }}
              className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-xs font-medium transition-colors"
            >
              Dismiss All
            </button>
          </div>
        </div>
        
        {/* Risk Flag Details */}
        <div className="mt-3 space-y-2">
          {criticalFlags.map((flag) => (
            <div key={flag.id} className="bg-red-700 rounded p-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {flag.severity === 'critical' ? '🚨' : '⚠️'} {flag.type.toUpperCase()}
                  </span>
                  <span className="ml-2 opacity-90">{flag.description}</span>
                </div>
                <button
                  onClick={() => handleDismiss(flag.id)}
                  className="text-red-200 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              {flag.metadata && (
                <div className="mt-1 text-red-200">
                  <span className="font-medium">Confidence:</span> {Math.round((flag.metadata.confidence || 0) * 100)}%
                  {flag.metadata.rule && (
                    <span className="ml-2">
                      <span className="font-medium">Rule:</span> {flag.metadata.rule}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityBanner;
