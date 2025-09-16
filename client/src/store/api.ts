import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Session,
  User,
  UserSessionsResponse,
  UserEventsResponse,
  DashboardMetrics,
  RevenueData,
} from "../types";

// Define the base query with the API base URL
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
});

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "UserSessions", "UserEvents", "DashboardStats"],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    // Get a single user by ID
    getUserById: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // Get sessions for a specific user
    getUserSessions: builder.query<UserSessionsResponse, string>({
      query: (userId) => `/users/${userId}/sessions`,
      providesTags: (result, error, userId) => [
        { type: "UserSessions", id: userId },
        { type: "User", id: userId },
      ],
    }),

    // Get all sessions
    getAllSessions: builder.query<Session[], void>({
      query: () => "/sessions",
      providesTags: ["UserSessions"],
    }),

    // Get events for a specific user
    getUserEvents: builder.query<UserEventsResponse, string>({
      query: (userId) => `/users/${userId}/events`,
      providesTags: (result, error, userId) => [
        { type: "UserEvents", id: userId },
        { type: "User", id: userId },
      ],
    }),

    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardMetrics, void>({
      query: () => "/analytics/stats",
      providesTags: ["DashboardStats"],
    }),

    // Get revenue overtime
    getRevenueOverTime: builder.query<RevenueData[], void>({
      query: () => "/analytics/revenue",
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserSessionsQuery,
  useGetAllSessionsQuery,
  useGetUserEventsQuery,
  useGetDashboardStatsQuery,
  useGetRevenueOverTimeQuery,
} = apiSlice;
