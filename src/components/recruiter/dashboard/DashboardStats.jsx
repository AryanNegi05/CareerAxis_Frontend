import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  FileText, 
  TrendingUp,
  Eye,
  Clock,
} from 'lucide-react';

const DashboardStats = ({ jobs = [], myApplications = [] }) => {
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'open').length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0),
    pendingApplications: myApplications.filter(app => app.status === 'applied').length
  };

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'blue',
      description: 'Jobs posted'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: TrendingUp,
      color: 'green',
      description: 'Currently hiring'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'purple',
      description: 'Applications received'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'yellow',
      description: 'Awaiting review'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 ring-blue-500/10',
      green: 'bg-green-50 text-green-600 ring-green-500/10',
      purple: 'bg-purple-50 text-purple-600 ring-purple-500/10',
      yellow: 'bg-yellow-50 text-yellow-600 ring-yellow-500/10'
    };
    return colors[color] || colors.blue;
  };

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="ml-2 text-sm text-gray-500">{stat.description}</p>
              </dd>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h3>

          {recentJobs.length === 0 ? (
            <div className="text-center py-6">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by posting your first job.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{job.title}</h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{job.type}</span>
                      <span className="mx-2">•</span>
                      <span>{job.applicationCount || 0} applications</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Post New Job',
                description: 'Create and publish a new job posting',
                icon: Briefcase,
                color: 'bg-blue-50 text-blue-700'
              },
              {
                title: 'Review Applications',
                description: 'Review and manage job applications',
                icon: Users,
                color: 'bg-green-50 text-green-700'
              },
              {
                title: 'Update Profile',
                description: 'Manage your recruiter profile',
                icon: FileText,
                color: 'bg-purple-50 text-purple-700'
              }
            ].map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="relative group bg-white p-6 border border-gray-300 rounded-lg shadow-sm space-y-4 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div>
                  <span className={`rounded-lg inline-flex p-3 ${action.color} ring-4 ring-white`}>
                    <action.icon className="w-6 h-6" />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
