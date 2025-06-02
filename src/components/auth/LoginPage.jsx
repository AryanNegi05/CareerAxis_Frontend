import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/api/authApi';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(login(formData)).then((data) => {
      console.log(data);
      
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(
          data.user.role === 'jobseeker'
            ? '/dashboard/jobseeker'
            : data.user.role === 'recruiter'
            ? '/dashboard/recruiter'
            : data.user.role === 'admin'
            ? '/dashboard/admin'
            : '/'
        );
      } else {
        console.error('Login failed or no user data.');
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Card Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to your CareerAxis account
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-500">New to CareerAxis?</span>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors relative group"
                >
                  Create account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Email Field */}
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

                {/* Password Field */}
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
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  <span className="flex items-center space-x-2">
                    <span>{loading ? 'Signing in...' : 'Sign in'}</span>
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
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
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

export default LoginPage;