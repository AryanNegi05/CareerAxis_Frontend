// store/slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobSeekerProfile: null,
  recruiterProfile: null,
  viewedProfile: null, // For viewing other profiles
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

    // Get job seeker profile (own profile)
    getJobSeekerProfileSuccess: (state, action) => {
      state.jobSeekerProfile = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Get job seeker profile by ID (viewing others)
    getJobSeekerProfileByIdSuccess: (state, action) => {
      state.viewedProfile = action.payload;
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

    // Clear viewed profile
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },

    // Clear all profiles (for logout)
    clearAllProfiles: (state) => {
      state.jobSeekerProfile = null;
      state.recruiterProfile = null;
      state.viewedProfile = null;
      state.error = null;
    },
  },
});

export const {
  setProfileLoading,
  getJobSeekerProfileSuccess,
  getJobSeekerProfileByIdSuccess,
  updateJobSeekerProfileSuccess,
  getRecruiterProfileSuccess,
  updateRecruiterProfileSuccess,
  profileFailure,
  clearProfileError,
  clearViewedProfile,
  clearAllProfiles,
} = profileSlice.actions;

export default profileSlice.reducer;