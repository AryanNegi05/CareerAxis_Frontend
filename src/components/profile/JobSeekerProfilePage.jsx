import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Upload, 
  Save, 
  ArrowLeft,
  Edit3,
  Plus,
  X,
  CheckCircle,
  Star,
  AlertCircle
} from 'lucide-react';
import { updateJobSeekerProfile } from '../../store/api/profileApi';

const ProfilePage = ({ onBack, profile, loading, error }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    resume: null
  });
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false
  });
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false
  });
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.user.firstName || '',
        email: profile.user.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        resume: null
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }));
      setNewExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false
      });
      setShowAddExperience(false);
    }
  };

  const handleRemoveExperience = (expId) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== expId)
    }));
  };

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation, id: Date.now() }]
      }));
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false
      });
      setShowAddEducation(false);
    }
  };

  const handleRemoveEducation = (eduId) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== eduId)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateJobSeekerProfile(formData));
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 7;
    
    if (profile?.phone) completed++;
    if (profile?.location) completed++;
    if (profile?.bio) completed++;
    if (profile?.skills?.length > 0) completed++;
    if (profile?.experience?.length > 0) completed++;
    if (profile?.education?.length > 0) completed++;
    if (profile?.resume) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 shadow-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">
                {profile?.user?.firstName?.charAt(0)?.toUpperCase()}{profile?.user?.lastName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.user?.firstName} {profile?.user?.lastName}
              </h1>
              <p className="text-gray-600">{profile?.user?.email}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">Profile {calculateProfileCompletion()}% complete</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-gray-100 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${calculateProfileCompletion()}%` }}
          ></div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md animate-fade-in">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-slide-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">
                {(profile?.user?.firstName && profile?.user?.lastName)
                  ? `${profile.user.firstName} ${profile.user.lastName}`
                  : 'Not provided'}
              </p>
            </div>
          </div>
          
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{profile?.user?.email || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter phone number"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
              </div>
            )}
          </div>
          
          <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            {isEditing ? (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter location"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{profile?.location || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
              <p className="text-gray-900">{profile?.bio || 'No bio provided'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md animate-fade-in">
        <div className="flex items-center mb-4">
          <Award className="h-5 w-5 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {formData.skills.length} skills
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className={`animate-fade-in px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm flex items-center transition-all duration-200 hover:shadow-md transform hover:scale-105 ${
                isEditing ? 'pr-2' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200 hover:bg-red-100 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex gap-3 animate-slide-in">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add a skill"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
            />
            <button
              onClick={handleAddSkill}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
            <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {formData.experience.length} positions
            </span>
          </div>
          {isEditing && (
            <button
              onClick={() => setShowAddExperience(true)}
              className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Experience
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div 
              key={exp.id || index} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{exp.position}</h3>
                  <p className="text-green-600 font-medium">{exp.company}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showAddExperience && (
          <div className="border-t border-gray-200 pt-6 mt-6 animate-slide-down">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Plus className="h-4 w-4 mr-2 text-green-600" />
              Add Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Company"
                value={newExperience.company}
                onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              <input
                type="text"
                placeholder="Position"
                value={newExperience.position}
                onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newExperience.startDate}
                onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              {!newExperience.current && (
                <input
                  type="date"
                  placeholder="End Date"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
                />
              )}
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={newExperience.current}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Current Position</span>
              </label>
            </div>
            
            <textarea
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 transition-all duration-200 hover:border-gray-400"
              rows={3}
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleAddExperience}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                Add Experience
              </button>
              <button
                onClick={() => setShowAddExperience(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {formData.education.length} degrees
            </span>
          </div>
          {isEditing && (
            <button
              onClick={() => setShowAddEducation(true)}
              className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Education
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.education.map((edu, index) => (
            <div 
              key={edu.id || index} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{edu.degree}</h3>
                  <p className="text-green-600 font-medium">{edu.institution}</p>
                  {edu.field && <p className="text-gray-700 mt-1">{edu.field}</p>}
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        
{showAddEducation && (
          <div className="border-t border-gray-200 pt-6 mt-6 animate-slide-down">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Plus className="h-4 w-4 mr-2 text-green-600" />
              Add Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Institution"
                value={newEducation.institution}
                onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              <input
                type="text"
                placeholder="Degree"
                value={newEducation.degree}
                onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={newEducation.field}
                onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newEducation.startDate}
                onChange={(e) => setNewEducation(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              />
              {!newEducation.current && (
                <input
                  type="date"
                  placeholder="End Date"
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
                />
              )}
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={newEducation.current}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, current: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Currently Studying</span>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddEducation}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                Add Education
              </button>
              <button
                onClick={() => setShowAddEducation(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resume */}
      <div className="bg-white rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-md animate-fade-in">
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
        </div>
        
        {isEditing ? (
          <div className="animate-slide-in">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-all duration-200">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <label className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors duration-200">
                    Upload Resume
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600 mt-2">PDF format, max 5MB</p>
              </div>
            </div>
            {formData.resume && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Resume ready to upload</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 shadow-md">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {profile?.resume ? 'Resume uploaded' : 'No resume uploaded'}
                </p>
                <p className="text-sm text-gray-600">PDF format</p>
              </div>
            </div>
            {profile?.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Resume
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

        