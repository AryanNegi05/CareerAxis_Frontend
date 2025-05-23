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
export const applyForJob = (jobId, applicationData) => async (dispatch, getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(`/applications/apply/${jobId}`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }, token);

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

// Get applications for a job (recruiter) (needs auth?)
export const getJobApplications = (jobId) => async (dispatch, getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    const data = await apiCall(`/applications/applications/${jobId}`, {}, token);
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

    const data = await apiCall(`/applications/accept/${appId}`, {
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

    const data = await apiCall(`/applications/reject/${appId}`, {
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
    dispatch(setApplicationsLoading(true));
    const token = getState().auth.token;

    await apiCall(`/applications/withdraw/${appId}`, {
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
