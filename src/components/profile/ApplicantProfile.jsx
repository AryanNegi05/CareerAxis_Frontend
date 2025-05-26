// Applicant Profile Modal
const ApplicantProfileModal = ({ application, onClose }) => {
  if (!application) return null;

  const { applicant, profile } = application;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Applicant Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{applicant.firstName} {applicant.lastName}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3" />
                    <span className="text-sm">{applicant.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-3" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-3" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                </div>

                {profile?.bio && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Bio</h4>
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {profile?.skills && profile.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile?.experience && profile.experience.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Experience</h4>
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-gray-800">{exp.position}</h5>
                        <p className="text-blue-600 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-sm">{exp.duration}</p>
                        {exp.description && (
                          <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile?.education && profile.education.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Education</h4>
                  <div className="space-y-3">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-medium text-gray-800">{edu.degree}</h5>
                        <p className="text-green-600 text-sm">{edu.institution}</p>
                        <p className="text-gray-500 text-sm">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};