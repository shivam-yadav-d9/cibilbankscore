const API_BASE_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Application methods
  async createApplication(applicationData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getUserApplications(userId, email) {
    let query = '';
    if (userId) {
      query = `?user_id=${userId}`;
    } else if (email) {
      query = `?email=${email}`;
    }
    
    return this.request(`/applications/user${query}`);
  }

  async getApplicationById(applicationId) {
    return this.request(`/applications/${applicationId}`);
  }

  async updateApplicationStatus(applicationId, status) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async addDocumentsToApplication(applicationId, documents) {
    return this.request(`/applications/${applicationId}/documents`, {
      method: 'PATCH',
      body: JSON.stringify({ documents }),
    });
  }

  async deleteApplication(applicationId) {
    return this.request(`/applications/${applicationId}`, {
      method: 'DELETE',
    });
  }

  async getAllApplications(page = 1, limit = 10, status = null) {
    let query = `?page=${page}&limit=${limit}`;
    if (status) {
      query += `&status=${status}`;
    }
    
    return this.request(`/applications/all${query}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();