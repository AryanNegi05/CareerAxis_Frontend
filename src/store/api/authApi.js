// store/actions/authActions.js
import apiCall from '../../utils/api';
import {
  setLoading,
  loginSuccess,
  authFailure,
  logout as logoutAction,
  clearError,
  updateUserInfo
} from '../features/authSlice';
import { clearAllProfilesData } from '../api/profileApi';
// import { clearAllApplicationsData } from '../api/profileApi';

// Login action (no token required)
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    console.log(credentials);

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
    throw error;
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
    throw error;
  }
};

// Check if user is authenticated on app load
export const checkAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Decode token to get user info (you might want to verify token with backend)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp * 1000 > Date.now()) {
        // Token is valid, set user as authenticated
        dispatch(loginSuccess({
          user: { id: payload.userId, role: payload.role },
          token: token,
        }));
      } else {
        // Token expired, logout
        dispatch(logout());
      }
    } catch (error) {
      // Invalid token, logout
      dispatch(logout());
    }
  }
};

// Logout action (clear local storage + Redux + all related data)
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  
  // Clear all related data
  dispatch(clearAllProfilesData());
  // dispatch(clearAllApplicationsData());
  
  // Clear auth state
  dispatch(logoutAction());
  
};

// Clear auth error
export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};

export const fetchLatestUserInfo = () => async (dispatch, getState) => {
  const token = getState().auth.token;

  try {
    const data = await apiCall('/auth/me', {}, token); // or /profile/me
    dispatch(updateUserInfo(data.user)); // update Redux
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { ...storedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser)); // update localStorage
  } catch (error) {
    console.error("Failed to fetch latest user info:", error.message);
  }
};