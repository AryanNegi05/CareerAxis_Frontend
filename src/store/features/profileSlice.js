// src/store/features/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobSeekerProfile: null,
  recruiterProfile: null,
  profileCompletion: 0,
  isProfileComplete: false,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Set job seeker profile
    setJobSeekerProfile: (state, action) => {
      state.jobSeekerProfile = action.payload;
      state.profileCompletion = calculateJobSeekerCompletion(action.payload);
      state.isProfileComplete = state.profileCompletion >= 80;
    },
    
    // Update job seeker profile
    updateJobSeekerProfile: (state, action) => {
      state.jobSeekerProfile = { ...state.jobSeekerProfile, ...action.payload };
      state.profileCompletion = calculateJobSeekerCompletion(state.jobSeekerProfile);
      state.isProfileComplete = state.profileCompletion >= 80;
    },
    
    // Set recruiter profile
    setRecruiterProfile: (state, action) => {
      state.recruiterProfile = action.payload;
      state.profileCompletion = calculateRecruiterCompletion(action.payload);
      state.isProfileComplete = state.profileCompletion >= 80;
    },
    
    // Update recruiter profile
    updateRecruiterProfile: (state, action) => {
      state.recruiterProfile = { ...state.recruiterProfile, ...action.payload };
      state.profileCompletion = calculateRecruiterCompletion(state.recruiterProfile);
      state.isProfileComplete = state.profileCompletion >= 80;
    },
    
    // Clear profile data
    clearProfile: (state) => {
      state.jobSeekerProfile = null;
      state.recruiterProfile = null;
      state.profileCompletion = 0;
      state.isProfileComplete = false;
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
  },
});

// Helper functions to calculate profile completion
const calculateJobSeekerCompletion = (profile) => {
  if (!profile) return 0;
  
  let completion = 0;
  const fields = [
    profile.user?.firstName,
    profile.user?.lastName,
    profile.user?.email,
    profile.resume,
    profile.skills?.length > 0,
    profile.experience?.length > 0,
    profile.education?.length > 0,
  ];
  
  const completedFields = fields.filter(Boolean).length;
  completion = (completedFields / fields.length) * 100;
  
  return Math.round(completion);
};

const calculateRecruiterCompletion = (profile) => {
  if (!profile) return 0;
  
  let completion = 0;
  const fields = [
    profile.user?.firstName,
    profile.user?.lastName,
    profile.user?.email,
    profile.bio,
    profile.company,
    profile.linkedin,
  ];
  
  const completedFields = fields.filter(Boolean).length;
  completion = (completedFields / fields.length) * 100;
  
  return Math.round(completion);
};

export const {
  setJobSeekerProfile,
  updateJobSeekerProfile,
  setRecruiterProfile,
  updateRecruiterProfile,
  clearProfile,
  setLoading,
  setError,
  clearError,
} = profileSlice.actions;

// Selectors
export const selectJobSeekerProfile = (state) => state.profile.jobSeekerProfile;
export const selectRecruiterProfile = (state) => state.profile.recruiterProfile;
export const selectProfileCompletion = (state) => state.profile.profileCompletion;
export const selectIsProfileComplete = (state) => state.profile.isProfileComplete;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;