
import React from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  TrendingUp,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const RecentActivity = ({ applications, getApplicationStatusColor, getApplicationStatusIcon }) => {
  // Get recent applications (last 10, sorted by date)
  const recentApplications = applications
    ?.slice()
    .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
    .slice(0, 10) || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getActivityIcon = (status) => {
    const IconComponent = getApplicationStatusIcon(status);
    return <IconComponent className="h-4 w-4" />;
  };

  const getActivityMessage = (application) => {
    const jobTitle = application.job?.title || application.jobTitle || 'Unknown Job';
    const company = application.job?.company || application.company || 'Unknown Company';
    
    switch (application.status) {
      case 'accepted':
        return `Your application for ${jobTitle} at ${company} was accepted`;
      case 'rejected':
        return `Your application for ${jobTitle} at ${company} was rejected`;
      case 'pending':
        return `You applied for ${jobTitle} at ${company}`;
      default:
        return `Application status updated for ${jobTitle} at ${company}`;
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No recent activity</h4>
          <p className="text-sm text-gray-500">Your job applications and updates will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          Last 30 days
        </div>
      </div>

      <div className="space-y-4">
        {recentApplications.map((application, index) => (
          <div key={application._id || index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            {/* Status Icon */}
            <div className={`flex-shrink-0 p-2 rounded-full ${getApplicationStatusColor(application.status)}`}>
              {getActivityIcon(application.status)}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium leading-5">
                    {getActivityMessage(application)}
                  </p>
                  
                  {/* Additional details */}
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(application.appliedAt || application.createdAt)}
                    </div>
                    
                    {application.job?.jobType && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {application.job.jobType}
                      </div>
                    )}
                    
                    {application.job?.location && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {application.job.location}
                      </div>
                    )}
                  </div>

                  {/* Cover letter preview if available */}
                  {application.coverLetter && application.coverLetter.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      "{application.coverLetter.substring(0, 100)}..."
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0 ml-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                    {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more link if there are more applications */}
      {applications.length > 10 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activity ({applications.length} total)
          </button>
        </div>
      )}

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {applications.filter(app => app.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {applications.filter(app => app.status === 'accepted').length}
            </div>
            <div className="text-xs text-gray-500">Accepted</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {applications.filter(app => app.status === 'rejected').length}
            </div>
            <div className="text-xs text-gray-500">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;