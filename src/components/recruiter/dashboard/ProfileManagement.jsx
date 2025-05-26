import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
  Camera,
  Globe,
  Users,
  Calendar,
  Briefcase
} from 'lucide-react';
import { 
  getRecruiterProfile, 
  updateRecruiterProfile,
  
} from '../../../store/api/profileApi';
import {
  clearProfileError
} from '../../../store/features/profileSlice'

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    website: '',
    companySize: '',
    companyDescription: '',
    verificationDoc: null
  });
  const [showCompanyChangeWarning, setShowCompanyChangeWarning] = useState(false);
  const [originalCompany, setOriginalCompany] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { recruiterProfile, loading, error } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(getRecruiterProfile());
    console.log(recruiterProfile);
    return () => dispatch(clearProfileError());
  }, [dispatch]);

  useEffect(() => {
    if (user && recruiterProfile) {
      const profileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: recruiterProfile.phone || '',
        company: recruiterProfile.company || '',
        position: recruiterProfile.position || '',
        location: recruiterProfile.location || '',
        website: recruiterProfile.website || '',
        companySize: recruiterProfile.companySize || '',
        companyDescription: recruiterProfile.companyDescription || '',
        verificationDoc: null
      };
      setFormData(profileData);
      setOriginalCompany(recruiterProfile.company || '');
    }
  }, [user, recruiterProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check if company is being changed
    if (name === 'company' && value !== originalCompany) {
      setShowCompanyChangeWarning(true);
    } else if (name === 'company' && value === originalCompany) {
      setShowCompanyChangeWarning(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, JPEG, or PNG file.');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should be less than 5MB.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        verificationDoc: file
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // If company is changed and no verification document is provided
  if (formData.company !== originalCompany && !formData.verificationDoc) {
    alert('Please upload a verification document after changing the company.');
    return;
  }

  // Prepare data for submission
  const submitData = {};
  
  // Only include editable fields (exclude user fields)
  Object.keys(formData).forEach(key => {
    if (!['firstName', 'lastName', 'email'].includes(key)) {
      const value = formData[key];
      
      // Include non-empty values (but allow empty strings for clearing fields)
      if (value !== null && value !== undefined) {
        submitData[key] = value;
      }
    }
  });

  // Debug: Log what we're sending
  console.log("Submitting data:", submitData);
  
  // Check if we have a file
  if (submitData.verificationDoc && submitData.verificationDoc instanceof File) {
    console.log("File detected:", submitData.verificationDoc.name);
  }

  try {
    await dispatch(updateRecruiterProfile(submitData));
    setIsEditing(false);
    setShowCompanyChangeWarning(false);
    // Reset file input
    setFormData(prev => ({ ...prev, verificationDoc: null }));
    // Refresh profile data
    dispatch(getRecruiterProfile());
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

  const getVerificationStatusBadge = () => {
    const status = user?.verificationStatus;
    switch (status) {
      case 'verified':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Verified
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            Pending Verification
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-2" />
            Verification Rejected
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            Not Verified
          </div>
        );
    }
  };

  if (loading && !recruiterProfile) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{recruiterProfile?.position || 'Recruiter'}</p>
              <div className="mt-2">
                {getVerificationStatusBadge()}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Verification Status Messages */}
        {user?.verificationStatus === 'pending' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Verification Pending</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your account is currently under review. You'll receive an email once verification is complete.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.verificationStatus === 'rejected' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Verification Rejected</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Your verification was rejected. Please update your profile with correct verification documents and resubmit.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company Change Warning */}
        {showCompanyChangeWarning && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">Company Change Detected</h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>Changing your company will require re-verification. Your current applications may be affected until verification is complete.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="City, State, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Position/Title
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Senior Recruiter, HR Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Company Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://www.company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Company Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001+">1001+ employees</option>
                </select>
              </div>

              {/* Verification Document Upload */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Verification Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="verification-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            id="verification-upload"
                            name="verification-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, PNG, JPG up to 5MB
                      </p>
                      {formData.verificationDoc && (
                        <p className="text-sm text-green-600">
                          File selected: {formData.verificationDoc.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Company Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              placeholder="Brief description of your company, culture, and what makes it a great place to work..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            />
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;