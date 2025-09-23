// Crypto utilities for Wasatah.app PoC
// Note: This is a simplified implementation for demo purposes

export const createPseudoSignature = (payload: Record<string, any>): string => {
  // Create a simple hash-like signature for demo purposes
  const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
  const timestamp = Date.now().toString();
  const combined = payloadString + timestamp;
  
  // Simple hash function (not cryptographically secure, for demo only)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hexHash}${timestamp.slice(-8)}`;
};

export const verifyPseudoSignature = (signature: string, payload: Record<string, any>): boolean => {
  const expectedSignature = createPseudoSignature(payload);
  return signature === expectedSignature;
};
