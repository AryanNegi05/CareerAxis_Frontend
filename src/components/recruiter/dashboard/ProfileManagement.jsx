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
  Briefcase,
  Shield,
  Star,
  Award
} from 'lucide-react';
import { 
  getRecruiterProfile, 
  updateRecruiterProfile,
  
} from '../../../store/api/profileApi';
import {
  clearProfileError
} from '../../../store/features/profileSlice'
import {
  getAllRecruiterApplications
} from '../../../store/api/applicationApi';

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
  const {myApplications , loading : applicationLoading  } = useSelector(state => state.applications);

  useEffect(() => {
    dispatch(getRecruiterProfile());
    console.log(recruiterProfile);
    dispatch(getAllRecruiterApplications());
    console.log(myApplications);
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

  
  if (formData.company !== originalCompany && myApplications.length > 0) {
    alert('You are required to handle all your applications before changing your company');
    return;
  }

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
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm animate-pulse-subtle">
            <CheckCircle className="w-4 h-4 mr-2" />
            <Award className="w-3 h-3 mr-1" />
            Verified
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200 shadow-sm animate-bounce-subtle">
            <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
            Pending Verification
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-sm">
            <XCircle className="w-4 h-4 mr-2" />
            Verification Rejected
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 shadow-sm">
            <Shield className="w-4 h-4 mr-2" />
            Not Verified
          </div>
        );
    }
  };

  if (loading && !recruiterProfile) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in">
        <div className="animate-pulse">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-28"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Enhanced Profile Header */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-xl text-gray-600 font-medium">
                  {recruiterProfile?.position || 'Recruiter'} 
                  {recruiterProfile?.company && (
                    <span className="text-gray-400"> • {recruiterProfile.company}</span>
                  )}
                </p>
                <div className="flex items-center space-x-3">
                  {getVerificationStatusBadge()}
                  {recruiterProfile?.location && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {recruiterProfile.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                isEditing 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100 border-2 border-red-200' 
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200'
              }`}
            >
              <Edit3 className={`w-4 h-4 mr-2 transition-transform duration-300 ${isEditing ? 'rotate-180' : ''}`} />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {/* Enhanced Status Messages */}
          <div className="space-y-4">
            {user?.verificationStatus === 'pending' && (
              <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl p-5 shadow-sm animate-slide-down">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-yellow-500 animate-pulse" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Verification In Progress</h3>
                    <p className="text-yellow-700">Your account is currently under review. This typically takes 1-2 business days.</p>
                  </div>
                </div>
              </div>
            )}

            {user?.verificationStatus === 'rejected' && (
              <div className="bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border-l-4 border-red-400 rounded-xl p-5 shadow-sm animate-slide-down">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <XCircle className="h-6 w-6 text-red-500 animate-bounce" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Verification Rejected</h3>
                    <p className="text-red-700">Your verification was rejected. Please update your profile with correct verification documents and resubmit for review.</p>
                  </div>
                </div>
              </div>
            )}

            {showCompanyChangeWarning && (
              <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-l-4 border-orange-400 rounded-xl p-5 shadow-sm animate-slide-down">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-orange-500 animate-pulse" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Company Change Detected</h3>
                    <p className="text-orange-700">Changing your company will require re-verification. Your current applications may be affected until verification is complete.</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-xl p-5 shadow-sm animate-slide-down">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Profile Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="space-y-5">
                {/* First Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="City, State, Country"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Company Information</h3>
              </div>
              
              <div className="space-y-5">
                {/* Company Name */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Building className="w-4 h-4 mr-2 text-blue-500" />
                    Company Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                {/* Position */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                    Position/Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Senior Recruiter, HR Manager"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4 mr-2 text-green-500" />
                    Company Website
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="https://www.company.com"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Company Size */}
                <div className="group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 mr-2 text-orange-500" />
                    Company Size
                  </label>
                  <div className="relative">
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
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
                </div>

                {/* Verification Document Upload */}
                {isEditing && (
                  <div className="group animate-fade-in">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                      Verification Document
                    </label>
                    <div className="relative">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300 group-hover:bg-blue-50/30">
                        <div className="space-y-3">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="verification-upload" className="cursor-pointer">
                              <span className="text-lg font-semibold text-blue-600 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-600 transition-all duration-300">Upload a file</span>
                              <input
                                id="verification-upload"
                                name="verification-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                            <p className="text-gray-600">or drag and drop</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            PDF, PNG, JPG up to 5MB
                          </p>
                          {formData.verificationDoc && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm font-medium text-green-800 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                File selected: {formData.verificationDoc.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Description - Continuing from where it left off */}
          <div className="mt-8 group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <FileText className="w-4 h-4 mr-2 text-indigo-500" />
              Company Description
            </label>
            <div className="relative">
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                placeholder="Brief description of your company, culture, and what makes it a great place to work..."
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 resize-none ${
                  isEditing 
                    ? 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 group-hover:shadow-md' 
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {formData.companyDescription?.length || 0}/500 characters
              </div>
            </div>
          </div>

          {/* Enhanced Form Actions */}
          {isEditing && (
            <div className="mt-10 pt-8 border-t border-gray-100 animate-slide-up">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  All changes are securely saved and encrypted
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowCompanyChangeWarning(false);
                      // Reset form data to original values
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
                      }
                    }}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel Changes
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 border border-transparent rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative flex items-center">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                          Save Changes
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Enhanced Profile Statistics Card */}
      <div className="bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm overflow-hidden animate-fade-in-up">
        <div className="relative p-8">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Profile Statistics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Completion */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-3 transition-transform duration-300">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (Object.values(formData).filter(value => 
                        value !== null && value !== undefined && value !== ''
                      ).length / Object.keys(formData).length) * 100
                    )}%
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Profile Complete</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.round(
                        (Object.values(formData).filter(value => 
                          value !== null && value !== undefined && value !== ''
                        ).length / Object.keys(formData).length) * 100
                      )}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Applications Count */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-3 transition-transform duration-300">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {myApplications?.length || 0}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Active Applications</h4>
                <p className="text-sm text-gray-600">Total job applications</p>
              </div>

              {/* Verification Status */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-3 transition-transform duration-300 ${
                    user?.verificationStatus === 'verified' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : user?.verificationStatus === 'pending'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    user?.verificationStatus === 'verified' 
                      ? 'bg-green-500 animate-pulse' 
                      : user?.verificationStatus === 'pending'
                      ? 'bg-yellow-500 animate-bounce'
                      : 'bg-gray-400'
                  }`}></div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Verification</h4>
                <p className="text-sm text-gray-600 capitalize">
                  {user?.verificationStatus || 'Not verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tips Card */}
      <div className="bg-gradient-to-br from-white via-emerald-50/20 to-blue-50/20 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm overflow-hidden animate-fade-in-up">
        <div className="relative p-8">
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 rounded-full translate-y-20 -translate-x-20"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Profile Tips</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Complete Your Profile</h4>
                    <p className="text-sm text-gray-600">A complete profile increases your credibility with job seekers.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Get Verified</h4>
                    <p className="text-sm text-gray-600">Verified recruiters have higher success rates in attracting candidates.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Company Details</h4>
                    <p className="text-sm text-gray-600">Add comprehensive company information to build trust.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Professional Image</h4>
                    <p className="text-sm text-gray-600">Maintain a professional online presence across all platforms.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;