import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { getPendingRecruiters, getAllUsers } from '../../../store/api/adminApi';
import { getAllJobs } from '../../../store/api/jobApi';

const AdminStats = () => {
  const dispatch = useDispatch();
  const { pendingRecruiters, allUsers } = useSelector(state => state.admin);
  const { jobs } = useSelector(state => state.jobs);
  const [isLoaded, setIsLoaded] = useState(false);
  const [counters, setCounters] = useState({});

  useEffect(() => {
    dispatch(getPendingRecruiters());
    dispatch(getAllUsers());
    dispatch(getAllJobs());
    console.log(jobs);
    console.log(pendingRecruiters);
    console.log(allUsers);
    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 100);
  }, [dispatch]);

  // Calculate stats
  const totalUsers = allUsers.length;
  const totalJobSeekers = allUsers.filter(user => user.role === 'jobseeker').length;
  const totalRecruiters = allUsers.filter(user => user.role === 'recruiter').length;
  const verifiedRecruiters = allUsers.filter(user => user.role === 'recruiter' && user.verificationStatus === 'verified').length;
  console.log(verifiedRecruiters);
  const pendingCount = pendingRecruiters.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'open').length;

  // Animated counter effect
  const animateValue = (start, end, duration, key) => {
    if (counters[key] !== undefined) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      
      setCounters(prev => ({ ...prev, [key]: current }));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    if (isLoaded) {
      // Animate counters with staggered delays
      setTimeout(() => animateValue(0, totalUsers, 1000, 'totalUsers'), 200);
      setTimeout(() => animateValue(0, totalJobSeekers, 1000, 'totalJobSeekers'), 300);
      setTimeout(() => animateValue(0, totalRecruiters, 1000, 'totalRecruiters'), 400);
      setTimeout(() => animateValue(0, verifiedRecruiters, 1000, 'verifiedRecruiters'), 500);
      setTimeout(() => animateValue(0, pendingCount, 1000, 'pendingCount'), 600);
      setTimeout(() => animateValue(0, totalJobs, 1000, 'totalJobs'), 700);
      setTimeout(() => animateValue(0, activeJobs, 1000, 'activeJobs'), 800);
      setTimeout(() => animateValue(0, 1234, 1000, 'applications'), 900);
    }
  }, [isLoaded, totalUsers, totalJobSeekers, totalRecruiters, verifiedRecruiters, pendingCount, totalJobs, activeJobs]);

  const statCards = [
    {
      title: 'Total Users',
      count: counters.totalUsers ?? 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Job Seekers',
      count: counters.totalJobSeekers ?? 0,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Recruiters',
      count: counters.totalRecruiters ?? 0,
      icon: UserCheck,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Verified Recruiters',
      count: counters.verifiedRecruiters ?? 0,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Pending Approvals',
      count: counters.pendingCount ?? 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Total Jobs',
      count: counters.totalJobs ?? 0,
      icon: Briefcase,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Active Jobs',
      count: counters.activeJobs ?? 0,
      icon: TrendingUp,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Applications',
      count: counters.applications ?? 0,
      icon: FileText,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New recruiter registration', user: 'john@company.com', time: '2 hours ago', type: 'pending' },
    { id: 2, action: 'Job seeker profile updated', user: 'jane@email.com', time: '4 hours ago', type: 'info' },
    { id: 3, action: 'Recruiter verified', user: 'hr@techcorp.com', time: '1 day ago', type: 'success' },
    { id: 4, action: 'New job posted', user: 'recruiter@startup.io', time: '2 days ago', type: 'info' },
    { id: 5, action: 'User account suspended', user: 'spam@user.com', time: '3 days ago', type: 'warning' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg transform transition-all duration-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 animate-slide-in-left">Welcome back, Admin!</h2>
            <p className="text-orange-100 animate-slide-in-left delay-100">Here's what's happening with your platform today.</p>
          </div>
          <div className="hidden md:block">
            <Activity className="h-12 w-12 text-orange-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1 transition-colors duration-200">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 transition-all duration-500">
                    {stat.count.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-500 transform ${
          isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
        }`} style={{ transitionDelay: '800ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:border-orange-300 transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium group-hover:text-orange-700 transition-colors duration-200">Review Pending Recruiters</span>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full group-hover:bg-yellow-200 transition-colors duration-200">
                {pendingCount}
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium group-hover:text-green-700 transition-colors duration-200">Manage Users</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full group-hover:bg-blue-200 transition-colors duration-200">
                {totalUsers}
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium group-hover:text-purple-700 transition-colors duration-200">Monitor Jobs</span>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full group-hover:bg-purple-200 transition-colors duration-200">
                {totalJobs}
              </span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-500 transform ${
          isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`} style={{ transitionDelay: '900ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-102 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
                style={{ transitionDelay: `${1000 + (index * 100)}ms` }}
              >
                <div className="flex-shrink-0 mt-1 transform hover:scale-110 transition-transform duration-200">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 hover:text-gray-600 transition-colors duration-200">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-500 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`} style={{ transitionDelay: '1200ms' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'All Systems Operational',
            'Database Connected', 
            'API Services Running'
          ].map((status, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-300 transform hover:scale-105 ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
              }`}
              style={{ transitionDelay: `${1300 + (index * 100)}ms` }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
              <span className="text-sm text-gray-600 font-medium">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default AdminStats;