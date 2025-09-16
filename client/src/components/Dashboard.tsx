import React from "react";
import styled from "styled-components";
import { useGetAllSessionsQuery } from "../store/api/users";
import { MetricCardsSection } from "./common/MetricCardsSection";
import RevenueLineChart from "./common/RevenueLineChart";
import DailyActiveUsersChart from "./common/DailyActiveUsersChart";
import { SessionsTable } from "./common/SessionsTable";
import {
  useGetDailyActiveUsersQuery,
  useGetDashboardStatsQuery,
  useGetRevenueOverTimeQuery,
} from "../store/api/analytics";

export const Dashboard: React.FC = () => {
  const { data: dashboardStats, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: sessions } = useGetAllSessionsQuery();
  const { data: revenueOverTime } = useGetRevenueOverTimeQuery();
  const {
    data: dailyActiveUsers,
    isLoading: dailyActiveUsersLoading,
    error: dailyActiveUsersError,
  } = useGetDailyActiveUsersQuery();

  const metrics = [
    { key: dashboardStats?.allTimeUsers, label: "All time users" },
    { key: dashboardStats?.allTimeSessions, label: "All time sessions" },
    {
      key: dashboardStats?.allTimePurchases,
      label: "All time number of items purchased",
    },
    { key: dashboardStats?.avgMinutesSpent, label: "Average minutes spent" },
  ];

  return (
    <DashboardContainer>
      <SectionTitle>Dashboard</SectionTitle>
      <MetricCardsSection stats={metrics} statsLoading={statsLoading} />

      <ChartsSection>
        <ChartContainer>
          <SubsectionTitle>Revenue KPI</SubsectionTitle>
          <RevenueLineChart data={revenueOverTime} />
        </ChartContainer>
        <ChartContainer>
          <SubsectionTitle>Daily Active Users</SubsectionTitle>
          {dailyActiveUsersLoading ? (
            <div>Loading daily active users data...</div>
          ) : dailyActiveUsersError ? (
            <div>
              Error loading daily active users data:{" "}
              {JSON.stringify(dailyActiveUsersError)}
            </div>
          ) : (
            <DailyActiveUsersChart data={dailyActiveUsers} />
          )}
        </ChartContainer>
      </ChartsSection>

      <SessionsTable
        sessions={sessions || []}
        title="Recent sessions"
        showUserColumn={true}
      />
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
