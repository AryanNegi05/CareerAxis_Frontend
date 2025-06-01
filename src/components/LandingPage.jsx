import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Shield, 
  Star,
  ArrowRight,
  Menu,
  ChevronRight,
  X,
  Sparkles,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Job Matching",
      description: "The algorithm matches you with the perfect job opportunities based on your skills and preferences.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect with Recruiters",
      description: "Build meaningful connections with top recruiters and hiring managers in your industry.",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Get Detailed Analystics",
      description: "Track your career progress and get detailed analysis of jobs and applications.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Companies",
      description: "All companies on our platform are verified and trusted by thousands of professionals.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Jobs", icon: <Briefcase className="w-6 h-6" /> },
    { number: "25K+", label: "Companies", icon: <Target className="w-6 h-6" /> },
    { number: "100K+", label: "Job Seekers", icon: <Users className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Award className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      content: "CareerAxis helped me land my dream job at Google. The platform's matching algorithm is incredibly accurate!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Marketing Director at Meta",
      content: "As a recruiter, I've found the best candidates through CareerAxis. The quality of profiles is outstanding.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist at Netflix",
      content: "The career guidance and job recommendations were spot-on. I couldn't be happier with my new role!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'backdrop-blur-md bg-white/80 shadow-lg border-b border-gray-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                CareerAxis
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-105 transform">Find Jobs</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-105 transform">For Recruiters</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-105 transform">About</a>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-200 hover:scale-105 transform"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 transform"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg animate-fade-in">
              <div className="px-4 py-6 space-y-4">
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors duration-200">Find Jobs</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors duration-200">For Recruiters</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors duration-200">About</a>
                <div className="flex flex-col space-y-3 pt-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              {/* <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-full px-4 py-2 text-sm text-gray-600 border border-gray-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>AI-Powered Job Matching</span>
              </div> */}
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Find Your</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">Dream Job</span>
                <br />
                <span className="text-gray-900">with</span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent animate-gradient">CareerAxis</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Connect with top employers, discover amazing opportunities, and take your career to the next level with our job matching platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 transform">
                  Browse Jobs
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in-right">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-4/5"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-150 to-gray-100 rounded w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center space-x-2 text-white text-sm font-medium">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>New Job Alert!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-4 shadow-xl animate-float animation-delay-2000">
                <div className="flex items-center space-x-2 text-white text-sm font-medium">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>95% Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 transform group-hover:shadow-xl">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CareerAxis?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another job board. We're your career partner, dedicated to helping you find the perfect opportunity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 transform group-hover:shadow-xl h-full">
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-xl text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from professionals who found their dream jobs through CareerAxis
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 transform group-hover:shadow-xl h-full">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 border border-gray-200 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10"></div>
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of professionals who have found their perfect job through CareerAxis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/signup')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform flex items-center justify-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 transform">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  CareerAxis
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your trusted partner in finding the perfect career opportunity. 
                Connect, grow, and succeed with CareerAxis.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Browse Jobs</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Career Advice</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Salary Guide</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Employers</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Post Jobs</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Find Candidates</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Pricing</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 CareerAxis. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-right {
          from { 
            opacity: 0; 
            transform: translateX(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;