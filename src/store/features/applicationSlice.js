// src/store/features/applicationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myApplications: [],
  jobApplications: [],
  selectedApplication: null,
  applicationStats: {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  },
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Set my applications (job seeker)
    setMyApplications: (state, action) => {
      state.myApplications = action.payload;
    },
    
    // Add new application
    addApplication: (state, action) => {
      state.myApplications.unshift(action.payload);
    },
    
    // Remove application
    removeApplication: (state, action) => {
      state.myApplications = state.myApplications.filter(
        app => app._id !== action.payload
      );
    },
    
    // Update application status
    updateApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const application = state.myApplications.find(app => app._id === applicationId);
      if (application) {
        application.status = status;
      }
      
      // Also update in jobApplications if exists
      const jobApplication = state.jobApplications.find(app => app._id === applicationId);
      if (jobApplication) {
        jobApplication.status = status;
      }
    },
    
    // Set job applications (recruiter)
    setJobApplications: (state, action) => {
      state.jobApplications = action.payload;
    },
    
    // Set selected application
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },
    
    // Clear selected application
    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },
    
    // Update application stats
    updateApplicationStats: (state, action) => {
      state.applicationStats = { ...state.applicationStats, ...action.payload };
    },
    
    // Calculate stats from applications
    calculateStats: (state) => {
      const total = state.myApplications.length;
      const pending = state.myApplications.filter(app => app.status === 'applied').length;
      const accepted = state.myApplications.filter(app => app.status === 'accepted').length;
      const rejected = state.myApplications.filter(app => app.status === 'rejected').length;
      
      state.applicationStats = { total, pending, accepted, rejected };
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear all application data
    clearApplications: (state) => {
      state.myApplications = [];
      state.jobApplications = [];
      state.selectedApplication = null;
      state.applicationStats = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
      };
    },
  },
});

export const {
  setMyApplications,
  addApplication,
  removeApplication,
  updateApplicationStatus,
  setJobApplications,
  setSelectedApplication,
  clearSelectedApplication,
  updateApplicationStats,
  calculateStats,
  setLoading,
  setError,
  clearError,
  clearApplications,
} = applicationSlice.actions;

// Selectors
export const selectMyApplications = (state) => state.applications.myApplications;
export const selectJobApplications = (state) => state.applications.jobApplications;
export const selectSelectedApplication = (state) => state.applications.selectedApplication;
export const selectApplicationStats = (state) => state.applications.applicationStats;
export const selectApplicationsLoading = (state) => state.applications.loading;
export const selectApplicationsError = (state) => state.applications.error;

// Derived selectors
export const selectApplicationsByStatus = (status) => (state) =>
  state.applications.myApplications.filter(app => app.status === status);

export const selectHasAppliedToJob = (jobId) => (state) =>
  state.applications.myApplications.some(app => app.jobId._id === jobId);

export default applicationSlice.reducer;