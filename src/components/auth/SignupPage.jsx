// src/components/auth/SignupPage.js
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import { 
  Eye, 
  EyeOff, 
  Briefcase, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Users,
  CheckCircle 
} from 'lucide-react';
import { useSignupMutation } from '../../store/api/authApi';
import { selectIsAuthenticated } from '../../store/features/authSlice';

const SignupPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [signup, { isLoading: signupLoading, error: signupError }] = useSignupMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const steps = ['Choose Role', 'Personal Info', 'Account Setup'];

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

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Role selection
        if (!formData.role) {
          newErrors.role = 'Please select your role';
        }
        break;
        
      case 1: // Personal info
        if (!formData.firstName) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        break;
        
      case 2: // Account setup
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!agreedToTerms) {
          newErrors.terms = 'You must agree to the terms and conditions';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    try {
      const result = await signup(formData).unwrap();
      console.log('Signup successful:', result);
      // Success - user will be redirected by useEffect
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const getErrorMessage = () => {
    if (signupError) {
      if (signupError.data?.error) {
        return signupError.data.error;
      }
      if (signupError.status === 409) {
        return 'An account with this email already exists';
      }
      return 'Signup failed. Please try again.';
    }
    return null;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                What brings you to CareerAxis?
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Choose your role to get started
              </Typography>
            </div>
            
            <FormControl component="fieldset" fullWidth error={!!errors.role}>
              <div className="space-y-4">
                <Paper 
                  elevation={formData.role === 'jobseeker' ? 3 : 1}
                  className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                    formData.role === 'jobseeker' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'jobseeker' }))}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      formData.role === 'jobseeker' ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <User className={`w-6 h-6 ${
                        formData.role === 'jobseeker' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Typography variant="h6" className="font-semibold">
                          Job Seeker
                        </Typography>
                        {formData.role === 'jobseeker' && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <Typography variant="body2" className="text-gray-600 mt-1">
                        Looking for your next career opportunity
                      </Typography>
                      <div className="mt-3 space-y-1">
                        <Typography variant="caption" className="text-gray-500 flex items-center">
                          • Browse thousands of job listings
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 flex items-center">
                          • Get matched with relevant opportunities
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 flex items-center">
                          • Track application progress
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Paper>

                <Paper 
                  elevation={formData.role === 'recruiter' ? 3 : 1}
                  className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                    formData.role === 'recruiter' 
                      ? 'border-violet-500 bg-violet-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'recruiter' }))}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      formData.role === 'recruiter' ? 'bg-violet-600' : 'bg-gray-200'
                    }`}>
                      <Users className={`w-6 h-6 ${
                        formData.role === 'recruiter' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Typography variant="h6" className="font-semibold">
                          Recruiter / Employer
                        </Typography>
                        {formData.role === 'recruiter' && (
                          <CheckCircle className="w-5 h-5 text-violet-600" />
                        )}
                      </div>
                      <Typography variant="body2" className="text-gray-600 mt-1">
                        Hiring talent for your organization
                      </Typography>
                      <div className="mt-3 space-y-1">
                        <Typography variant="caption" className="text-gray-500 flex items-center">
                          • Post job openings
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 flex items-center">
                          • Search and filter candidates
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 flex items-center">
                          • Manage hiring pipeline
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Paper>
              </div>
              {errors.role && (
                <Typography variant="caption" color="error" className="mt-2">
                  {errors.role}
                </Typography>
              )}
            </FormControl>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                Tell us about yourself
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                We'll use this information to personalize your experience
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={signupLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={signupLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={signupLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                Secure your account
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Create a strong password to protect your account
              </Typography>
            </div>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || 'Password must be at least 6 characters'}
              disabled={signupLoading}
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
                      disabled={signupLoading}
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={signupLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={signupLoading}
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="w-5 h-5 text-gray-400" /> : 
                        <Eye className="w-5 h-5 text-gray-400" />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={signupLoading}
                  />
                }
                label={
                  <Typography variant="body2" className="text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography variant="caption" color="error" className="mt-1">
                  {errors.terms}
                </Typography>
              )}
            </FormGroup>
          </div>
        );

      default:
        return null;
    }
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
                  Join CareerAxis Today
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-8 leading-relaxed">
                  Create your account and unlock access to thousands of career opportunities. Connect with top employers and take the next step in your professional journey.
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <span className="text-gray-700">Choose your role and goals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-semibold">2</span>
                    </div>
                    <span className="text-gray-700">Complete your profile setup</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">3</span>
                    </div>
                    <span className="text-gray-700">Start exploring opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Signup Form */}
          <div className="flex-1 max-w-lg w-full">
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
                    Create Account
                  </Typography>
                </div>
              )}

              {!isMobile && (
                <div className="text-center mb-8">
                  <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                    Create Account
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Join thousands of professionals on CareerAxis
                  </Typography>
                </div>
              )}

              {/* Stepper */}
              <Stepper activeStep={activeStep} className="mb-8">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{!isMobile ? label : ''}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {getErrorMessage() && (
                <Alert severity="error" className="mb-6">
                  {getErrorMessage()}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {renderStepContent(activeStep)}

                <div className="flex justify-between mt-8">
                  <Button
                    disabled={activeStep === 0 || signupLoading}
                    onClick={handleBack}
                    className="text-gray-600"
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={signupLoading}
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      {signupLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </form>

              {activeStep === 0 && (
                <>
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
                      disabled={signupLoading}
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
                      disabled={signupLoading}
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
                </>
              )}

              <Box className="text-center mt-8">
                <Typography variant="body2" className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 font-semibold no-underline hover:underline"
                  >
                    Sign in here
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

export default SignupPage;