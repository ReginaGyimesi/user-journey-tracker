import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DailyActiveUsersData,
  DashboardMetrics,
  RevenueData,
} from "../../types";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
});

export const analyticsApiSlice = createApi({
  reducerPath: "analyticsApi",
  baseQuery,
  tagTypes: ["DashboardStats", "Revenue", "DailyActiveUsers"],
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardMetrics, void>({
      query: () => "/analytics/stats",
    }),

    // Get revenue overtime
    getRevenueOverTime: builder.query<RevenueData[], void>({
      query: () => "/analytics/revenue",
    }),

    // Get daily active users
    getDailyActiveUsers: builder.query<DailyActiveUsersData[], void>({
      query: () => "/analytics/daily-active-users",
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueOverTimeQuery,
  useGetDailyActiveUsersQuery,
} = analyticsApiSlice;
