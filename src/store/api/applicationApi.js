import apiCall from '../../utils/api';
import {
  setApplicationsLoading,
  applyJobSuccess,
  getMyApplicationsSuccess,
  getJobApplicationsSuccess,
  acceptApplicationSuccess,
  rejectApplicationSuccess,
  withdrawApplicationSuccess,
  applicationFailure,
  clearApplicationError,
} from '../features/applicationSlice';

// Apply for job (needs auth)
export const applyForJob = (jobId, ApplyForJobData) => async (dispatch, getState) => {
  try {
    console.log(ApplyForJobData)
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;
    const data = await apiCall(`/application/apply/${jobId}`, {
      method: 'POST',
      body: JSON.stringify(ApplyForJobData),
    }, token);

    console.log("api response" ,data);
    dispatch(applyJobSuccess(data.application));
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Get my applications (job seeker) (needs auth)
export const getMyApplications = () => async (dispatch, getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    const data = await apiCall('/application/applied', {}, token);
    dispatch(getMyApplicationsSuccess(data.applications));
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

export const getAllRecruiterApplications = () => async (dispatch, getState) => {
  try {
    console.log("all recuiter pending appliactions lare  hai hum log abhi")
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;
    const data = await apiCall('/application/pending', {}, token);
    dispatch(getMyApplicationsSuccess(data.pendingApps));
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Get applications for a job (recruiter) (needs auth?)
export const getJobApplications = (jobId) => async (dispatch, getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(`/application/applications/${jobId}`, {}, token);
   console.log(data);
    dispatch(getJobApplicationsSuccess(data.applications));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Accept application (needs auth)
export const acceptApplication = (appId) => async (dispatch, getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(`/application/accept/${appId}`, {
      method: 'PUT',
    }, token);

    dispatch(acceptApplicationSuccess(data.application));
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Reject application (needs auth)
export const rejectApplication = (appId) => async (dispatch, getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(`/application/reject/${appId}`, {
      method: 'PUT',
    }, token);

    dispatch(rejectApplicationSuccess(data.application));
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Withdraw application (needs auth)
export const withdrawApplication = (appId) => async (dispatch, getState) => {
  try {
    console.log(appId);
    
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    await apiCall(`/application/withdraw/${appId}`, {
      method: 'DELETE',
    }, token);

    dispatch(withdrawApplicationSuccess(appId));
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Clear application errors
export const clearApplicationErrors = () => (dispatch) => {
  dispatch(clearApplicationError());
};
