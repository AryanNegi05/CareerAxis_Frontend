
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Search, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Shield, 
  Star,
  ArrowRight,
  Menu,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: "Smart Job Matching",
      description: "AI-powered algorithm matches you with the perfect job opportunities based on your skills and preferences."
    },
    {
      icon: <Users className="w-12 h-12 text-violet-600" />,
      title: "Connect with Recruiters",
      description: "Build meaningful connections with top recruiters and hiring managers in your industry."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-600" />,
      title: "Career Growth Tracking",
      description: "Track your career progress and get personalized recommendations for skill development."
    },
    {
      icon: <Shield className="w-12 h-12 text-orange-600" />,
      title: "Verified Companies",
      description: "All companies on our platform are verified and trusted by thousands of professionals."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Jobs" },
    { number: "25K+", label: "Companies" },
    { number: "100K+", label: "Job Seekers" },
    { number: "95%", label: "Success Rate" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      content: "CareerAxis helped me land my dream job at Google. The platform's matching algorithm is incredibly accurate!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Director at Meta",
      content: "As a recruiter, I've found the best candidates through CareerAxis. The quality of profiles is outstanding.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist at Netflix",
      content: "The career guidance and job recommendations were spot-on. I couldn't be happier with my new role!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-200">
        <Toolbar className="justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <Typography variant="h5" className="font-bold text-gray-900">
              CareerAxis
            </Typography>
          </div>
          
          {!isMobile ? (
            <div className="flex items-center space-x-4">
              <Button color="inherit" className="text-gray-700 hover:text-blue-600">
                Find Jobs
              </Button>
              <Button color="inherit" className="text-gray-700 hover:text-blue-600">
                For Recruiters
              </Button>
              <Button color="inherit" className="text-gray-700 hover:text-blue-600">
                About
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
                className="ml-4"
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <IconButton>
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box className="bg-gradient-to-br from-blue-50 via-white to-violet-50 py-20">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Find Your 
                <span className="text-blue-600"> Dream Job</span> with 
                <span className="text-violet-600"> CareerAxis</span>
              </Typography>
              <Typography 
                variant="h6" 
                className="text-gray-600 mb-8 text-lg leading-relaxed"
              >
                Connect with top employers, discover amazing opportunities, and take your career to the next level with our AI-powered job matching platform.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 mt-3">
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  endIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                >
                  Browse Jobs
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="relative">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Job Search Illustration" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">New Job Alert!</span>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box className="py-16 bg-white">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <div className="text-center">
                  <Typography variant="h3" className="font-bold text-blue-600 mb-2">
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600">
                    {stat.label}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="py-20 bg-gray-50">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CareerAxis?
            </Typography>
            <Typography variant="h6" className="text-gray-600 max-w-2xl mx-auto">
              We're not just another job board. We're your career partner, dedicated to helping you find the perfect opportunity.
            </Typography>
          </div>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <Typography variant="h5" className="font-semibold mb-3">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box className="py-20 bg-white">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </Typography>
            <Typography variant="h6" className="text-gray-600">
              Hear from professionals who found their dream jobs through CareerAxis
            </Typography>
          </div>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Typography variant="body1" className="text-gray-700 mb-6 italic">
                      "{testimonial.content}"
                    </Typography>
                    <div>
                      <Typography variant="h6" className="font-semibold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {testimonial.role}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className="py-20 bg-gradient-to-r from-blue-600 to-violet-600">
        <Container maxWidth="lg">
          <div className="text-center text-white">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Career?
            </Typography>
            <Typography variant="h6" className="mb-8 opacity-90">
              Join thousands of professionals who have found their perfect job through CareerAxis
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/signup')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                endIcon={<ChevronRight className="w-5 h-5" />}
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="py-12 bg-gray-900 text-white">
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-8 h-8 text-blue-400" />
                <Typography variant="h5" className="font-bold">
                  CareerAxis
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-400">
                Your trusted partner in finding the perfect career opportunity. 
                Connect, grow, and succeed with CareerAxis.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6" className="font-semibold mb-3">
                    For Job Seekers
                  </Typography>
                  <div className="space-y-2">
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Browse Jobs
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Career Advice
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Salary Guide
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6" className="font-semibold mb-3">
                    For Employers
                  </Typography>
                  <div className="space-y-2">
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Post Jobs
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Find Candidates
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Pricing
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Company
                  </Typography>
                  <div className="space-y-2">
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      About Us
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Contact
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Privacy Policy
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6" className="font-semibold mb-3">
                    Support
                  </Typography>
                  <div className="space-y-2">
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Help Center
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      Terms of Use
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 hover:text-white cursor-pointer">
                      FAQ
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <Typography variant="body2" className="text-gray-400">
              © 2024 CareerAxis. All rights reserved.
            </Typography>
          </div>
        </Container>
      </Box>
    </div>
  );
};

export default LandingPage;