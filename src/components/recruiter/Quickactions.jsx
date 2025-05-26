// components/recruiter/QuickActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const actions = [
    {
      title: 'Post New Job',
      description: 'Create a new job posting',
      icon: PlusIcon,
      href: '/recruiter/jobs/create',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Browse Candidates',
      description: 'Search for potential candidates',
      icon: MagnifyingGlassIcon,
      href: '/recruiter/candidates',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'View All Applications',
      description: 'Manage all applications',
      icon: UserGroupIcon,
      href: '/recruiter/applications',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View hiring metrics',
      icon: ChartBarIcon,
      href: '/recruiter/analytics',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  const recentActivity = [
    {
      type: 'application',
      message: 'New application for Frontend Developer',
      time: '2 hours ago'
    },
    {
      type: 'job',
      message: 'Backend Developer job was viewed 15 times',
      time: '4 hours ago'
    },
    {
      type: 'application',
      message: 'Application accepted for UI Designer',
      time: '1 day ago'
    },
    {
      type: 'job',
      message: 'Full Stack Developer position expired',
      time: '2 days ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
              >
                <div className={`${action.color} rounded-lg p-2 mr-3 group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                {activity.type === 'application' ? (
                  <DocumentTextIcon className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChartBarIcon className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/recruiter/activity"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all activity →
          </Link>
        </div>
      </div>

      {/* Settings Quick Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Settings
        </h3>
        <div className="space-y-3">
          <Link
            to="/recruiter/profile"
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="bg-gray-500 hover:bg-gray-600 rounded-lg p-2 mr-3 group-hover:scale-105 transition-transform">
              <CogIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Profile Settings
              </h4>
              <p className="text-xs text-gray-600">
                Update your company information
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Tips & Guides */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          💡 Hiring Tips
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Improve your hiring process with these proven strategies.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
            <span className="text-gray-700">
              Respond to applications within 24-48 hours for better candidate experience
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
            <span className="text-gray-700">
              Write clear and detailed job descriptions to attract quality candidates
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
            <span className="text-gray-700">
              Use structured interviews and standardized questions for fair evaluation
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
            <span className="text-gray-700">
              Set realistic salary ranges and benefits to compete in the market
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <Link
            to="/recruiter/guides"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Read comprehensive hiring guides →
          </Link>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Need Help?
        </h3>
        <div className="space-y-3">
          <Link
            to="/support"
            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors"
          >
            📞 Contact Support
          </Link>
          <Link
            to="/faq"
            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors"
          >
            ❓ Frequently Asked Questions
          </Link>
          <Link
            to="/documentation"
            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors"
          >
            📖 Platform Documentation
          </Link>
          <Link
            to="/feedback"
            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors"
          >
            💬 Send Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;