import React from 'react';
import { MapPin, DollarSign, Clock, Star ,Briefcase} from 'lucide-react';

const JobCard = ({ job, applications, onApply }) => {
  const isApplied = applications?.some(app => app.jobId?._id === job._id || app.job?.title === job.title);
  console.log(job);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium mb-3">{job.company}</p>
          </div>
          {isApplied && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Applied
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>{job.location}</span>
          </div>
          {job.salaryRange && job.salaryRange.min != null && job.salaryRange.max != null && (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <DollarSign className="h-4 w-4 text-green-500" />
    <span className="text-sm text-gray-600">
      ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
    </span>
  </div>
)}

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4 text-purple-500" />
            <span>{job.jobType || 'Full-time'}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {job.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'}
          </span>
          <div className="flex items-center space-x-3">
            {/* <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              View Details
            </button> */}
            {!isApplied && (
              <button
                onClick={() => onApply(job)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobCard;