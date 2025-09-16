import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Session,
  User,
  UserEventsResponse,
  UserSessionsResponse,
} from "../../types";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
});

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["User", "UserSessions", "UserEvents"],
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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserSessionsQuery,
  useGetAllSessionsQuery,
  useGetUserEventsQuery,
} = usersApiSlice;
