import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Session } from "../../types";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
});

export const sessionsApiSlice = createApi({
  reducerPath: "sessionsApi",
  baseQuery,
  tagTypes: ["UserSessions"],
  endpoints: (builder) => ({
    // Get all sessions
    getAllSessions: builder.query<Session[], void>({
      query: () => "/sessions",
      providesTags: ["UserSessions"],
    }),
  }),
});

export const { useGetAllSessionsQuery } = sessionsApiSlice;
