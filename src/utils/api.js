import axios from 'axios';

const API_BASE_URL = 'https://careeraxis-backend-1.onrender.com';

const apiCall = async (endpoint, options = {}, token) => {
  try {
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const config = {
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      method: options.method || 'GET',
      data: isFormData ? options.body : options.body ? JSON.parse(options.body) : undefined,
      params: options.params || undefined,
      withCredentials: true,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message
    );
  }
};


export default apiCall;
