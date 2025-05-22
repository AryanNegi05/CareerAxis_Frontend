// src/store/api/applicationApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/applications',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery,
  tagTypes: ['Application'],
  endpoints: (builder) => ({
    // Apply for job
    applyForJob: builder.mutation({
      query: ({ jobId, ...applicationData }) => ({
        url: `/apply/${jobId}`,
        method: 'POST',
        body: applicationData,
      }),
      invalidatesTags: ['Application'],
    }),

    // Withdraw application
    withdrawApplication: builder.mutation({
      query: (appId) => ({
        url: `/withdraw/${appId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application'],
    }),

    // Accept application (recruiter)
    acceptApplication: builder.mutation({
      query: (appId) => ({
        url: `/accept/${appId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Application'],
    }),

    // Reject application (recruiter)
    rejectApplication: builder.mutation({
      query: (appId) => ({
        url: `/reject/${appId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Application'],
    }),

    // Get applications for a job (recruiter)
    getApplicationsForJob: builder.query({
      query: (jobId) => `/job/${jobId}`,
      providesTags: (result, error, jobId) => [
        { type: 'Application', id: `job-${jobId}` },
      ],
    }),

    // Get user's applied applications (job seeker)
    getAppliedApplications: builder.query({
      query: () => '/my-applications',
      providesTags: ['Application'],
    }),

    // Get application by ID
    getApplicationById: builder.query({
      query: (appId) => `/${appId}`,
      providesTags: (result, error, appId) => [{ type: 'Application', id: appId }],
    }),

    // Get all applications (recruiter - for their jobs)
    getAllApplicationsForRecruiter: builder.query({
      query: () => '/recruiter/all',
      providesTags: ['Application'],
    }),
  }),
});

export const {
  useApplyForJobMutation,
  useWithdrawApplicationMutation,
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
  useGetApplicationsForJobQuery,
  useGetAppliedApplicationsQuery,
  useGetApplicationByIdQuery,
  useGetAllApplicationsForRecruiterQuery,
} = applicationApi;