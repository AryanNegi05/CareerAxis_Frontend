import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FileText, 
  Eye, 
  Check, 
  X, 
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Mail,
  Phone,
  Download,
  ExternalLink
} from 'lucide-react';
import { 
  getJobApplications, 
  acceptApplication, 
  rejectApplication,
  clearApplicationErrors 
} from '../../../store/api/applicationApi';

import {
  
  getJobSeekerProfileById
} from '../../../store/api/profileApi';

const ApplicationManagement = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { myJobs } = useSelector(state => state.jobs);
  const { applications, loading } = useSelector(state => state.applications);
  const {viewedProfile} = useSelector((state) => state.profile);
  console.log(applications);

  // Filter jobs to only show those belonging to verified recruiters
  const availableJobs = myJobs.filter(job => user?.verificationStatus === 'verified');

  useEffect(() => {
    if (selectedJob) {
      console.log(selectedJob);
      dispatch(getJobApplications(selectedJob._id));
      console.log("issjobs ki applications" , applications);
    }
  }, [selectedJob, dispatch]);

  useEffect(() => {
    // Clear errors on component mount
    dispatch(clearApplicationErrors());
  }, [dispatch]);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setSelectedApplication(null);
  };

  const handleViewProfile = (application) => {
    dispatch(getJobSeekerProfileById(application.applicant._id));
    console.log("applicant details" ,viewedProfile );
    setSelectedApplication(application);
  }


  const handleAcceptApplication = async (appId) => {
    try {
      await dispatch(acceptApplication(appId));
      if (selectedJob) {
        dispatch(getJobApplications(selectedJob._id));
      }
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      await dispatch(rejectApplication(appId));
      if (selectedJob) {
        dispatch(getJobApplications(selectedJob._id));
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.applicant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Show verification warning if not verified
  if (user?.verificationStatus !== 'verified') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Verification Required
          </h3>
          <p className="text-gray-600 mb-4">
            You need to be a verified recruiter to manage job applications.
          </p>
          <p className="text-sm text-gray-500">
            {user?.verificationStatus === 'pending' 
              ? 'Your verification is currently pending review.'
              : 'Your verification was rejected. Please update your profile with correct documents.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Job to View Applications</h3>
        
        {availableJobs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => handleJobSelect(job)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedJob?._id === job._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-2">{job.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{job.location}</span>
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {job.applicationsCount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications List */}
      {selectedJob && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Applications for "{selectedJob.title}"
                </h3>
                <p className="text-sm text-gray-600">{filteredApplications.length} applications</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications found.</p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div key={application._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {application.applicant?.firstName} {application.applicant?.lastName}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {application.applicant?.email}
                            </span>
                            {application.jobSeeker?.phone && (
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {application.jobSeeker?.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </div>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Cover Letter:</strong> {application.coverLetter}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2">
                          {application.resume && (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Resume
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleViewProfile(application)}
                            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    {application.status === 'applied' && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleAcceptApplication(application._id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application._id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Applicant Profile
                </h3>
                <button
                  onClick={() => {
                    setSelectedApplication(null)

                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.applicant?.firstName} {selectedApplication.applicant?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedApplication.applicant?.email}</p>
                    </div>
                    {viewedProfile?.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{viewedProfile.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                {viewedProfile && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Profile Details</h4>
                    <div className="space-y-4">
                      {viewedProfile.skills?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                          <div className="flex flex-wrap gap-2">
                            {viewedProfile.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {viewedProfile.bio && (
  <div>
    <label className="block text-sm font-medium text-gray-700">Bio</label>
    <p className="text-sm text-gray-900">{viewedProfile.bio}</p>
  </div>
)}

{viewedProfile.experience?.length > 0 && (
  <div>
    <label className="block text-sm font-medium text-gray-700">Experience</label>
    <ul className="list-disc ml-5 text-sm text-gray-900">
      {viewedProfile.experience.map((exp, index) => (
        <li key={index}>
          <p><strong>Company:</strong> {exp.company}</p>
          <p><strong>Position:</strong> {exp.position}</p>
          <p><strong>Start Date:</strong> {exp.startDate}</p>
          <p><strong>End Date:</strong> {exp.endDate}</p>
          <p><strong>Description:</strong> {exp.description}</p>
        </li>
      ))}
    </ul>
  </div>
)}

{viewedProfile.education?.length > 0 && (
  <div>
    <label className="block text-sm font-medium text-gray-700">Education</label>
    <ul className="list-disc ml-5 text-sm text-gray-900">
      {viewedProfile.education.map((edu, index) => (
        <li key={index}>
          <p><strong>Institution:</strong> {edu.institution}</p>
          <p><strong>Degree:</strong> {edu.degree}</p>
          <p><strong>Field:</strong> {edu.field}</p>
          <p><strong>Start Date:</strong> {edu.startDate}</p>
          <p><strong>End Date:</strong> {edu.endDate}</p>
        </li>
      ))}
    </ul>
  </div>
)}

                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Cover Letter</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedApplication.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedApplication.status === 'pending' && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleRejectApplication(selectedApplication._id);
                        setSelectedApplication(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        handleAcceptApplication(selectedApplication._id);
                        setSelectedApplication(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                    >
                      Accept Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;