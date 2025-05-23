import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  myJobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Loading states
    setJobsLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Get all jobs
    getAllJobsSuccess: (state, action) => {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Get job details
    getJobDetailsSuccess: (state, action) => {
      state.currentJob = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Get recruiter's jobs
    getMyJobsSuccess: (state, action) => {
      state.myJobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Create job
    createJobSuccess: (state, action) => {
      state.myJobs.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    
    // Update job
    updateJobSuccess: (state, action) => {
      const index = state.myJobs.findIndex(job => job._id === action.payload._id);
      if (index !== -1) {
        state.myJobs[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    
    // Delete job
    deleteJobSuccess: (state, action) => {
      state.myJobs = state.myJobs.filter(job => job._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    
    // Job operation failure
    jobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error
    clearJobError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setJobsLoading,
  getAllJobsSuccess,
  getJobDetailsSuccess,
  getMyJobsSuccess,
  createJobSuccess,
  updateJobSuccess,
  deleteJobSuccess,
  jobFailure,
  clearJobError,
} = jobSlice.actions;

export default jobSlice.reducer;