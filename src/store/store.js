// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import applicationReducer from './features/applicationSlice';
import jobReducer from './features/jobSlice';
import adminReducer from './features/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    applications: applicationReducer,
    jobs: jobReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
