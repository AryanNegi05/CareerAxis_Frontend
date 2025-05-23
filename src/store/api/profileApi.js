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
export const getJobSeekerProfile = () => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;
    
    const data = await apiCall('/profile/jobseeker/MyProfile', {}, token);
    console.log(data);
    dispatch(getJobSeekerProfileSuccess(data.profile));
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Update job seeker profile
export const updateJobSeekerProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (['skills', 'experience', 'education'].includes(key)) {
        formData.append(key, JSON.stringify(profileData[key])); // keep these as JSON strings
      } else if (key === 'resume' && profileData.resume instanceof File) {
        formData.append('resume', profileData.resume); // append actual file
      } else {
        formData.append(key, profileData[key]);
      }
    });


    const data = await apiCall(
      '/profile/jobseeker/updateProfile',
      {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for multipart/form-data
      },
      token
    );

    dispatch(updateJobSeekerProfileSuccess(data.profile));
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Get recruiter profile
export const getRecruiterProfile = () => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;

    const data = await apiCall('/profile/recruiter/myProfile', {}, token);

    dispatch(getRecruiterProfileSuccess(data.profile));
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Update recruiter profile
export const updateRecruiterProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(
      '/profile/recruiter/updateProfile',
      {
        method: 'POST',
        body: JSON.stringify(profileData),
      },
      token
    );

    dispatch(updateRecruiterProfileSuccess(data.profile));
  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Clear profile errors
export const clearProfileErrors = () => (dispatch) => {
  dispatch(clearProfileError());
};
