import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useApiError } from "../../hooks/useApiError";
import {
  useGetUserByIdQuery,
  useGetUserEventsQuery,
  useGetUserSessionsQuery,
} from "../../store/api/users";
import { getRecentSessionEvents } from "../../utils/helpers";
import { MetricCardsSection } from "../common/MetricCardsSection";
import { SessionsTable } from "../common/SessionsTable";

export const UserJourney: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { t } = useTranslation();
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
    {
      key: userSessions?.session_count || 0,
      label: t("userJourney.allTimeSessions"),
    },
    {
      key: userEvents?.event_count || 0,
      label: t("userJourney.allTimeEvents"),
    },
    {
      key: userSessions?.session_avg_time ? userSessions.session_avg_time : 0,
      label: t("userJourney.avgMinutesSpent"),
    },
    {
      key: userEvents?.all_time_purchases,
      label: t("userJourney.allTimePurchases"),
    },
  ];

  const { recentEvent, sessionEvents } = getRecentSessionEvents(
    userEvents?.events
  );

  if (loading) {
    return (
      <UserJourneyContainer>
        <LoadingMessage>{t("userJourney.loadingUserDetails")}</LoadingMessage>
      </UserJourneyContainer>
    );
  }

  if (error) {
    return (
      <UserJourneyContainer>
        <ErrorMessage>
          {t("userJourney.errorLoadingUser")} {errorMessage}
        </ErrorMessage>
      </UserJourneyContainer>
    );
  }

  if (!user) {
    return (
      <UserJourneyContainer>
        <ErrorMessage>{t("userJourney.userNotFound")}</ErrorMessage>
      </UserJourneyContainer>
    );
  }

  return (
    <UserJourneyContainer>
      <UserProfileHeader>
        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>
        <UserID>
          {t("userJourney.userId")} {user._id}
        </UserID>
      </UserProfileHeader>

      <MetricCardsSection
        stats={metrics}
        statsLoading={sessionsLoading || eventsLoading}
      />

      <SessionsTable
        sessions={userSessions?.sessions || []}
        title={t("userJourney.allTimeSessions")}
        showUserColumn={false}
      />

      <RecentEventSection>
        <SectionTitle>
          {t("userJourney.mostRecentSession")}{" "}
          {recentEvent
            ? new Date(recentEvent.timestamp).toLocaleString()
            : t("userJourney.noSessionStarted")}
        </SectionTitle>

        {sessionEvents.length > 1 && (
          <SessionEventsSection>
            <JourneyFlow>
              {sessionEvents.map((event, index) => (
                <Fragment key={event._id}>
                  <FlowStep>{event.event_type}</FlowStep>
                  {index < sessionEvents.length - 1 && <FlowArrow>→</FlowArrow>}
                </Fragment>
              ))}
            </JourneyFlow>
          </SessionEventsSection>
        )}
      </RecentEventSection>

      <AllEventsSection>
        <SectionTitle>
          {t("userJourney.allEvents")} ({userEvents?.event_count || 0})
        </SectionTitle>
        <EventsTable>
          <thead>
            <tr>
              <th>{t("userJourney.eventType")}</th>
              <th>{t("userJourney.timestamp")}</th>
              <th>{t("userJourney.sessionId")}</th>
              <th>{t("userJourney.pageItem")}</th>
              <th>{t("userJourney.timeSpent")}</th>
              <th>{t("userJourney.searchQuery")}</th>
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
                  {t("userJourney.noEventsFound")}
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
