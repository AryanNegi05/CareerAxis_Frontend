import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Settings,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { getRecruiterProfile } from '../../../store/api/profileApi'
import { getMyJobs } from '../../../store/api/jobApi';  
import { logout } from '../../../store/api/authApi';
import DashboardStats from './DashboardStats';
import JobManagement from './JobManagement';
import ApplicationManagement from './ApplicationManagement';
import ProfileSection from './ProfileManagement';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  console.log(user);
  const { recruiterProfile, loading: profileLoading } = useSelector(state => state.profile);
  const { myJobs, loading: jobsLoading } = useSelector(state => state.jobs);

  useEffect(() => {
    // Fetch recruiter profile and jobs on component mount
    dispatch(getRecruiterProfile());

    dispatch(getMyJobs());
    console.log(myJobs);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <DashboardStats jobs={myJobs} />;
      case 'jobs':
        return <JobManagement/>;
      case 'applications':
        return <ApplicationManagement />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <DashboardStats jobs={myJobs} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Status Banner */}
        {user?.verificationStatus === 'pending' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Settings className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Verification Pending
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your account verification is currently pending. Some features may be limited until verification is complete.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.verificationStatus === 'rejected' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Settings className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Verification Rejected
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Your account verification was rejected. Please update your profile with correct verification documents.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;