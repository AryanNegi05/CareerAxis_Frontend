import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Briefcase, 
  FileText, 
  Search, 
  Filter,
  TrendingUp,
  Star,
  BarChart3,
  Users,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  X,
  Upload,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Bell,
  LogOut,
  Menu,
  Shield,
  Home
} from 'lucide-react';

// Import Redux actions
import { getAllJobs, clearJobErrors } from '../../store/api/jobApi';
import { getMyApplications, applyForJob, clearApplicationErrors, withdrawApplication } from '../../store/api/applicationApi';
import { getJobSeekerProfile, clearProfileErrors } from '../../store/api/profileApi';
import { logout } from '../../store/api/authApi';

// Import components
import StatsCards from '../dashboard/StatsCard';
import JobCard from '../jobs/JobsCard';
import ApplicationModal from '../applications/ApplicationModal';
import ProfilePage from '../profile/JobSeekerProfilePage';
import RecentActivity from './RecentActivity';
import ProfileCompletion from '../profile/ProfileCompletion';
import JobRecommendations from '../jobs/JobRecommendation';
import ApplicationCard from '../applications/ApplicationCard';

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const { user, token } = useSelector(state => state.auth);
  const { jobs, loading: jobsLoading, error: jobsError } = useSelector(state => state.jobs);
  const { myApplications, loading: applicationsLoading, error: applicationsError } = useSelector(state => state.applications);
  const { jobSeekerProfile, loading: profileLoading, error: profileError } = useSelector(state => state.profile);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({ coverLetter: '' });

  // Load initial data
  useEffect(() => {
    if (token) {
      dispatch(getAllJobs());
      dispatch(getMyApplications());
      dispatch(getJobSeekerProfile());
    }
  }, [dispatch, token]);

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearJobErrors());
    dispatch(clearApplicationErrors());
    dispatch(clearProfileErrors());
  }, [dispatch]);

  // Filter and sort jobs
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || job.jobType === jobTypeFilter;
    const matchesSalary = !salaryFilter || (job.salary && checkSalaryRange(job.salary, salaryFilter));
    return matchesSearch && matchesLocation && matchesType && matchesSalary;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'salary-high':
        return (b.salary || 0) - (a.salary || 0);
      case 'salary-low':
        return (a.salary || 0) - (b.salary || 0);
      default:
        return 0;
    }
  }) || [];

  const checkSalaryRange = (salary, range) => {
    const numSalary = typeof salary === 'number' ? salary : parseInt(salary.toString().replace(/\D/g, ''));
    switch (range) {
      case '0-50k': return numSalary <= 50000;
      case '50k-100k': return numSalary > 50000 && numSalary <= 100000;
      case '100k+': return numSalary > 100000;
      default: return true;
    }
  };

  // Handle job application
  const handleJobApply = async (jobId, applicationData) => {
    try {
      const ApplyForJobData = {...applicationData, 
        resume: jobSeekerProfile.resume
      }
      await dispatch(applyForJob(jobId, ApplyForJobData));
      setShowApplicationModal(false);
      setSelectedJob(null);
      setApplicationData({ coverLetter: '' });
      dispatch(getMyApplications());
    } catch (error) {
      console.error('Application failed:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Utility functions
  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getApplicationStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const handleWithdrawApplication = (applicationId) => {
    dispatch(withdrawApplication(applicationId));
    dispatch(getMyApplications());
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="animate-fade-in-up">
            <StatsCards 
              applications={myApplications}
              profile={jobSeekerProfile}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                <RecentActivity 
                  applications={myApplications}
                  getApplicationStatusColor={getApplicationStatusColor}
                  getApplicationStatusIcon={getApplicationStatusIcon}
                />
                <JobRecommendations 
                  jobs={jobs}
                  profile={jobSeekerProfile}
                />
              </div>
              <div className="space-y-6">
                <ProfileCompletion 
                  profile={jobSeekerProfile}
                  onProfileClick={() => setShowProfile(true)}
                />
              </div>
            </div>
          </div>
        );
      case 'jobs':
        return (
          <div className="animate-fade-in-up">
            {/* Search and Filter Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 transition-all duration-300 hover:shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jobs, companies..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">All Locations</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Austin">Austin</option>
                  <option value="Remote">Remote</option>
                </select>

                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>

                <select
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">All Salaries</option>
                  <option value="0-50k">$0 - $50k</option>
                  <option value="50k-100k">$50k - $100k</option>
                  <option value="100k+">$100k+</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {filteredJobs.length} jobs found
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobsLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : jobsError ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-red-600 mb-4">Error loading jobs: {jobsError}</p>
                  <button
                    onClick={() => dispatch(getAllJobs())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job._id} className="animate-fade-in">
                    <JobCard
                      job={job}
                      applications={myApplications}
                      onApply={(job) => {
                        setSelectedJob(job);
                        setShowApplicationModal(true);
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {myApplications?.length || 0} total applications
              </div>
            </div>

            {applicationsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : applicationsError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading applications: {applicationsError}</p>
                <button
                  onClick={() => dispatch(getMyApplications())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Retry
                </button>
              </div>
            ) : myApplications?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myApplications.map((application) => (
                  <div key={application._id} className="animate-fade-in">
                    <ApplicationCard 
                      application={application}
                      getApplicationStatusColor={getApplicationStatusColor}
                      getApplicationStatusIcon={getApplicationStatusIcon}
                      onWithdrawApplication={handleWithdrawApplication}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="animate-fade-in-up">
            <ProfilePage 
              profile={jobSeekerProfile}
              loading={profileLoading}
              error={profileError}
            />
          </div>
        );
      default:
        return (
          <div className="animate-fade-in-up">
            <StatsCards 
              applications={myApplications}
              profile={jobSeekerProfile}
            />
          </div>
        );
    }
  };

  // Show profile page if requested from old navigation
  if (showProfile && activeTab !== 'profile') {
    setActiveTab('profile');
    setShowProfile(false);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white w-64 min-h-screen transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block fixed lg:static z-50 p-4`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-green-400 transform hover:scale-110 transition-transform duration-200" />
            <span className="text-xl font-bold">Job Hunter</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-gray-800 p-1 rounded-md transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                  activeTab === item.id 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 ${
                  activeTab === item.id ? 'scale-110' : ''
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-105"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 backdrop-blur-sm bg-white/95 sticky top-0 z-40">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {menuItems.find(item => item.id === activeTab)?.label || 'Overview'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Welcome back, {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 group">
                  <Bell className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-semibold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>


        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fade-in-up">
            {(profileLoading || jobsLoading || applicationsLoading) && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}
            <div className="transition-all duration-500 ease-in-out">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJob}
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedJob(null);
          setApplicationData({ coverLetter: '' });
        }}
        onSubmit={handleJobApply}
        applicationData={applicationData}
        setApplicationData={setApplicationData}
        loading={applicationsLoading}
      />

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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JobSeekerDashboard;