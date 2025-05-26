// RecruiterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  clearJobErrors
} from '../../store/api/jobApi';
import {
  getJobApplications,
  acceptApplication,
  rejectApplication,
  clearApplicationErrors
} from '../../store/api/applicationApi'

import JobCard from '../jobs/JobCardRecruiter';
import JobForm from '../jobs/Jobform';
import ApplicationsView from '../applications/ApplicationsOverview';
import { Plus, AlertCircle, Briefcase } from 'lucide-react';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { myJobs, loading: jobsLoading, error: jobsError } = useSelector(state => state.jobs);
  const { applications, loading: applicationsLoading, error: applicationsError } = useSelector(state => state.applications);
  
  const [currentView, setCurrentView] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobsError) {
      console.error('Jobs error:', jobsError);
      setTimeout(() => dispatch(clearJobErrors()), 5000);
    }
  }, [jobsError, dispatch]);

  useEffect(() => {
    if (applicationsError) {
      console.error('Applications error:', applicationsError);
      setTimeout(() => dispatch(clearApplicationErrors()), 5000);
    }
  }, [applicationsError, dispatch]);

  const handleCreateJob = async (jobData) => {
    try {
      await dispatch(createJob(jobData));
      setCurrentView('jobs');
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      await dispatch(updateJob(editingJob._id, jobData));
      setCurrentView('jobs');
      setEditingJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await dispatch(deleteJob(jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    setCurrentView('applications');
    dispatch(getJobApplications(job._id));
  };

  const handleAcceptApplication = async (appId) => {
    try {
      await dispatch(acceptApplication(appId));
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      await dispatch(rejectApplication(appId));
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  // const getJobApplications = (jobId) => {
  //   return applications.filter(app => app.jobId === jobId);
  // };

  if (jobsLoading && myJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and applications</p>
        </div>

        {(jobsError || applicationsError) && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <span>{jobsError || applicationsError}</span>
          </div>
        )}

        {currentView === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">My Job Postings</h2>
              <button
                onClick={() => setCurrentView('create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Post New Job
              </button>
            </div>

            {myJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No Job Postings Yet</h3>
                <p className="text-gray-400 mb-4">Create your first job posting to start receiving applications.</p>
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onEdit={(job) => {
                      setEditingJob(job);
                      setCurrentView('edit');
                    }}
                    onDelete={handleDeleteJob}
                    onViewApplications={handleViewApplications}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'create' && (
          <JobForm
            onSubmit={handleCreateJob}
            onCancel={() => setCurrentView('jobs')}
            loading={jobsLoading}
          />
        )}

        {currentView === 'edit' && (
          <JobForm
            job={editingJob}
            onSubmit={handleUpdateJob}
            onCancel={() => {
              setCurrentView('jobs');
              setEditingJob(null);
            }}
            loading={jobsLoading}
          />
        )}

        {currentView === 'applications' && selectedJob && (
          <ApplicationsView
            job={selectedJob}
            applications={applications}
            onBack={() => {
              setCurrentView('jobs');
              setSelectedJob(null);
            }}
            onAccept={handleAcceptApplication}
            onReject={handleRejectApplication}
          />
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;