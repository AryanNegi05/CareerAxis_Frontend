// src/store/features/jobSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedJob: null,
  searchFilters: {
    keyword: '',
    location: '',
    jobType: '',
    salaryRange: '',
    company: '',
  },
  searchResults: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Set selected job
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    
    // Clear selected job
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    
    // Set search filters
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    
    // Clear search filters
    clearSearchFilters: (state) => {
      state.searchFilters = {
        keyword: '',
        location: '',
        jobType: '',
        salaryRange: '',
        company: '',
      };
    },
    
    // Set search results
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
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

export const {
  setSelectedJob,
  clearSelectedJob,
  setSearchFilters,
  clearSearchFilters,
  setSearchResults,
  clearSearchResults,
  setLoading,
  setError,
  clearError,
} = jobSlice.actions;

// Selectors
export const selectSelectedJob = (state) => state.jobs.selectedJob;
export const selectSearchFilters = (state) => state.jobs.searchFilters;
export const selectSearchResults = (state) => state.jobs.searchResults;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsError = (state) => state.jobs.error;

export default jobSlice.reducer;