// src/components/auth/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Eye, EyeOff, Briefcase, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useLoginMutation } from '../../store/api/authApi';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../../store/features/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await login(formData).unwrap();
      // Success - user will be redirected by useEffect
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const getErrorMessage = () => {
    if (loginError) {
      if (loginError.data?.error) {
        return loginError.data.error;
      }
      if (loginError.status === 401) {
        return 'Invalid email or password';
      }
      return 'Login failed. Please try again.';
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">
      <Container maxWidth="lg" className="py-8">
        {/* Back to Home Button */}
        <Button
          startIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-blue-600"
        >
          Back to Home
        </Button>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center min-h-screen">
          {/* Left Side - Branding */}
          {!isMobile && (
            <div className="flex-1 max-w-md">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                  <Briefcase className="w-12 h-12 text-blue-600" />
                  <Typography variant="h3" className="font-bold text-gray-900">
                    CareerAxis
                  </Typography>
                </div>
                <Typography variant="h4" className="font-bold text-gray-900 mb-4">
                  Welcome Back!
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-8 leading-relaxed">
                  Sign in to your account and continue your journey towards finding the perfect career opportunity.
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">✓</span>
                    </div>
                    <span className="text-gray-700">Access thousands of job opportunities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-semibold">✓</span>
                    </div>
                    <span className="text-gray-700">Connect with top recruiters</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✓</span>
                    </div>
                    <span className="text-gray-700">Track your application progress</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Login Form */}
          <div className="flex-1 max-w-md w-full">
            <Paper elevation={3} className="p-8 rounded-2xl">
              {isMobile && (
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    <Typography variant="h5" className="font-bold text-gray-900">
                      CareerAxis
                    </Typography>
                  </div>
                  <Typography variant="h5" className="font-bold text-gray-900">
                    Sign In
                  </Typography>
                </div>
              )}

              {!isMobile && (
                <div className="text-center mb-8">
                  <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                    Sign In
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Enter your credentials to access your account
                  </Typography>
                </div>
              )}

              {getErrorMessage() && (
                <Alert severity="error" className="mb-6">
                  {getErrorMessage()}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loginLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  className="mb-4"
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loginLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loginLoading}
                        >
                          {showPassword ? 
                            <EyeOff className="w-5 h-5 text-gray-400" /> : 
                            <Eye className="w-5 h-5 text-gray-400" />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="flex items-center justify-between">
                  <Button
                    variant="text"
                    size="small"
                    className="text-blue-600 hover:text-blue-700 p-0"
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loginLoading}
                  className="bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold"
                >
                  {loginLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <Divider className="my-8">
                <Typography variant="body2" className="text-gray-500 px-2">
                  or
                </Typography>
              </Divider>

              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  disabled={loginLoading}
                  className="py-3 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                >
                  <img 
                    src="/api/placeholder/20/20" 
                    alt="Google" 
                    className="w-5 h-5 mr-3"
                  />
                  Continue with Google
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  disabled={loginLoading}
                  className="py-3 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                >
                  <img 
                    src="/api/placeholder/20/20" 
                    alt="LinkedIn" 
                    className="w-5 h-5 mr-3"
                  />
                  Continue with LinkedIn
                </Button>
              </div>

              <Box className="text-center mt-8">
                <Typography variant="body2" className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-semibold no-underline hover:underline"
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;