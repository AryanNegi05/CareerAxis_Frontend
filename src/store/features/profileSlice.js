// store/slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobSeekerProfile: null,
  recruiterProfile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Loading states
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Get job seeker profile
    getJobSeekerProfileSuccess: (state, action) => {
      state.jobSeekerProfile = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Update job seeker profile
    updateJobSeekerProfileSuccess: (state, action) => {
      state.jobSeekerProfile = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Get recruiter profile
    getRecruiterProfileSuccess: (state, action) => {
      state.recruiterProfile = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Update recruiter profile
    updateRecruiterProfileSuccess: (state, action) => {
      state.recruiterProfile = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Profile operation failure
    profileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error
    clearProfileError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProfileLoading,
  getJobSeekerProfileSuccess,
  updateJobSeekerProfileSuccess,
  getRecruiterProfileSuccess,
  updateRecruiterProfileSuccess,
  profileFailure,
  clearProfileError,
} = profileSlice.actions;

export default profileSlice.reducer;