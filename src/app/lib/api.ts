import { projectId, publicAnonKey } from '/utils/supabase/info';
import { authService } from './auth';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-36fca577`;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await authService.getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`API Error on ${url}:`, error);
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  // Nursery endpoints
  async createNursery(nurseryData: any) {
    return fetchWithAuth('/nurseries', {
      method: 'POST',
      body: JSON.stringify(nurseryData),
    });
  },

  async getAllNurseries() {
    return fetchWithAuth('/nurseries');
  },

  async getNursery(id: string) {
    return fetchWithAuth(`/nurseries/${id}`);
  },

  async updateNursery(id: string, updates: any) {
    return fetchWithAuth(`/nurseries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async uploadNurseryImage(nurseryId: string, imageData: string, fileName: string) {
    return fetchWithAuth(`/nurseries/${nurseryId}/upload-image`, {
      method: 'POST',
      body: JSON.stringify({ imageData, fileName }),
    });
  },

  // Child endpoints
  async registerChild(childData: any) {
    return fetchWithAuth('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  },

  async getParentChildren() {
    return fetchWithAuth('/parent/children');
  },

  async getNurseryChildren(nurseryId: string) {
    return fetchWithAuth(`/nursery/${nurseryId}/children`);
  },

  async updateChildStatus(childId: string, status: string) {
    return fetchWithAuth(`/children/${childId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Child updates endpoints
  async postChildUpdate(childId: string, updateData: any) {
    return fetchWithAuth(`/children/${childId}/updates`, {
      method: 'POST',
      body: JSON.stringify(updateData),
    });
  },

  async getChildUpdates(childId: string) {
    return fetchWithAuth(`/children/${childId}/updates`);
  },

  // Program endpoints
  async updateProgram(nurseryId: string, programData: any) {
    return fetchWithAuth(`/nurseries/${nurseryId}/program`, {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  },

  async getProgram(nurseryId: string) {
    return fetchWithAuth(`/nurseries/${nurseryId}/program`);
  },

  // Payment endpoints
  async createPayment(paymentData: any) {
    return fetchWithAuth('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async getNurseryPayments(nurseryId: string) {
    return fetchWithAuth(`/nursery/${nurseryId}/payments`);
  },

  async getParentPayments() {
    return fetchWithAuth('/parent/payments');
  },

  // Profile endpoint
  async getProfile() {
    return fetchWithAuth('/profile');
  },
};
