import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../store/api/authApi';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, ArrowLeft, Check, Sparkles , Briefcase } from 'lucide-react';

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordMismatch(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep1Valid = () => {
    return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
  };

  const isStep2Valid = () => {
    return formData.email.trim() !== '' && formData.email.includes('@');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    dispatch(signup(formData)).then((data) => {
      console.log("successfull signup");
      console.log(data);
      
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(data.user.role === 'jobseeker' ? '/dashboard/jobseeker' : '/dashboard/recruiter');
      } else {
        console.error('Signup failed');
      }
    });
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg' 
                : 'border-gray-300 text-gray-400 bg-white'
            }`}>
              {currentStep > step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                currentStep > step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Personal Information";
      case 2: return "Account Details";
      case 3: return "Secure Your Account";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch(currentStep) {
      case 1: return "Let's start with your basic information";
      case 2: return "Choose your email and role";
      case 3: return "Create a strong password";
      default: return "";
    }
  };

  const renderStep1 = () => (
    <div className={`transition-all duration-500 transform ${
      currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'
    }`}>
      <div className="space-y-5">
        <div className="group">
          <label 
            htmlFor="firstName" 
            className={`block text-sm font-medium transition-colors duration-200 ${
              focusedField === 'firstName' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            First Name
          </label>
          <div className="mt-2 relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={`w-full px-4 py-3 pl-12 bg-gray-50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                focusedField === 'firstName'
                  ? 'border-blue-500 ring-blue-200 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField('')}
            />
            <User className={`h-5 w-5 absolute left-4 top-3.5 transition-colors duration-200 ${
              focusedField === 'firstName' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
        </div>

        <div className="group">
          <label 
            htmlFor="lastName" 
            className={`block text-sm font-medium transition-colors duration-200 ${
              focusedField === 'lastName' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            Last Name
          </label>
          <div className="mt-2 relative">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={`w-full px-4 py-3 pl-12 bg-gray-50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                focusedField === 'lastName'
                  ? 'border-blue-500 ring-blue-200 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField('')}
            />
            <User className={`h-5 w-5 absolute left-4 top-3.5 transition-colors duration-200 ${
              focusedField === 'lastName' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStep1Valid()}
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          <span className="flex items-center space-x-2">
            <span>Continue</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`transition-all duration-500 transform ${
      currentStep === 2 ? 'opacity-100 translate-x-0' : currentStep > 2 ? 'opacity-0 -translate-x-full absolute' : 'opacity-0 translate-x-full absolute'
    }`}>
      <div className="space-y-5">
        <div className="group">
          <label 
            htmlFor="email" 
            className={`block text-sm font-medium transition-colors duration-200 ${
              focusedField === 'email' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            Email Address
          </label>
          <div className="mt-2 relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-4 py-3 pl-12 bg-gray-50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                focusedField === 'email'
                  ? 'border-blue-500 ring-blue-200 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
            />
            <Mail className={`h-5 w-5 absolute left-4 top-3.5 transition-colors duration-200 ${
              focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
        </div>

        <div className="group">
          <label 
            htmlFor="role" 
            className={`block text-sm font-medium transition-colors duration-200 ${
              focusedField === 'role' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            I am a
          </label>
          <div className="mt-2 space-y-3">
  <div className="grid grid-cols-2 gap-3">
    {/* Job Seeker Card */}
    <div 
      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
        formData.role === 'jobseeker' 
          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
      }`}
      onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`p-2 rounded-lg transition-colors duration-300 ${
          formData.role === 'jobseeker' ? 'bg-blue-100' : 'bg-gray-200'
        }`}>
          <User className={`h-5 w-5 ${
            formData.role === 'jobseeker' ? 'text-blue-600' : 'text-gray-500'
          }`} />
        </div>
        <span className={`text-sm font-semibold transition-colors duration-300 ${
          formData.role === 'jobseeker' ? 'text-blue-700' : 'text-gray-600'
        }`}>
          Job Seeker
        </span>
        <p className={`text-xs leading-snug px-2 ${
          formData.role === 'jobseeker' ? 'text-blue-600' : 'text-gray-500'
        }`}>
          Find jobs, apply to opportunities, and manage your career path.
        </p>
        {formData.role === 'jobseeker' && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>

    {/* Recruiter Card */}
    <div 
      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
        formData.role === 'recruiter' 
          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
      }`}
      onClick={() => setFormData({ ...formData, role: 'recruiter' })}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`p-2 rounded-lg transition-colors duration-300 ${
          formData.role === 'recruiter' ? 'bg-blue-100' : 'bg-gray-200'
        }`}>
          <Briefcase className={`h-5 w-5 ${
            formData.role === 'recruiter' ? 'text-blue-600' : 'text-gray-500'
          }`} />
        </div>
        <span className={`text-sm font-semibold transition-colors duration-300 ${
          formData.role === 'recruiter' ? 'text-blue-700' : 'text-gray-600'
        }`}>
          Recruiter
        </span>
        <p className={`text-xs leading-snug px-2 ${
          formData.role === 'recruiter' ? 'text-blue-600' : 'text-gray-500'
        }`}>
          Post job openings, review applications, and hire top talent.
        </p>
        {formData.role === 'recruiter' && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  </div>
</div>

        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          type="button"
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStep2Valid()}
          className="group flex-1 flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <span className="flex items-center space-x-2">
            <span>Continue</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`transition-all duration-500 transform ${
      currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'
    }`}>
      <div className="space-y-5">
        <div className="group">
          <label 
            htmlFor="password" 
            className={`block text-sm font-medium transition-colors duration-200 ${
              focusedField === 'password' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            Password
          </label>
          <div className="mt-2 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                focusedField === 'password'
                  ? 'border-blue-500 ring-blue-200 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
            />
            <Lock className={`h-5 w-5 absolute left-4 top-3.5 transition-colors duration-200 ${
              focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="group">
          <label 
            htmlFor="confirmPassword" 
            className={`block text-sm font-medium transition-colors duration-200 ${
              focusedField === 'confirmPassword' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            Confirm Password
          </label>
          <div className="mt-2 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white ${
                focusedField === 'confirmPassword'
                  ? 'border-blue-500 ring-blue-200 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
            />
            <Lock className={`h-5 w-5 absolute left-4 top-3.5 transition-colors duration-200 ${
              focusedField === 'confirmPassword' ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          type="button"
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          <span className="flex items-center space-x-2">
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            {!loading && (
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            )}
          </span>
          {loading && (
            <div className="absolute right-4">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          {/* Card Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Join CareerAxis
              </h2>
              <p className="mt-2 text-gray-600">
                {getStepSubtitle()}
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-500">Already have an account?</span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors relative group"
                >
                  Sign in here
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {passwordMismatch && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Passwords do not match.</span>
                </div>
              )}

              <div className="relative min-h-[300px]">
                {renderStep1()}
                {renderStep2()}
                {renderStep3()}
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <button className="text-blue-600 hover:text-blue-700 underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;