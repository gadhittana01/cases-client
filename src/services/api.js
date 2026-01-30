const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set, using default:', API_BASE_URL);
}


const getToken = () => {
  return localStorage.getItem('token');
};


const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {

  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (data) => {
    const endpoint = data.role === 'lawyer' ? '/auth/signup/lawyer' : '/auth/signup/client';
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async () => {
    return request('/auth/profile');
  },


  getMyCases: async (page = 1, pageSize = 10) => {
    return request(`/client/cases?page=${page}&page_size=${pageSize}`);
  },

  getCaseById: async (id) => {
    return request(`/client/cases/${id}`);
  },

  createCase: async (caseData) => {
    return request('/client/cases', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
  },

  uploadCaseFile: async (caseId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/client/cases/${caseId}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },


  acceptQuote: async (quoteId) => {
    return request('/client/quotes/accept', {
      method: 'POST',
      body: JSON.stringify({ quote_id: quoteId }),
    });
  },


  getMarketplaceCases: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.created_since) params.append('created_since', filters.created_since);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('page_size', filters.pageSize);

    const queryString = params.toString();
    return request(`/lawyer/marketplace${queryString ? `?${queryString}` : ''}`);
  },

  getMarketplaceCase: async (id) => {
    return request(`/lawyer/marketplace/cases/${id}`);
  },


  getMyQuotes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('page_size', filters.pageSize);

    const queryString = params.toString();
    return request(`/lawyer/quotes${queryString ? `?${queryString}` : ''}`);
  },

  getMyQuoteForCase: async (caseId) => {
    return request(`/lawyer/marketplace/cases/${caseId}/quotes/my`);
  },

  createQuote: async (caseId, quoteData) => {
    return request(`/lawyer/marketplace/cases/${caseId}/quotes`, {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  updateQuote: async (caseId, quoteData) => {
    return request(`/lawyer/marketplace/cases/${caseId}/quotes`, {
      method: 'PUT',
      body: JSON.stringify(quoteData),
    });
  },


  getFileDownloadUrl: async (fileId) => {
    return request(`/files/${fileId}/download`);
  },
};
