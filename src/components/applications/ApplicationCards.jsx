import React from 'react';
import { User, CheckCircle, XCircle, FileText } from 'lucide-react';

const ApplicationCard = ({ application, onAccept, onReject, onViewProfile }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            {application.applicant.firstName} {application.applicant.lastName}
          </h4>
          <p className="text-gray-600">{application.applicant.email}</p>
          <p className="text-sm text-gray-500">Applied: {formatDate(application.appliedAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>

      {application.coverLetter && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-700 mb-2">Cover Letter:</h5>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{application.coverLetter}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewProfile(application)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
          >
            <User size={16} className="mr-2" />
            View Profile
          </button>
          {application?.resume && (
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
            >
              <FileText size={16} className="mr-2" />
              View Resume
            </a>
          )}
        </div>

        {application.status === 'applied' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onReject(application._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
            >
              <XCircle size={16} className="mr-2" />
              Reject
            </button>
            <button
              onClick={() => onAccept(application._id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center"
            >
              <CheckCircle size={16} className="mr-2" />
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
