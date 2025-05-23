import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

const apiCall = async (endpoint, options = {}, token) => {
  try {
    
    console.log(endpoint, token);
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    };

    const config = {
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      params: options.params || undefined,
      withCredentials: true, 
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // axios errors can have response.data.message or fallback message
    throw new Error(error.response?.data?.error || error.response?.data?.message || error.message);
  }
};

export default apiCall;
