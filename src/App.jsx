import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch , useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginSuccess } from './store/features/authSlice';

import { CircularProgress, Box } from '@mui/material';
import JobSeekerDashboard from './components/dashboard/JobSeekerBoard';
import RecruiterDashboard from './components/recruiter/dashboard/RecruiterDashboard'
import AdminDashboard from './components/Admin/dashboard/AdminDashboard';
// Components
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ProtectedRoute from './components/ProtectedRoutes';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
    secondary: { main: '#7c3aed', light: '#8b5cf6', dark: '#6d28d9' },
    background: { default: '#f8fafc' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
});

const LoadingScreen = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" className="bg-slate-50">
    <CircularProgress size={40} color="primary" />
  </Box>
);

function App() {
    const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      dispatch(loginSuccess({
        user: JSON.parse(userData),
        token: token
      }));
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
  path="/login" 
  element={
    isAuthenticated ? (
      <Navigate 
        to={
          user?.role === 'jobseeker' 
            ? '/dashboard/jobseeker' 
            : user?.role === 'recruiter' 
              ? '/dashboard/recruiter' 
              : user?.role === 'admin'
                ? '/dashboard/admin'
                : '/'  // fallback if role is none of the above
        } 
      />
    ) : (
      <LoginPage />
    )
  } 
/>

          <Route 
            path="/signup" 
            element={
              // isAuthenticated ? (
              //   <Navigate to={user?.role === 'jobseeker' ? '/dashboard/jobseeker' : '/dashboard/recruiter'} />
              // ) : (
                
              // )
              <SignupPage />
            } 
          />
          <Route
            path="/dashboard/jobseeker"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
          

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
