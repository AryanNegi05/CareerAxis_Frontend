import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  XCircle,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react';
import { getMyJobs, createJob, updateJob, deleteJob } from '../../../store/api/jobApi';
import CreateJobModal from './CreateJobModal';
import EditJobModal from './EditJobModal';

const JobManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);

  const dispatch = useDispatch();
  const { myJobs, loading, error } = useSelector(state => state.jobs);
  const {user} = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyJobs());
    console.log("the recuiter jobs are" , myJobs);
  }, [dispatch]);

  // Filter jobs based on search and status
  const filteredJobs = myJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateJob = async (jobData) => {
    try {
      await dispatch(createJob(jobData));
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      await dispatch(updateJob(selectedJob._id, jobData));
      setShowEditModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await dispatch(deleteJob(jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
    setShowDropdown(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
      case 'paused':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
      case 'closed':
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
    }
  };

  if (user?.verificationStatus !== 'verified') {
    return (
      <div className="min-h-96 flex items-center justify-center animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 max-w-md mx-auto transform transition-all duration-500 hover:scale-105">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-100 to-pink-100 mb-6 animate-pulse">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Verification Required
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You need to be a verified recruiter to manage job applications.
            </p>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
              <p className="text-sm text-gray-700 font-medium">
                {user?.verificationStatus === 'pending' 
                  ? '⏳ Your verification is currently pending review.'
                  : '❌ Your verification was rejected. Please update your profile with correct documents.'
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
      {/* Header with Enhanced Styling */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                My Jobs
              </h2>
            </div>
            <p className="text-gray-600 ml-11">Manage and track your job postings</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="group inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search jobs by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-4 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl bg-white cursor-pointer transition-all duration-200 hover:border-gray-300"
            >
              <option value="all">All Status</option>
              <option value="open">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List with Enhanced Design */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-500 font-medium">Loading your jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 mb-6">
            <Briefcase className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {myJobs.length === 0 
              ? "Ready to find your next great hire? Start by posting your first job and connect with talented candidates." 
              : "No jobs match your current search criteria. Try adjusting your filters or search terms."}
          </p>
          {myJobs.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="group inline-flex items-center px-8 py-4 border border-transparent shadow-lg text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Post Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <div
              key={job._id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {job.title}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)} shadow-sm`}>
                          {job.status === 'active' && '🟢'}
                          {job.status === 'paused' && '🟡'}
                          {job.status === 'closed' && '⚪'}
                          <span className="ml-1 capitalize">{job.status}</span>
                        </span>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === job._id ? null : job._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group-hover:bg-gray-50"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {showDropdown === job._id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 border border-gray-100 animate-scale-in">
                            <div className="py-2">
                              <button
                                onClick={() => handleEditClick(job)}
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition-colors duration-200 group/item"
                              >
                                <Edit className="w-4 h-4 mr-3 group-hover/item:scale-110 transition-transform duration-200" />
                                Edit Job Details
                              </button>
                              <button
                                onClick={() => {/* View applications logic */}}
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 w-full text-left transition-colors duration-200 group/item"
                              >
                                <Eye className="w-4 h-4 mr-3 group-hover/item:scale-110 transition-transform duration-200" />
                                View Applications
                              </button>
                              <hr className="my-1 border-gray-100" />
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200 group/item"
                              >
                                <Trash2 className="w-4 h-4 mr-3 group-hover/item:scale-110 transition-transform duration-200" />
                                Delete Job
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Job Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors duration-200">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate font-medium">{job.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-green-50 transition-colors duration-200">
                        <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="truncate font-medium">
                          {job.salaryRange?.min && job.salaryRange?.max
                            ? `₹${job.salaryRange.min} - ₹${job.salaryRange.max}`
                            : 'Negotiable'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-purple-50 transition-colors duration-200">
                        <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">
                          {job.applicationCount || 0} applicants
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-orange-50 transition-colors duration-200">
                        <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="font-medium">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Job Description */}
                    {job.description && (
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateJobModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateJob}
        />
      )}

      {showEditModal && selectedJob && (
        <EditJobModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedJob(null);
          }}
          onSubmit={handleUpdateJob}
          job={selectedJob}
        />
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default JobManagement;