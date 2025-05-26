import React from 'react';
import { Dialog } from '@headlessui/react';

const ApplicantProfileModal = ({ application, profile, onClose, loading }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white p-6 rounded shadow">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded shadow max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {application.applicant.firstName} {application.applicant.lastName}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <p><strong>Email:</strong> {application.applicant.email}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>

        <div className="mt-4">
          <h4 className="font-semibold">Skills</h4>
          <ul className="list-disc list-inside">
            {profile.skills?.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Education</h4>
          {profile.education?.map((edu, idx) => (
            <div key={idx} className="text-sm">
              <p>{edu.degree} — {edu.institution}</p>
              <p className="text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Experience</h4>
          {profile.experience?.map((exp, idx) => (
            <div key={idx} className="text-sm">
              <p>{exp.position} at {exp.company}</p>
              <p className="text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileModal;
