// API client utilities for Wasatah.app PoC
import type { LedgerEvent, EventType } from '../types/models';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const IS_READONLY = import.meta.env.VITE_READONLY === 'true';

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LedgerResponse {
  events: LedgerEvent[];
}

// API client class
class ApiClient {
  private baseUrl: string;
  private isReadonly: boolean;

  constructor(baseUrl: string, isReadonly: boolean = false) {
    this.baseUrl = baseUrl;
    this.isReadonly = isReadonly;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          message: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Failed to connect to API',
      };
    }
  }

  // Get all ledger events
  async getLedgerEvents(): Promise<ApiResponse<LedgerResponse>> {
    if (this.isReadonly) {
      // In read-only mode, load from bundled JSON
      try {
        const response = await fetch('/ledger.readonly.json');
        const data = await response.json();
        return {
          success: true,
          data: data,
        };
      } catch (error) {
        return {
          success: false,
          error: 'Failed to load read-only ledger',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
    
    return this.request<LedgerResponse>('/api/ledger');
  }

  // Append new ledger event
  async appendLedgerEvent(
    type: EventType,
    actorId: string,
    actorName: string,
    details: Record<string, any>
  ): Promise<ApiResponse<LedgerEvent>> {
    if (this.isReadonly) {
      return {
        success: false,
        error: 'Read-only mode',
        message: 'POST operations are disabled in read-only mode',
      };
    }

    return this.request<LedgerEvent>('/api/ledger/append', {
      method: 'POST',
      body: JSON.stringify({
        type,
        actorId,
        actorName,
        details,
      }),
    });
  }

  // Reset ledger to seed data
  async resetLedger(): Promise<ApiResponse<LedgerResponse>> {
    if (this.isReadonly) {
      return {
        success: false,
        error: 'Read-only mode',
        message: 'Reset operations are disabled in read-only mode',
      };
    }

    return this.request<LedgerResponse>('/api/ledger/reset', {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL, IS_READONLY);

// Export for testing
export { ApiClient };

// Utility functions
export const isReadonlyMode = () => IS_READONLY;
export const getApiBaseUrl = () => API_BASE_URL;
