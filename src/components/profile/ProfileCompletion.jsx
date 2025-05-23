import React from 'react';
import { 
  User, 
  CheckCircle, 
  Circle, 
  AlertTriangle,
  ArrowRight,
  Star,
  Award,
  FileText,
  Briefcase,
  GraduationCap,
  Phone,
  MapPin,
  Mail
} from 'lucide-react';

const ProfileCompletion = ({ profile, onProfileClick }) => {
  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profile) return { percentage: 0, completedItems: [], missingItems: [] };

    const items = [
      {
        key: 'fullName',
        label: 'Full Name',
        icon: User,
        completed: !!profile.fullName,
        required: true
      },
      {
        key: 'email',
        label: 'Email Address',
        icon: Mail,
        completed: !!profile.email,
        required: true
      },
      {
        key: 'phone',
        label: 'Phone Number',
        icon: Phone,
        completed: !!profile.phone,
        required: false
      },
      {
        key: 'location',
        label: 'Location',
        icon: MapPin,
        completed: !!profile.location,
        required: false
      },
      {
        key: 'bio',
        label: 'Professional Bio',
        icon: FileText,
        completed: !!profile.bio && profile.bio.length > 20,
        required: false
      },
      {
        key: 'skills',
        label: 'Skills',
        icon: Star,
        completed: !!profile.skills && profile.skills.length >= 3,
        required: true
      },
      {
        key: 'experience',
        label: 'Work Experience',
        icon: Briefcase,
        completed: !!profile.experience && profile.experience.length > 0,
        required: true
      },
      {
        key: 'education',
        label: 'Education',
        icon: GraduationCap,
        completed: !!profile.education && profile.education.length > 0,
        required: false
      },
      {
        key: 'resume',
        label: 'Resume Upload',
        icon: FileText,
        completed: !!profile.resumeUrl || !!profile.resume,
        required: true
      }
    ];

    const completedItems = items.filter(item => item.completed);
    const missingItems = items.filter(item => !item.completed);
    const requiredItems = items.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.completed);
    
    // Weight required items more heavily
    const totalWeight = requiredItems.length * 2 + (items.length - requiredItems.length);
    const completedWeight = completedRequired.length * 2 + (completedItems.length - completedRequired.length);
    
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    return { percentage, completedItems, missingItems, items };
  };

  const { percentage, completedItems, missingItems } = calculateCompletion();

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent! Your profile is complete.';
    if (percentage >= 80) return 'Great! Your profile is almost complete.';
    if (percentage >= 60) return 'Good progress! Add more details to stand out.';
    if (percentage >= 40) return 'Your profile needs more information.';
    return 'Complete your profile to get better job matches.';
  };

  const priorityMissingItems = missingItems.slice(0, 3); // Show top 3 missing items

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
        <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${getCompletionColor(percentage)}`}>
          {percentage >= 80 ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <AlertTriangle className="h-4 w-4 mr-1" />
          )}
          {percentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{getCompletionMessage(percentage)}</p>
      </div>

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            Completed ({completedItems.length})
          </h4>
          <div className="space-y-1">
            {completedItems.slice(0, 3).map((item) => (
              <div key={item.key} className="flex items-center text-sm text-gray-600">
                <item.icon className="h-3 w-3 text-green-500 mr-2" />
                <span>{item.label}</span>
                <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
              </div>
            ))}
            {completedItems.length > 3 && (
              <div className="text-xs text-gray-500 ml-5">
                +{completedItems.length - 3} more completed
              </div>
            )}
          </div>
        </div>
      )}

      {/* Missing Items */}
      {missingItems.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Circle className="h-4 w-4 text-gray-400 mr-1" />
            Missing ({missingItems.length})
          </h4>
          <div className="space-y-1">
            {priorityMissingItems.map((item) => (
              <div key={item.key} className="flex items-center text-sm text-gray-600">
                <item.icon className="h-3 w-3 text-gray-400 mr-2" />
                <span>{item.label}</span>
                {item.required && (
                  <span className="ml-auto text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Strength Indicator */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Strength</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.ceil(percentage / 20) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-600">
          {percentage >= 80 
            ? 'Strong profile - likely to get noticed by recruiters'
            : percentage >= 60
            ? 'Good profile - add more details to improve visibility'
            : 'Weak profile - complete missing sections to attract employers'
          }
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onProfileClick}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span>{percentage >= 90 ? 'View Profile' : 'Complete Profile'}</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </button>

      {/* Tips Section */}
      {percentage < 80 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="text-sm font-medium text-blue-900 mb-1 flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Pro Tips
          </h5>
          <ul className="text-xs text-blue-800 space-y-1">
            {percentage < 50 && (
              <li>• Add at least 3 relevant skills to your profile</li>
            )}
            {!profile?.bio && (
              <li>• Write a compelling bio to showcase your expertise</li>
            )}
            {(!profile?.experience || profile.experience.length === 0) && (
              <li>• Add your work experience to build credibility</li>
            )}
            {(!profile?.resumeUrl && !profile?.resume) && (
              <li>• Upload your resume to increase application success</li>
            )}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {percentage >= 90 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Excellent! Your profile is optimized for success.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;