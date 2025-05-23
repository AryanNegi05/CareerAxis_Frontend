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

// Get all jobs
export const getAllJobs = () => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    const data = await apiCall('/jobs/AllJobs');
    console.log(data);
    dispatch(getAllJobsSuccess(data.data));
    
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Get job details
export const getJobDetails = (jobId) => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    
    const data = await apiCall(`/jobs/${jobId}`);
    
    dispatch(getJobDetailsSuccess(data.job));
    
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Get recruiter's jobs
export const getMyJobs = () => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    
    const data = await apiCall('/jobs/my-jobs');
    
    dispatch(getMyJobsSuccess(data.jobs));
    
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Create job
export const createJob = (jobData) => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    
    const data = await apiCall('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    
    dispatch(createJobSuccess(data.job));
    
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Update job
export const updateJob = (jobId, jobData) => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    
    const data = await apiCall(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    
    dispatch(updateJobSuccess(data.job));
    
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Delete job
export const deleteJob = (jobId) => async (dispatch) => {
  try {
    dispatch(setJobsLoading(true));
    
    await apiCall(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
    
    dispatch(deleteJobSuccess(jobId));
    
  } catch (error) {
    dispatch(jobFailure(error.message));
  }
};

// Clear job errors
export const clearJobErrors = () => (dispatch) => {
  dispatch(clearJobError());
};

