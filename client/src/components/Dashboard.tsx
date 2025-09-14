import React from "react";
import styled from "styled-components";
import { mockChartData, mockDashboardMetrics } from "../data/mockData";
import { useGetAllSessionsQuery, useGetUsersQuery } from "../store/api";
import { calculateDuration } from "../utils/helpers";

export const Dashboard: React.FC = () => {
  const { data: users } = useGetUsersQuery();
  const { data: sessions } = useGetAllSessionsQuery();

  console.log(sessions);

  return (
    <DashboardContainer>
      <SectionTitle>Dashboard</SectionTitle>
      <MetricsSection>
        <MetricCard>
          <MetricValue>{users?.length}</MetricValue>
          <MetricLabel>All time users</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{sessions?.length}</MetricValue>
          <MetricLabel>All time sessions</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{mockDashboardMetrics.allTimePurchases}</MetricValue>
          <MetricLabel>All time number of items purchased</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{mockDashboardMetrics.avgMinutesSpent}</MetricValue>
          <MetricLabel>Avg. minutes spent</MetricLabel>
        </MetricCard>
      </MetricsSection>

      <ChartsSection>
        <ChartContainer>
          <SubsectionTitle>User Activity</SubsectionTitle>
          <BarChart>
            {mockChartData.map((item, index) => (
              <Bar key={index} height={item.value / 10}>
                <BarValue>{item.value}</BarValue>
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
        <ChartContainer>
          <SubsectionTitle>Session Trends</SubsectionTitle>
          <BarChart>
            {mockChartData.map((item, index) => (
              <Bar key={index} height={item.value / 8}>
                <BarValue>{item.value}</BarValue>
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </ChartsSection>

      <RecentSessionsSection>
        <SubsectionTitle>Recent sessions</SubsectionTitle>
        <SessionsTable>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration</th>
              <th>Device</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {sessions?.map((session) => (
              <tr key={session.session_id}>
                <td>{session.session_id}</td>
                <td>{new Date(session.start_time).toLocaleString()}</td>
                <td>{new Date(session.end_time).toLocaleString()}</td>
                <td>
                  {calculateDuration(session.start_time, session.end_time)}{" "}
                  minutes
                </td>
                <td>{session.device}</td>
                <td>{session.location}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#666" }}>
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </SessionsTable>
      </RecentSessionsSection>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  flex: 1;
  padding: 20px;
  font-family: Arial, sans-serif;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const SubsectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
`;

const MetricsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;
  height: 200px;
  padding: 10px 0;
`;

const Bar = styled.div<{ height: number }>`
  flex: 1;
  background: linear-gradient(to top, #4f46e5, #7c3aed);
  height: ${(props) => props.height}px;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
  min-height: 20px;
`;

const BarValue = styled.span`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const RecentSessionsSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
