import apiCall from '../../utils/api';
import {
  setJobsLoading,
  getAllJobsSuccess,
  getJobDetailsSuccess,
  getMyJobsSuccess,
  createJobSuccess,
  updateJobSuccess,
  deleteJobSuccess,
  jobFailure,
  clearJobError,
} from '../features/jobSlice';

// Get all jobs (public)
export const getAllJobs = () => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    const data = await apiCall('/jobs/AllJobs');
    dispatch(getAllJobsSuccess(data.data));
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Get job details (public)
export const getJobDetails = (jobId) => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    const data = await apiCall(`/jobs/${jobId}`);
    dispatch(getJobDetailsSuccess(data.job));
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Get recruiter's jobs (requires token)
export const getMyJobs = () => async (dispatch, getState) => {
  try {
    dispatch(setJobsLoading(true));
    const token = getState().auth.token;
    const data = await apiCall('/jobs/my-jobs', {}, token);
    dispatch(getMyJobsSuccess(data.jobs));
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Create job (requires token)
export const createJob = (jobData) => async (dispatch, getState) => {
  try {
    dispatch(setJobsLoading(true));
    const token = getState().auth.token;
    const data = await apiCall('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }, token);
    dispatch(createJobSuccess(data.job));
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Update job (requires token)
export const updateJob = (jobId, jobData) => async (dispatch, getState) => {
  try {
    dispatch(setJobsLoading(true));
    const token = getState().auth.token;
    const data = await apiCall(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }, token);
    dispatch(updateJobSuccess(data.job));
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Delete job (requires token)
export const deleteJob = (jobId) => async (dispatch, getState) => {
  try {
    dispatch(setJobsLoading(true));
    const token = getState().auth.token;
    await apiCall(`/jobs/${jobId}`, {
      method: 'DELETE',
    }, token);
    dispatch(deleteJobSuccess(jobId));
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Clear job errors
export const clearJobErrors = () => (dispatch) => {
  dispatch(clearJobError());
};
