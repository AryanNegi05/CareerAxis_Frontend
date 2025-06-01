import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Calendar, Briefcase, FileText, Building, Clock, Users } from 'lucide-react';

const EditJobModal = ({ isOpen, onClose, onSubmit, job }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salaryRange: {
      min: '',
      max: ''
    },
    jobType: 'full-time',
    applicationDeadline: '',
    status: 'open'
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Populate form when job data is available
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        salaryRange: {
          min: job.salaryRange?.min || '',
          max: job.salaryRange?.max || ''
        },
        jobType: job.jobType || 'full-time',
        applicationDeadline: job.applicationDeadline 
          ? new Date(job.applicationDeadline).toISOString().split('T')[0] 
          : '',
        status: job.status || 'open'
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'salaryMin' || name === 'salaryMax') {
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name === 'salaryMin' ? 'min' : 'max']: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Clean up the data before submission
      const submitData = {
        ...formData,
        salaryRange: {
          min: parseInt(formData.salaryRange.min) || 0,
          max: parseInt(formData.salaryRange.max) || 0
        }
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <>
      {/* Backdrop with enhanced animation */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 to-blue-900/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 animate-fade-in">
        {/* Modal Container */}
        <div className="min-h-screen px-4 text-center flex items-center justify-center">
          <div className="relative inline-block w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 transform transition-all duration-500 animate-scale-in overflow-hidden">
              
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Edit Job
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Update job details and requirements</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="group p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-8">
                  
                  {/* Job Title Section */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                        focusedField === 'title' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50'
                      }`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('title')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  {/* Job Description Section */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                        focusedField === 'description' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-green-50'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      Job Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white resize-none"
                      placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity special..."
                    />
                  </div>

                  {/* Two Column Layout for Location and Job Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div className="group">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                          focusedField === 'location' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-gray-100 text-gray-500 group-hover:bg-purple-50'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('location')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
                        placeholder="e.g. New York, NY or Remote"
                      />
                    </div>

                    {/* Job Type */}
                    <div className="group">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                          focusedField === 'jobType' 
                            ? 'bg-indigo-100 text-indigo-600' 
                            : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50'
                        }`}>
                          <Building className="w-4 h-4" />
                        </div>
                        Job Type
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('jobType')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white cursor-pointer"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                  </div>

                  {/* Job Status Section */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                        focusedField === 'status' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-yellow-50'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      Job Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('status')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white cursor-pointer"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Salary Range Section */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                        focusedField === 'salary' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-green-50'
                      }`}>
                        <DollarSign className="w-4 h-4" />
                      </div>
                      Salary Range (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group/input">
                        <input
                          type="number"
                          name="salaryMin"
                          value={formData.salaryRange.min}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('salary')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
                          placeholder="Minimum salary"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm">₹</span>
                        </div>
                      </div>
                      <div className="relative group/input">
                        <input
                          type="number"
                          name="salaryMax"
                          value={formData.salaryRange.max}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('salary')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
                          placeholder="Maximum salary"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm">₹</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Deadline */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                        focusedField === 'deadline' 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-orange-50'
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      Application Deadline (Optional)
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('deadline')}
                      onBlur={() => setFocusedField(null)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
                    />
                  </div>

                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Changes will be reflected immediately</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !formData.title.trim()}
                      className="group relative px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                    >
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        </div>
                      )}
                      <span className={loading ? 'opacity-0' : 'opacity-100'}>
                        ✏️ Update Job
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </>
  );
};

export default EditJobModal;