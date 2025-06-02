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
  ExternalLink,
  Briefcase,
  MapPin,
  Users,
  Loader
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

  // Filter jobs to only show those belonging to verified recruiters
  const availableJobs = myJobs.filter(job => user?.verificationStatus === 'verified');

  useEffect(() => {
    if (selectedJob) {
      dispatch(getJobApplications(selectedJob._id));
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
      case 'applied': return 'text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200';
      case 'accepted': return 'text-emerald-700 bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-200';
      case 'rejected': return 'text-red-700 bg-gradient-to-r from-red-100 to-pink-100 border-red-200';
      default: return 'text-gray-700 bg-gradient-to-r from-gray-100 to-slate-100 border-gray-200';
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
      <div className="animate-fade-in-up">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <X className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-slide-down">
              Verification Required
            </h3>
            <p className="text-gray-600 mb-4 text-lg">
              You need to be a verified recruiter to manage job applications.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500">
                {user?.verificationStatus === 'pending' 
                  ? 'Your verification is currently pending review. We\'ll notify you once it\'s complete.'
                  : 'Your verification was rejected. Please update your profile with correct documents and resubmit.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Job Selection */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Select Job to View Applications</h3>
          </div>
        </div>
        
        <div className="p-6">
          {availableJobs.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No Jobs Posted Yet</h4>
              <p className="text-gray-500">Create your first job posting to start receiving applications.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableJobs.map((job, index) => (
                <div
                  key={job._id}
                  onClick={() => handleJobSelect(job)}
                  className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-slide-up border-2 ${
                    selectedJob?._id === job._id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                          {job.company}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {job.location}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        selectedJob?._id === job._id ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {job.applicationCount || 0} applications
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  {selectedJob?._id === job._id && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 animate-pulse pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applications List */}
      {selectedJob && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Applications for "{selectedJob.title}"
                  </h3>
                  <p className="text-blue-100">{filteredApplications.length} total applications</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-white/70" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                >
                  <option value="all" className='text-slate-700'>All Status</option>
                  <option value="pending" className='text-slate-700'>Pending</option>
                  <option value="accepted" className='text-slate-700'>Accepted</option>
                  <option value="rejected" className='text-slate-700'>Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Loader className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Applications Found</h4>
                <p className="text-gray-500">No applications match your current filters.</p>
              </div>
            ) : (
              filteredApplications.map((application, index) => (
                <div key={application._id} className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">
                            {application.applicant?.firstName} {application.applicant?.lastName}
                          </h4>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                              <Mail className="w-4 h-4 mr-2" />
                              {application.applicant?.email}
                            </span>
                            {application.jobSeeker?.phone && (
                              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                <Phone className="w-4 h-4 mr-2" />
                                {application.jobSeeker?.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-2 capitalize">{application.status}</span>
                        </div>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                          <p className="text-sm text-gray-700 font-medium mb-1">Cover Letter:</p>
                          <p className="text-sm text-gray-600 line-clamp-3">{application.coverLetter}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-3">
                          {application.resume && (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-105"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Resume
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleViewProfile(application)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    {application.status === 'applied' && (
                      <div className="flex items-center gap-3 ml-6">
                        <button
                          onClick={() => handleAcceptApplication(application._id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application._id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <X className="w-4 h-4 mr-2" />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Applicant Profile
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-88px)]">
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="animate-slide-up">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <p className="text-gray-900 font-medium">
                        {selectedApplication.applicant?.firstName} {selectedApplication.applicant?.lastName}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <p className="text-gray-900 font-medium">{selectedApplication.applicant?.email}</p>
                    </div>
                    {viewedProfile?.phone && (
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <p className="text-gray-900 font-medium">{viewedProfile.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                {viewedProfile && (
                  <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      Profile Details
                    </h4>
                    <div className="space-y-6">
                      {viewedProfile.skills?.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Skills & Expertise</label>
                          <div className="flex flex-wrap gap-2">
                            {viewedProfile.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full font-medium shadow-sm animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {viewedProfile.bio && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Professional Bio</label>
                          <p className="text-gray-900 leading-relaxed">{viewedProfile.bio}</p>
                        </div>
                      )}

                      {viewedProfile.experience?.length > 0 && (
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-4">Work Experience</label>
                          <div className="space-y-4">
                            {viewedProfile.experience.map((exp, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-gray-900 text-lg font-bold">{exp.position}</p>
                                    <p className="font-semibold text-gray-700">{exp.company}</p>
                                    
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                  </div>
                                </div>
                                {exp.description && (
                                  <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {viewedProfile.education?.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                          <label className="block text-sm font-semibold text-gray-700 mb-4">Education</label>
                          <div className="space-y-4">
                            {viewedProfile.education.map((edu, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <p className="font-semibold text-gray-900">{edu.institution}</p>
                                    <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      Cover Letter
                    </h4>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedApplication.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedApplication.status === 'applied' && (
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <button
                      onClick={() => {
                        handleRejectApplication(selectedApplication._id);
                        setSelectedApplication(null);
                      }}
                      className="group relative px-6 py-3 text-sm font-semibold text-red-600 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200"
                    >
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                        <span>Reject Application</span>
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleAcceptApplication(selectedApplication._id);
                        setSelectedApplication(null);
                      }}
                      className="group relative px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        <span>Accept Application</span>
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    </button>
                  </div>
                )}

                {/* Application Status Display for Non-Pending Applications */}
                {selectedApplication.status !== 'applied' && (
                  <div className="pt-6 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-center">
                      <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold border-2 ${getStatusColor(selectedApplication.status)} transition-all duration-200`}>
                        <div className="mr-3 p-1 rounded-full bg-white/30">
                          {getStatusIcon(selectedApplication.status)}
                        </div>
                        <span className="capitalize">
                          Application {selectedApplication.status}
                        </span>
                        {selectedApplication.status === 'accepted' && (
                          <div className="ml-2 animate-bounce">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        {selectedApplication.status === 'rejected' && (
                          <div className="ml-2">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Timeline */}
                    <div className="mt-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(selectedApplication.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Updated: {new Date(selectedApplication.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Actions Section */}
                <div className="pt-4 border-t border-gray-100 animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {selectedApplication.resume && (
                        <a
                          href={selectedApplication.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                        >
                          <Download className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                          Download Resume
                          <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                        </a>
                      )}
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedApplication.applicant?.email);
                          // You could add a toast notification here
                        }}
                        className="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105"
                      >
                        <Mail className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                        Copy Email
                      </button>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="group p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl animate-scale-in">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">Processing application...</p>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Toast - You can implement this based on your notification system */}
      {/* This would typically be handled by a global toast component */}
    </div>
  );
};

export default ApplicationManagement;