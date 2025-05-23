import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  Heart,
  ExternalLink,
  Clock,
  Users,
  Award,
  Target,
  Zap
} from 'lucide-react';

const JobRecommendations = ({ jobs, profile }) => {
  const [showAll, setShowAll] = useState(false);

  // Calculate job recommendation score based on profile
  const calculateJobScore = (job) => {
    let score = 0;
    let factors = [];

    if (!profile || !job) return { score: 0, factors: [] };

    // Skills matching
    if (profile.skills && profile.skills.length > 0 && job.requirements) {
      const profileSkills = profile.skills.map(s => s.toLowerCase());
      const jobRequirements = job.requirements.toLowerCase();
      const matchingSkills = profileSkills.filter(skill => 
        jobRequirements.includes(skill)
      );
      if (matchingSkills.length > 0) {
        const skillScore = (matchingSkills.length / profileSkills.length) * 30;
        score += skillScore;
        factors.push(`${matchingSkills.length} matching skills`);
      }
    }

    // Location matching
    if (profile.location && job.location) {
      const profileLocation = profile.location.toLowerCase();
      const jobLocation = job.location.toLowerCase();
      if (jobLocation.includes(profileLocation) || jobLocation.includes('remote')) {
        score += 20;
        factors.push('Location match');
      }
    }

    // Experience level matching
    if (profile.experience && profile.experience.length > 0 && job.experienceLevel) {
      const yearsOfExperience = profile.experience.length;
      const jobLevel = job.experienceLevel.toLowerCase();
      
      if ((yearsOfExperience <= 2 && jobLevel.includes('entry')) ||
          (yearsOfExperience > 2 && yearsOfExperience <= 5 && jobLevel.includes('mid')) ||
          (yearsOfExperience > 5 && jobLevel.includes('senior'))) {
        score += 25;
        factors.push('Experience level match');
      }
    }

    // Company size preference (if available)
    if (job.companySize) {
      score += 10;
      factors.push('Company info available');
    }

    // Job freshness (newer jobs get higher scores)
    const jobDate = new Date(job.createdAt);
    const now = new Date();
    const daysDiff = (now - jobDate) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 7) {
      score += 15;
      factors.push('Recently posted');
    } else if (daysDiff <= 30) {
      score += 10;
    }

    return { score: Math.min(100, Math.round(score)), factors };
  };

  // Get recommended jobs sorted by score
  const getRecommendedJobs = () => {
    if (!jobs || jobs.length === 0) return [];

    const jobsWithScores = jobs.map(job => ({
      ...job,
      ...calculateJobScore(job)
    }));

    return jobsWithScores
      .filter(job => job.score > 20) // Only show jobs with decent matches
      .sort((a, b) => b.score - a.score)
      .slice(0, showAll ? 10 : 4);
  };

  const recommendedJobs = getRecommendedJobs();

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}`;
    }
    return salary;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return Star;
    if (score >= 60) return Target;
    if (score >= 40) return TrendingUp;
    return Zap;
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Recommendations</h3>
          <Star className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No jobs available</h4>
          <p className="text-sm text-gray-500">Check back later for personalized job recommendations</p>
        </div>
      </div>
    );
  }

  if (recommendedJobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Recommendations</h3>
          <Star className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No matches found</h4>
          <p className="text-sm text-gray-500 mb-4">
            Complete your profile to get better job recommendations
          </p>
          <div className="text-xs text-gray-400">
            Try adding more skills, experience, or updating your location
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {recommendedJobs.length} matches
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          AI-powered
        </div>
      </div>

      <div className="space-y-4">
        {recommendedJobs.map((job) => {
          const ScoreIcon = getScoreIcon(job.score);
          
          return (
            <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-gray-900 text-base">{job.title}</h4>
                    <div className={`ml-3 flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(job.score)}`}>
                      <ScoreIcon className="h-3 w-3 mr-1" />
                      {job.score}% match
                    </div>
                  </div>
                  <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    {job.jobType && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.jobType}
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(job.salary)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(job.createdAt)}
                  </div>

                  {/* Match factors */}
                  {job.factors && job.factors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.factors.slice(0, 3).map((factor, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Job description preview */}
              {job.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {job.description.substring(0, 150)}...
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {job.applicants && (
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {job.applicants} applicants
                    </div>
                  )}
                  {job.urgent && (
                    <div className="flex items-center text-orange-600">
                      <Zap className="h-3 w-3 mr-1" />
                      Urgent hiring
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Quick Apply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more/less toggle */}
      {jobs.filter(job => calculateJobScore(job).score > 20).length > 4 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAll ? 'Show Less' : `Show More (${jobs.filter(job => calculateJobScore(job).score > 20).length - 4} more)`}
          </button>
        </div>
      )}

      {/* Recommendation tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <Award className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-blue-900 mb-1">
              Improve your recommendations
            </h5>
            <p className="text-xs text-blue-800">
              Keep your profile updated with relevant skills and experience to get better job matches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;