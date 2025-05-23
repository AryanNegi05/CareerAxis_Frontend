import React from 'react';
import { FileText, Eye, Users, Star } from 'lucide-react';

const StatsCards = ({ applications, profile }) => {
  const stats = [
    { 
      title: 'Applications Sent', 
      value: applications?.length || 0, 
      icon: FileText, 
      color: 'bg-blue-500',
      trend: applications?.filter(app => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(app.appliedAt) > weekAgo;
      }).length > 0 ? `+${applications.filter(app => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(app.appliedAt) > weekAgo;
      }).length} this week` : 'No new applications'
    },
    { 
      title: 'Profile Views', 
      value: profile?.profileViews || 0, 
      icon: Eye, 
      color: 'bg-green-500',
      trend: '+5 this week'
    },
    { 
      title: 'Interview Invites', 
      value: applications?.filter(app => app.status === 'accepted').length || 0, 
      icon: Users, 
      color: 'bg-purple-500',
      trend: applications?.filter(app => app.status === 'accepted').length > 0 ? '+1 this week' : 'No invites yet'
    },
    { 
      title: 'Saved Jobs', 
      value: profile?.savedJobs?.length || 0, 
      icon: Star, 
      color: 'bg-yellow-500',
      trend: '+3 this week'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;