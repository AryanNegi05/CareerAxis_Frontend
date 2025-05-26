import React from 'react';
import { X } from 'lucide-react';

const ApplicationModal = ({ 
  job, 
  isOpen, 
  onClose, 
  onSubmit, 
  applicationData, 
  setApplicationData, 
  loading 
}) => {
  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {

    e.preventDefault();
    console.log("submit application data",job._id , applicationData);
    onSubmit(job._id, applicationData);
  };

  console.log(job);
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Apply for {job.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{job.company}</h3>
          <p className="text-gray-600 text-sm">
            {job.location} • {job.jobType || 'Full-time'}
          </p>
          {job.salary && (
            <p className="text-gray-600 text-sm">
              Salary: {typeof job.salary === 'number' 
                ? `$${job.salary.toLocaleString()}` 
                : job.salary
              }
            </p>
          )}
        </div>

        {job.description && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
              {job.description}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData({ 
                ...applicationData, 
                coverLetter: e.target.value 
              })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell the employer why you're the perfect fit for this role..."
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={loading || !applicationData.coverLetter.trim()}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;