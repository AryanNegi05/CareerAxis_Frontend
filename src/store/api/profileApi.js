// store/actions/profileActions.js
import apiCall from '../../utils/api';
import { updateUserInfo } from '../features/authSlice';
import {
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
} from '../features/profileSlice';

// Get job seeker profile (own profile)
export const getJobSeekerProfile = () => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;

    const data = await apiCall('/profile/jobseeker/MyProfile', {}, token);

    if (process.env.NODE_ENV === 'development') {
      console.log('JobSeeker Profile data:', data);
    }

    dispatch(getJobSeekerProfileSuccess(data.profile));
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch profile';
    dispatch(profileFailure(errorMessage));
  }
};

// Get job seeker profile by ID (for viewing other profiles)
export const getJobSeekerProfileById = (userId) => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(`/profile/jobseeker/${userId}`, {}, token);

    dispatch(getJobSeekerProfileByIdSuccess(data.profile));
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch profile';
    dispatch(profileFailure(errorMessage));
  }
};

// Update job seeker profile
export const updateJobSeekerProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch(setProfileLoading(true));
    const token = getState().auth.token;
    
    // Create FormData for file upload support
    const formData = new FormData();
    
    Object.keys(profileData).forEach((key) => {
      if (['skills', 'experience', 'education'].includes(key)) {
        formData.append(key, JSON.stringify(profileData[key])); // keep these as JSON strings
      } else if (key === 'resume' && profileData.resume instanceof File) {
        formData.append('resume', profileData.resume); // append actual file
      } else if (profileData[key] !== null && profileData[key] !== undefined) {
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

    let requestData;
    let requestHeaders = {};

    // Check if FormData was passed or if there's a file
    const hasFile = (profileData instanceof FormData) || 
                   (profileData.verificationDoc && profileData.verificationDoc instanceof File);

    if (hasFile) {
      // Handle FormData or create FormData for file upload
      if (profileData instanceof FormData) {
        requestData = profileData;
      } else {
        const formData = new FormData();
        Object.keys(profileData).forEach((key) => {
          if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
            formData.append(key, profileData[key]);
          }
        });
        requestData = formData;
      }
      
      // Don't set Content-Type for FormData - let browser set it with boundary
      requestHeaders = {};
    } else {
      // Use JSON for regular data without files
      const cleanData = { ...profileData };
      delete cleanData.verificationDoc; // Remove null file reference
      
      requestData = JSON.stringify(cleanData);
      requestHeaders = {
        'Content-Type': 'application/json',
      };
    }
    if (requestData instanceof FormData) {
  for (let pair of requestData.entries()) {
    console.log(pair[0], pair[1]);
  }
} else {
  console.log(requestData);
}


    const data = await apiCall(
      '/profile/recruiter/updateProfile',
      {
        method: 'POST',
        body: requestData,
        headers: requestHeaders,
      },
      token
    );

    dispatch(updateRecruiterProfileSuccess(data.profile));
    dispatch(updateUserInfo({ verificationStatus: data.verificationStatus })); // ✅ Correct

  } catch (error) {
    dispatch(profileFailure(error.message));
  }
};

// Clear profile errors
export const clearProfileErrors = () => (dispatch) => {
  dispatch(clearProfileError());
};

// Clear viewed profile
export const clearViewedProfileData = () => (dispatch) => {
  dispatch(clearViewedProfile());
};

// Clear all profiles (for logout)
export const clearAllProfilesData = () => (dispatch) => {
  dispatch(clearAllProfiles());
};