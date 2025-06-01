import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Clock,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getPendingRecruiters, updateRecruiterVerification } from '../../../store/api/adminApi'

const PendingRecruiters = () => {
  const dispatch = useDispatch();
  const { pendingRecruiters, loading, error } = useSelector(state => state.admin);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(getPendingRecruiters());
    console.log(pendingRecruiters)
  }, [dispatch]);

  const handleVerifyRecruiter = async (recruiterId, action) => {
    setActionLoading(recruiterId);
    try {
      await dispatch(updateRecruiterVerification(recruiterId, action));
    } catch (error) {
      console.error('Error updating recruiter:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const openModal = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRecruiter(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && pendingRecruiters.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 animate-fadeIn">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading pending recruiters...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slideDown">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between animate-slideDown">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Pending Recruiters</h2>
          <p className="text-gray-600 mt-1">Review and approve recruiter applications</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md">
          {pendingRecruiters.length} Pending
        </div>
      </div>

      {pendingRecruiters.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200 animate-slideUp transition-all duration-300 hover:shadow-md">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending recruiter applications to review.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slideUp transition-all duration-300 hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recruiter
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRecruiters.map((recruiter, index) => (
                  <tr 
                    key={recruiter._id} 
                    className="hover:bg-gray-50 transition-all duration-200 animate-slideUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 hover:bg-blue-200">
                            <span className="text-sm font-medium text-blue-600">
                              {recruiter.firstName?.charAt(0)}{recruiter.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {recruiter.firstName} {recruiter.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {recruiter.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {recruiter.companyName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {recruiter.position || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(recruiter.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 transition-all duration-200 hover:bg-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal(recruiter)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleVerifyRecruiter(recruiter._id, 'verify')}
                        disabled={actionLoading === recruiter._id}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md transform hover:scale-105"
                      >
                        {actionLoading === recruiter._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyRecruiter(recruiter._id, 'reject')}
                        disabled={actionLoading === recruiter._id}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md transform hover:scale-105"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for viewing recruiter details */}
      {showModal && selectedRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6 bg-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recruiter Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-200"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
                <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedRecruiter.firstName} {selectedRecruiter.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedRecruiter.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedRecruiter.profile.phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Location</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedRecruiter.profile.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
                <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-green-600 rounded-full mr-3"></div>
                  Company Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Company Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedRecruiter.profile.company || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Position</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{selectedRecruiter.profile.postiion || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Company Description</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecruiter.profile.companyDescription || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Verification Document */}
              {selectedRecruiter.profile.verificationDocs.length > 0 && (
                <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
                  <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-purple-600 rounded-full mr-3"></div>
                    Verification Documents
                  </h4>
                  {selectedRecruiter.profile.verificationDocs.map((url, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-3 hover:border-blue-300 transition-all duration-200 hover:shadow-sm">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline transition-colors duration-200"
                          >
                            {`Document ${idx + 1}`}
                          </a>
                          <p className="text-xs text-gray-500">Click to view the uploaded file</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Application Date */}
              <div className="animate-slideUp" style={{ animationDelay: '400ms' }}>
                <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-orange-600 rounded-full mr-3"></div>
                  Application Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Applied On</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">{formatDate(selectedRecruiter.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Review
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleVerifyRecruiter(selectedRecruiter._id, 'reject');
                    closeModal();
                  }}
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  <XCircle className="h-4 w-4 mr-1 inline" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleVerifyRecruiter(selectedRecruiter._id, 'verify');
                    closeModal();
                  }}
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  <CheckCircle className="h-4 w-4 mr-1 inline" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default PendingRecruiters;