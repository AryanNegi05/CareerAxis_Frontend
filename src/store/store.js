
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import jobReducer from './features/jobSlice';
import profileReducer from './features/profileSlice';
import applicationReducer from './features/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    profile: profileReducer,
    applications: applicationReducer,
  },
});

export default store;