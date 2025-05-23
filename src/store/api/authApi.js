// store/actions/authActions.js
import apiCall from '../../utils/api';
import {
  setLoading,
  loginSuccess,
  authFailure,
  logout as logoutAction,
  clearError,
} from '../features/authSlice';

// Login action (no token required)
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token in localStorage
    localStorage.setItem('token', data.token);

    dispatch(loginSuccess({
      user: data.user,
      token: data.token,
    }));

    return data;

  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

// Signup action (no token required)
export const signup = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token in localStorage
    localStorage.setItem('token', data.token);

    dispatch(loginSuccess({
      user: data.user,
      token: data.token,
    }));

    return data;

  } catch (error) {
    dispatch(authFailure(error.message));
  }
};

// Logout action (clear local storage + Redux)
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logoutAction());
};

// Clear auth error
export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};
