// src/store/api/profileApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/profile',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Get job seeker profile
    getJobSeekerProfile: builder.query({
      query: () => '/jobseeker',
      providesTags: ['Profile'],
    }),

    // Create or update job seeker profile
    createOrUpdateJobSeekerProfile: builder.mutation({
      query: (profileData) => {
        const formData = new FormData();
        
        // Append file if exists
        if (profileData.resume) {
          formData.append('resume', profileData.resume);
        }
        
        // Append other data as JSON strings
        if (profileData.skills) {
          formData.append('skills', JSON.stringify(profileData.skills));
        }
        if (profileData.experience) {
          formData.append('experience', JSON.stringify(profileData.experience));
        }
        if (profileData.education) {
          formData.append('education', JSON.stringify(profileData.education));
        }

        return {
          url: '/jobseeker',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),

    // Get recruiter profile
    getRecruiterProfile: builder.query({
      query: () => '/recruiter',
      providesTags: ['Profile'],
    }),

    // Create or update recruiter profile
    createOrUpdateRecruiterProfile: builder.mutation({
      query: (profileData) => ({
        url: '/recruiter',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Get profile by user ID (public view)
    getProfileByUserId: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Profile', id: userId }],
    }),

    // Upload resume
    uploadResume: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('resume', file);
        return {
          url: '/upload-resume',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetJobSeekerProfileQuery,
  useCreateOrUpdateJobSeekerProfileMutation,
  useGetRecruiterProfileQuery,
  useCreateOrUpdateRecruiterProfileMutation,
  useGetProfileByUserIdQuery,
  useUploadResumeMutation,
} = profileApi;