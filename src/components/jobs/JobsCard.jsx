import React from 'react';
import { MapPin, DollarSign, Clock, Star } from 'lucide-react';

const JobCard = ({ job, applications, onApply }) => {
  // console.log(job);
  // console.log(applications)
  const isApplied = applications?.some(app => app.jobId?._id === job._id || app.job?.title === job.title);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 mb-2">{job.company}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
            </span>
            {job.salary && (
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {typeof job.salary === 'number' 
                  ? `$${job.salary.toLocaleString()}` 
                  : job.salary
                }
              </span>
            )}
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {job.jobType || 'Full-time'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className="text-xs text-gray-500">
            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'}
          </span>
          {isApplied ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Applied
            </span>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
        {job.description || 'No description available'}
      </p>
      <div className="flex justify-between items-center text-sm">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View Details
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Star className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;