import apiCall from '../../utils/api';
import {
  setProfileLoading,
  getJobSeekerProfileSuccess,
  updateJobSeekerProfileSuccess,
  getRecruiterProfileSuccess,
  updateRecruiterProfileSuccess,
  profileFailure,
  clearProfileError,
} from '../features/profileSlice';

// Get job seeker profile
export const getJobSeekerProfile = () => async (dispatch,getState) => {
  try {
    dispatch(setProfileLoading(true));
    const {auth} = getState();
    const token = auth.token;
    console.log(token);
    const data = await apiCall('/profile/jobseeker/MyProfile',token);
    console.log(data);
    
    dispatch(getJobSeekerProfileSuccess(data.profile));
    
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Update job seeker profile
export const updateJobSeekerProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(setProfileLoading(true));
    
    // Create FormData for file upload
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (key === 'skills' || key === 'experience' || key === 'education') {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    });
    
    const data = await apiCall('/profile/jobseeker/updateProfile', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
    
    dispatch(updateJobSeekerProfileSuccess(data.profile));
    
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Get recruiter profile
export const getRecruiterProfile = () => async (dispatch) => {
  try {
    dispatch(setProfileLoading(true));
    
    const data = await apiCall('/profile/recruiter/myProfile');
    
    dispatch(getRecruiterProfileSuccess(data.profile));
    
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Update recruiter profile
export const updateRecruiterProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(setProfileLoading(true));
    
    const data = await apiCall('/profile/recruiter/updateProfile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    
    dispatch(updateRecruiterProfileSuccess(data.profile));
    
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Clear profile errors
export const clearProfileErrors = () => (dispatch) => {
  dispatch(clearProfileError());
};