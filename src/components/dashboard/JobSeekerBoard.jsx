import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  Briefcase, 
  FileText, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { getAllJobs } from '../../store/api/jobApi';
import { getMyApplications } from '../../store/api/applicationApi'
import { getJobSeekerProfile } from '../../store/api/profileApi';

const JobSeekerDashboard = () => {
const dispatch = useDispatch();
const { user ,token} = useSelector(state => state.auth);
const { jobs, loading: jobsLoading } = useSelector(state => state.jobs);
const { applications, loading: applicationsLoading } = useSelector(state => state.applications);

  const { jobSeekerProfile } = useSelector(state => state.profile);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(getAllJobs());
    dispatch(getMyApplications());
    dispatch(getJobSeekerProfile());
  }, [dispatch]);

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || job.jobType === jobTypeFilter;
    return matchesSearch && matchesLocation && matchesType;
  }) || [];

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ApplicationStats = () => {
    const stats = applications?.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {}) || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.accepted || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JobCard = ({ job }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <button className="text-blue-600 hover:text-blue-800">
          <Eye className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="mr-4">{job.location}</span>
        <DollarSign className="h-4 w-4 mr-1" />
        <span className="mr-4">{job.salary}</span>
        <Calendar className="h-4 w-4 mr-1" />
        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
      <div className="flex justify-between items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {job.jobType}
        </span>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
          Apply Now
        </button>
      </div>
    </div>
  );

  const ApplicationCard = ({ application }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{application.job?.title}</h3>
          <p className="text-gray-600">{application.job?.company}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
      </div>
      {application.coverLetter && (
        <p className="text-gray-700 mb-3 text-sm">{application.coverLetter.substring(0, 100)}...</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Manage your job search and applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <User className="h-4 w-4 mr-2 inline" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Briefcase },
                { id: 'jobs', name: 'Browse Jobs', icon: Search },
                { id: 'applications', name: 'My Applications', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <ApplicationStats />
            
            {/* Profile Completion */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h2>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-700">75%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Complete your profile to get better job matches</p>
            </div>

            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
              <div className="space-y-4">
                {applications?.slice(0, 3).map((application) => (
                  <ApplicationCard key={application._id} application={application} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Browse Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search jobs or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            {jobsLoading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <ApplicationStats />
            
            {applicationsLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {applications?.map((application) => (
                  <ApplicationCard key={application._id} application={application} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;