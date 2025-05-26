import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Users } from 'lucide-react';
import ApplicationCard from './ApplicationCards';
import ApplicantProfileModal from './ApplicationProfileModal';
import { getJobSeekerProfile } from '../../store/api/profileApi';

const ApplicationsView = ({ job, applications, onBack, onAccept, onReject }) => {
  const dispatch = useDispatch();
  const [selectedApplication, setSelectedApplication] = React.useState(null);

  const { jobSeekerProfile, loading } = useSelector((state) => state.profile);

  const handleViewProfile = (application) => {
    dispatch(getJobSeekerProfile(application.applicant._id));
    setSelectedApplication(application);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Applications for {job.title}</h2>
          <p className="text-gray-600">{applications.length} applications received</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Applications Yet</h3>
          <p className="text-gray-400">Applications will appear here once candidates apply for this job.</p>
        </div>
      ) : (
        <div>
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onAccept={onAccept}
              onReject={onReject}
              onViewProfile={() => handleViewProfile(application)}
            />
          ))}
        </div>
      )}

      {selectedApplication && jobSeekerProfile && (
        <ApplicantProfileModal
          application={selectedApplication}
          profile={jobSeekerProfile}
          onClose={() => setSelectedApplication(null)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ApplicationsView;
