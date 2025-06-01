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
  LogOut,
  Menu,
  X,
  Search,
  Shield
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getRecruiterProfile } from '../../../store/api/profileApi'
import { getMyJobs } from '../../../store/api/jobApi';  
import { fetchLatestUserInfo, logout } from '../../../store/api/authApi';
import DashboardStats from './DashboardStats';
import JobManagement from './JobManagement';
import ApplicationManagement from './ApplicationManagement';
import ProfileSection from './ProfileManagement';
import {
  getAllRecruiterApplications
} from '../../../store/api/applicationApi';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector(state => state.auth);
  const { recruiterProfile, loading: profileLoading } = useSelector(state => state.profile);
  const { myJobs, loading: jobsLoading } = useSelector(state => state.jobs);
  const {myApplications , loading : applicationLoading  } = useSelector(state => state.applications);

  useEffect(() => {
    dispatch(fetchLatestUserInfo());
  },[])

  useEffect(() => {
    dispatch(getAllRecruiterApplications());
    console.log(myApplications);
    dispatch(getRecruiterProfile());
    dispatch(getMyJobs());
    console.log(myJobs);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <DashboardStats jobs={myJobs} myApplications={myApplications}/>;
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white w-64 min-h-screen transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block fixed lg:static z-50 p-4`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-400 transform hover:scale-110 transition-transform duration-200" />
            <span className="text-xl font-bold">Recruiter Hub</span>
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
                    ? 'bg-blue-600 text-white shadow-lg' 
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 group">
                  <Bell className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
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

        {/* Verification Status Banners */}
        <div className="px-6 pt-6">
          {user?.verificationStatus === 'pending' && (
            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 shadow-sm animate-slide-down">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Settings className="h-5 w-5 text-yellow-500 animate-pulse" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-yellow-800">
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
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 shadow-sm animate-slide-down">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Settings className="h-5 w-5 text-red-500 animate-bounce" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Verification Rejected
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Your account verification was rejected. Please update your profile with correct verification documents.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fade-in-up">
            {(profileLoading || jobsLoading || applicationLoading) && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

      {/* Custom CSS for animations */}
      <style>{`
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

export default RecruiterDashboard;