// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import API slices
import { authApi } from './api/authApi';
import { jobApi } from './api/jobApi';
import { applicationApi } from './api/applicationApi';
import { profileApi } from './api/profileApi';

// Import feature slices
import authReducer from './features/authSlice';
import jobReducer from './features/jobSlice';
import applicationReducer from './features/applicationSlice';
import profileReducer from './features/profileSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  // Feature slices
  auth: authReducer,
  jobs: jobReducer,
  applications: applicationReducer,
  profile: profileReducer,
  
  // API slices
  [authApi.reducerPath]: authApi.reducer,
  [jobApi.reducerPath]: jobApi.reducer,
  [applicationApi.reducerPath]: applicationApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      jobApi.middleware,
      applicationApi.middleware,
      profileApi.middleware
    ),
});

export const persistor = persistStore(store);

// Setup listeners for RTK Query
setupListeners(store.dispatch);