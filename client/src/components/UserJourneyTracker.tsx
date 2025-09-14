import { FC } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { mockUserJourney } from "../data/mockData";

export const UserJourneyTracker: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const userJourney = mockUserJourney;

  return (
    <UserJourneyContainer>
      <UserProfileHeader>
        <UserName>{userJourney.user.name}</UserName>
        <UserEmail>{userJourney.user.email}</UserEmail>
      </UserProfileHeader>

      <UserMetricsSection>
        <UserMetricCard>
          <UserMetricValue>{userJourney.totalSessions}</UserMetricValue>
          <UserMetricLabel>All time sessions</UserMetricLabel>
        </UserMetricCard>
        <UserMetricCard>
          <UserMetricValue>{userJourney.totalPurchases}</UserMetricValue>
          <UserMetricLabel>All time purchases</UserMetricLabel>
        </UserMetricCard>
      </UserMetricsSection>

      <SessionsSection>
        <SectionTitle>All time sessions</SectionTitle>
        <SessionsTable>
          <thead>
            <tr>
              <th>Session id</th>
              <th>Duration</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {userJourney.sessions.map((session) => (
              <tr key={session.sessionId}>
                <td>{session.sessionId}</td>
                <td>{session.duration} minutes</td>
                <td>{session.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </SessionsTable>
      </SessionsSection>

      <RecentEventSection>
        <SectionTitle>
          Most recent event: {userJourney.events[0].timestamp}
        </SectionTitle>
        <JourneyFlow>
          <FlowStep>Session started</FlowStep>
          <FlowArrow>→</FlowArrow>
          <FlowStep>Products page visited</FlowStep>
          <FlowArrow>→</FlowArrow>
          <FlowStep>Product visited</FlowStep>
          <FlowArrow>→</FlowArrow>
          <FlowStep>Session ended</FlowStep>
        </JourneyFlow>
      </RecentEventSection>

      <AllEventsSection>
        <SectionTitle>All events</SectionTitle>
        <EventsList>
          {userJourney.events.map((event, index) => (
            <EventItem key={index}>{event.type}</EventItem>
          ))}
        </EventsList>
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

const UserMetricsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const UserMetricCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const UserMetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const UserMetricLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const SessionsSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
`;

const SessionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

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

const RecentEventSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
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

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;

const EventItem = styled.div`
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
`;
