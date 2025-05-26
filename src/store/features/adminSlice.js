// store/slices/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingRecruiters: [],
  allUsers: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Loading states
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Get pending recruiters
    getPendingRecruitersSuccess: (state, action) => {
      state.pendingRecruiters = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Update recruiter verification
    updateRecruiterVerificationSuccess: (state, action) => {
      const index = state.pendingRecruiters.findIndex(
        recruiter => recruiter._id === action.payload._id
      );
      if (index !== -1) {
        state.pendingRecruiters[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },

    // Remove verified/rejected recruiter from pending list
    removeRecruiterFromPending: (state, action) => {
      state.pendingRecruiters = state.pendingRecruiters.filter(
        recruiter => recruiter._id !== action.payload
      );
    },

    // Get all users
    getAllUsersSuccess: (state, action) => {
      state.allUsers = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Delete user
    deleteUserSuccess: (state, action) => {
      state.allUsers = state.allUsers.filter(user => user._id !== action.payload);
      state.loading = false;
      state.error = null;
    },

    // Admin operation failure
    adminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearAdminError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAdminLoading,
  getPendingRecruitersSuccess,
  updateRecruiterVerificationSuccess,
  removeRecruiterFromPending,
  getAllUsersSuccess,
  deleteUserSuccess,
  adminFailure,
  clearAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;