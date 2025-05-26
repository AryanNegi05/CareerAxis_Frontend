// store/actions/adminActions.js
import apiCall from '../../utils/api';
import {
  setAdminLoading,
  getPendingRecruitersSuccess,
  updateRecruiterVerificationSuccess,
  removeRecruiterFromPending,
  getAllUsersSuccess,
  deleteUserSuccess,
  adminFailure,
  clearAdminError,
} from '../features/adminSlice';

// Get pending recruiters (needs admin auth)
export const getPendingRecruiters = () => async (dispatch, getState) => {
  try {
    dispatch(setAdminLoading(true));
    console.log("pedning ki call to lag gyi ")
    const token = getState().auth.token;
    
    const data = await apiCall('/admin/recruiters', {}, token);
    
    dispatch(getPendingRecruitersSuccess(data.recruiters));
  } catch (error) {
    dispatch(adminFailure(error.message));
  }
};

// Update recruiter verification status (needs admin auth)
export const updateRecruiterVerification = (recruiterId, action) => async (dispatch, getState) => {
  try {
    dispatch(setAdminLoading(true));
    const token = getState().auth.token;
    
    const data = await apiCall(`/admin/recruiters/${recruiterId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }, token);
    
    dispatch(updateRecruiterVerificationSuccess(data.recruiter));
    
    // Remove from pending list if verified or rejected
    if (action === 'verify' || action === 'reject') {
      dispatch(removeRecruiterFromPending(recruiterId));
    }
  } catch (error) {
    dispatch(adminFailure(error.message));
  }
};

// Get all users (needs admin auth)
export const getAllUsers = () => async (dispatch, getState) => {
  try {
    dispatch(setAdminLoading(true));
    const token = getState().auth.token;
    
    const data = await apiCall('/admin/users', {}, token);
    
    dispatch(getAllUsersSuccess(data.users));
  } catch (error) {
    dispatch(adminFailure(error.message));
  }
};

// Delete user by admin (needs admin auth)
export const deleteUserByAdmin = (userId) => async (dispatch, getState) => {
  try {
    dispatch(setAdminLoading(true));
    const token = getState().auth.token;
    
    await apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    }, token);
    
    dispatch(deleteUserSuccess(userId));
  } catch (error) {
    dispatch(adminFailure(error.message));
  }
};

// Clear admin errors
export const clearAdminErrors = () => (dispatch) => {
  dispatch(clearAdminError());
};