import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React, { FC } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useApiError } from "../hooks/useApiError";
import {
  useGetUserByIdQuery,
  useGetUserEventsQuery,
  useGetUserSessionsQuery,
} from "../store/api";
import { SessionsTable } from "./common/SessionsTable";
import { MetricCardsSection } from "./common/MetricCardsSection";
import { getRecentSessionEvents } from "../utils/helpers";

export const UserJourneyTracker: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetUserByIdQuery(userId!, { skip: !userId });

  const {
    data: userSessions,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useGetUserSessionsQuery(userId!, { skip: !userId });

  const {
    data: userEvents,
    isLoading: eventsLoading,
    error: eventsError,
  } = useGetUserEventsQuery(userId!, { skip: !userId });

  const loading = userLoading || sessionsLoading || eventsLoading;
  const error = userError || sessionsError || eventsError;
  const errorMessage = useApiError(error as FetchBaseQueryError | undefined);

  const metrics = [
    { key: userSessions?.session_count || 0, label: "All time sessions" },
    { key: userEvents?.event_count || 0, label: "All time events" },
    {
      key: userEvents?.avg_time_spent_seconds
        ? (userEvents.avg_time_spent_seconds / 60).toFixed(2)
        : 0,
      label: "Avg. minutes spent",
    },
    { key: userEvents?.all_time_purchases, label: "All time purchases" },
  ];

  const { recentEvent, sessionEvents } = getRecentSessionEvents(
    userEvents?.events
  );

  console.log(sessionEvents);

  if (loading) {
    return (
      <UserJourneyContainer>
        <LoadingMessage>Loading user details...</LoadingMessage>
      </UserJourneyContainer>
    );
  }

  if (error) {
    return (
      <UserJourneyContainer>
        <ErrorMessage>Error loading user: {errorMessage}</ErrorMessage>
      </UserJourneyContainer>
    );
  }

  if (!user) {
    return (
      <UserJourneyContainer>
        <ErrorMessage>User not found</ErrorMessage>
      </UserJourneyContainer>
    );
  }

  return (
    <UserJourneyContainer>
      <UserProfileHeader>
        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>
        <UserID>User ID: {user._id}</UserID>
      </UserProfileHeader>

      <MetricCardsSection
        stats={metrics}
        statsLoading={sessionsLoading || eventsLoading}
      />

      <SessionsTable
        sessions={userSessions?.sessions || []}
        title="All time sessions"
        showUserColumn={false}
      />

      <RecentEventSection>
        <SectionTitle>
          Most recent session:{" "}
          {recentEvent
            ? new Date(recentEvent.timestamp).toLocaleString()
            : "No session started"}
        </SectionTitle>

        {sessionEvents.length > 1 && (
          <SessionEventsSection>
            <JourneyFlow>
              {sessionEvents.map((event, index) => (
                <React.Fragment key={event._id}>
                  <FlowStep>{event.event_type}</FlowStep>
                  {index < sessionEvents.length - 1 && <FlowArrow>→</FlowArrow>}
                </React.Fragment>
              ))}
            </JourneyFlow>
          </SessionEventsSection>
        )}
      </RecentEventSection>

      <AllEventsSection>
        <SectionTitle>All events ({userEvents?.event_count || 0})</SectionTitle>
        <EventsTable>
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Timestamp</th>
              <th>Session ID</th>
              <th>Page/Item</th>
              <th>Time Spent</th>
              <th>Search Query</th>
            </tr>
          </thead>
          <tbody>
            {userEvents?.events.map((event) => (
              <tr key={event._id}>
                <td>{event.event_type}</td>
                <td>{new Date(event.timestamp).toLocaleString()}</td>
                <td>{event.session_id}</td>
                <td>
                  {event.metadata.page_id || event.metadata.item_id || "-"}
                </td>
                <td>
                  {event.metadata.time_spent_seconds
                    ? `${event.metadata.time_spent_seconds}s`
                    : "-"}
                </td>
                <td>{event.metadata.search_query || "-"}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#666" }}>
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </EventsTable>
      </AllEventsSection>
    </UserJourneyContainer>
  );
};

const UserJourneyContainer = styled.div`
  flex: 1;
  padding: 20px;
  font-family: Arial, sans-serif;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const UserProfileHeader = styled.div`
  margin-bottom: 30px;
`;

const UserName = styled.h2`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #666;
  font-size: 16px;
`;

const UserID = styled.p`
  margin: 4px 0 0 0;
  color: #999;
  font-size: 14px;
  font-family: monospace;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
`;

const RecentEventSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  margin-top: 30px;
`;

const JourneyFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const FlowStep = styled.div`
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
`;

const FlowArrow = styled.div`
  color: #666;
  font-size: 16px;
`;

const AllEventsSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EventsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
  font-size: 16px;
`;

const SessionEventsSection = styled.div`
  margin-top: 20px;
`;
