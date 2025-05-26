import React from 'react';
import { Building, Users, Edit, Trash2, MapPin, DollarSign, Clock, Calendar } from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, onViewApplications }) => {
  console.log(job);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building size={16} className="mr-2" />
            <span>{job.company || 'Not Specified'}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewApplications(job)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            title="View Applications"
          >
            <Users size={18} />
          </button>
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md"
            title="Edit Job"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(job._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            title="Delete Job"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={14} className="mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={14} className="mr-2" />
          <span><span>
  {job.salaryRange
    ? `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}`
    : 'Not specified'}
</span>
</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={14} className="mr-2" />
          <span>{job.jobType}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-2" />
          <span>Deadline: {formatDate(job.applicationDeadline)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-sm text-gray-500">
          Posted: {formatDate(job.createdAt)}
        </span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {job.applicationsCount || 0} Applications
        </span>
      </div>
    </div>
  );
};

export default JobCard;
