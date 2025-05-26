import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getPendingRecruiters, getAllUsers } from '../../../store/api/adminApi';
import { getAllJobs } from '../../../store/api/jobApi';

const AdminStats = () => {
  const dispatch = useDispatch();
  const { pendingRecruiters, allUsers } = useSelector(state => state.admin);
  const { jobs } = useSelector(state => state.jobs);

  useEffect(() => {
    dispatch(getPendingRecruiters());
    dispatch(getAllUsers());
    dispatch(getAllJobs());
  }, [dispatch]);

  // Calculate stats
  const totalUsers = allUsers.length;
  const totalJobSeekers = allUsers.filter(user => user.role === 'jobseeker').length;
  const totalRecruiters = allUsers.filter(user => user.role === 'recruiter').length;
  const verifiedRecruiters = allUsers.filter(user => user.role === 'recruiter' && user.isVerified).length;
  const pendingCount = pendingRecruiters.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;

  const statCards = [
    {
      title: 'Total Users',
      count: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Job Seekers',
      count: totalJobSeekers,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Recruiters',
      count: totalRecruiters,
      icon: UserCheck,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Verified Recruiters',
      count: verifiedRecruiters,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Pending Approvals',
      count: pendingCount,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Jobs',
      count: totalJobs,
      icon: Briefcase,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Active Jobs',
      count: activeJobs,
      icon: TrendingUp,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      title: 'Applications',
      count: '1,234', // This would come from applications data
      icon: FileText,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
        <p className="text-blue-100">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Review Pending Recruiters</span>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{pendingCount}</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Manage Users</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{totalUsers}</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Monitor Jobs</span>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{totalJobs}</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All Systems Operational</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Database Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">API Services Running</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;