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
  LogOut
} from 'lucide-react';

// Import Redux actions
import { getAllJobs, clearJobErrors } from '../../store/api/jobApi';
import { getMyApplications, applyForJob, clearApplicationErrors  , withdrawApplication} from '../../store/api/applicationApi';
import { getJobSeekerProfile, clearProfileErrors } from '../../store/api/profileApi';
import { logout } from '../../store/api/authApi';

// Import components
import DashboardHeader from './DashBoardHeader';
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
  const [showProfile, setShowProfile] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({ coverLetter: '' });
  

  // Load initial data
  useEffect(() => {
    if (token) {
      dispatch(getAllJobs());
      console.log("JOBS FOR THIS PERSON " , jobs);
      
      dispatch(getMyApplications());
      console.log("Applications" , myApplications);
      
      dispatch(getJobSeekerProfile());
      console.log("THIS GUYS PROFILE " ,jobSeekerProfile);
      
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
      const ApplyForJobData = {...applicationData , 
        resume : jobSeekerProfile.resume
      }

      await dispatch(applyForJob(jobId, ApplyForJobData));
      setShowApplicationModal(false);
      setSelectedJob(null);
      setApplicationData({ coverLetter: '' });
      // Refresh applications after successful application
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

  // Show profile page if requested
  if (showProfile) {
    return (
      <ProfilePage 
        onBack={() => setShowProfile(false)}
        profile={jobSeekerProfile}
        loading={profileLoading}
        error={profileError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={user}
        onProfileClick={() => setShowProfile(true)}
        onLogout={handleLogout}
      />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'jobs', name: 'Browse Jobs', icon: Briefcase },
              { id: 'applications', name: 'My Applications', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <StatsCards 
              applications={myApplications}
              profile={jobSeekerProfile}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {/* Search and Filter Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jobs, companies..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    applications={myApplications}
                    onApply={(job) => {
                      setSelectedJob(job);
                      setShowApplicationModal(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
              <div className="text-sm text-gray-600">
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : myApplications?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myApplications.map((application) => (
                  <ApplicationCard 
                  key={application._id} 
                  application={application}
                  getApplicationStatusColor={getApplicationStatusColor}
                  getApplicationStatusIcon={getApplicationStatusIcon}
                  onWithdrawApplication={handleWithdrawApplication}
                />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default JobSeekerDashboard;