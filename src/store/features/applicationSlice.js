// store/slices/applicationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  myApplications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Loading states
    setApplicationsLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Apply for job
    applyJobSuccess: (state, action) => {
      state.myApplications.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    
    // Get my applications (job seeker)
    getMyApplicationsSuccess: (state, action) => {
      state.myApplications = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Get applications for job (recruiter)
    getJobApplicationsSuccess: (state, action) => {
      state.applications = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Accept application
    acceptApplicationSuccess: (state, action) => {
      const index = state.applications.findIndex(app => app._id === action.payload._id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    
    // Reject application
    rejectApplicationSuccess: (state, action) => {
      const index = state.applications.findIndex(app => app._id === action.payload._id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    
    // Withdraw application
    withdrawApplicationSuccess: (state, action) => {
      state.myApplications = state.myApplications.filter(app => app._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    
    // Application operation failure
    applicationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error
    clearApplicationError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setApplicationsLoading,
  applyJobSuccess,
  getMyApplicationsSuccess,
  getJobApplicationsSuccess,
  acceptApplicationSuccess,
  rejectApplicationSuccess,
  withdrawApplicationSuccess,
  applicationFailure,
  clearApplicationError,
} = applicationSlice.actions;

export default applicationSlice.reducer;