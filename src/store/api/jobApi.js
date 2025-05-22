// src/store/api/jobApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/jobs',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const jobApi = createApi({
  reducerPath: 'jobApi',
  baseQuery,
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    // Get all jobs
    getAllJobs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params).toString();
        return searchParams ? `/?${searchParams}` : '/';
      },
      providesTags: ['Job'],
    }),

    // Get job by ID
    getJobById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    // Get jobs by recruiter
    getJobsByRecruiter: builder.query({
      query: () => '/recruiter/my-jobs',
      providesTags: ['Job'],
    }),

    // Create job (recruiter only)
    createJob: builder.mutation({
      query: (jobData) => ({
        url: '/',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),

    // Update job
    updateJob: builder.mutation({
      query: ({ id, ...jobData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: jobData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }, 'Job'],
    }),

    // Delete job
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),

    // Search jobs
    searchJobs: builder.query({
      query: (searchParams) => {
        const params = new URLSearchParams(searchParams).toString();
        return `/search?${params}`;
      },
      providesTags: ['Job'],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetJobsByRecruiterQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useSearchJobsQuery,
} = jobApi;