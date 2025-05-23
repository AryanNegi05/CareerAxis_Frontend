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

// Apply for job
export const applyForJob = (jobId, applicationData) => async (dispatch) => {
  try {
    dispatch(setApplicationsLoading(true));
   
    const data = await apiCall(`/applications/apply/${jobId}`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    
    dispatch(applyJobSuccess(data.application));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Get my applications (job seeker)
export const getMyApplications = () => async (dispatch,getState) => {
  try {
    dispatch(setApplicationsLoading(true));
    const { auth } = getState();
    const token = auth.token;
    console.log(token);
    const data = await apiCall('/application/applied' , token);
    console.log(data);
    dispatch(getMyApplicationsSuccess(data.applications));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Get applications for a job (recruiter)
export const getJobApplications = (jobId) => async (dispatch) => {
  try {
    dispatch(setApplicationsLoading(true));
    
    const data = await apiCall(`/applications/applications/${jobId}`);
    
    dispatch(getJobApplicationsSuccess(data.applications));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Accept application
export const acceptApplication = (appId) => async (dispatch) => {
  try {
    dispatch(setApplicationsLoading(true));
    
    const data = await apiCall(`/applications/accept/${appId}`, {
      method: 'PUT',
    });
    
    dispatch(acceptApplicationSuccess(data.application));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Reject application
export const rejectApplication = (appId) => async (dispatch) => {
  try {
    dispatch(setApplicationsLoading(true));
    
    const data = await apiCall(`/applications/reject/${appId}`, {
      method: 'PUT',
    });
    
    dispatch(rejectApplicationSuccess(data.application));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Withdraw application
export const withdrawApplication = (appId) => async (dispatch) => {
  try {
    dispatch(setApplicationsLoading(true));
    
    await apiCall(`/applications/withdraw/${appId}`, {
      method: 'DELETE',
    });
    
    dispatch(withdrawApplicationSuccess(appId));
    
  } catch (error) {
    dispatch(applicationFailure(error.message));
  }
};

// Clear application errors
export const clearApplicationErrors = () => (dispatch) => {
  dispatch(clearApplicationError());
};