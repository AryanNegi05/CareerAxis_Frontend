import React from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2, 
  Eye, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle 
} from 'lucide-react';

const ApplicationCard = ({ 
  application, 
  getApplicationStatusColor, 
  getApplicationStatusIcon 
}) => {
  const StatusIcon = getApplicationStatusIcon(application.status);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}`;
    }
    return salary;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {application.job?.title || 'Job Title Not Available'}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {application.job?.company || 'Company Not Available'}
            </span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Unknown'}
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        {application.job?.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{application.job.location}</span>
          </div>
        )}
        
        {application.job?.salary && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{formatSalary(application.job.salary)}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Applied on {formatDate(application.appliedAt || application.createdAt)}</span>
        </div>
      </div>

      {/* Cover Letter Preview */}
      {application.coverLetter && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-2">
            <span className="font-medium">Cover Letter: </span>
            {application.coverLetter.length > 100 
              ? `${application.coverLetter.substring(0, 100)}...` 
              : application.coverLetter
            }
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {application.updatedAt 
              ? `Updated ${formatDate(application.updatedAt)}`
              : `Applied ${formatDate(application.appliedAt || application.createdAt)}`
            }
          </span>
        </div>
        
        <div className="flex space-x-2">
          {/* View Job Button */}
          <button 
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            onClick={() => {
              if (application.job?._id) {
                // Navigate to job details - you can implement this based on your routing
                console.log('View job:', application.job._id);
              }
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Job
          </button>
          
          {/* Download Resume Button (if resume was uploaded) */}
          {application.resume && (
            <button 
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                // Handle resume download
                console.log('Download resume:', application.resume);
              }}
            >
              <Download className="h-3 w-3 mr-1" />
              Resume
            </button>
          )}
        </div>
      </div>

      {/* Status-specific Messages */}
      {application.status === 'accepted' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <p className="text-sm text-green-800">
              Congratulations! Your application has been accepted.
              {application.message && ` Message: ${application.message}`}
            </p>
          </div>
        </div>
      )}
      
      {application.status === 'rejected' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-sm text-red-800">
              Unfortunately, your application was not selected.
              {application.message && ` Feedback: ${application.message}`}
            </p>
          </div>
        </div>
      )}
      
      {application.status === 'pending' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Your application is under review. We'll notify you once there's an update.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;