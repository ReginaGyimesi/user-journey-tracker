import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    { key: dashboardStats?.allTimeUsers, label: t('dashboard.allTimeUsers') },
    { key: dashboardStats?.allTimeSessions, label: t('dashboard.allTimeSessions') },
    {
      key: dashboardStats?.allTimePurchases,
      label: t('dashboard.allTimePurchases'),
    },
    { key: dashboardStats?.avgMinutesSpent, label: t('dashboard.avgMinutesSpent') },
  ];

  return (
    <DashboardContainer>
      <SectionTitle>{t('dashboard.title')}</SectionTitle>
      <MetricCardsSection stats={metrics} statsLoading={statsLoading} />

      <ChartsSection>
        <ChartContainer>
          <SubsectionTitle>{t('dashboard.revenueKPI')}</SubsectionTitle>
          <RevenueLineChart data={revenueOverTime} />
        </ChartContainer>
        <ChartContainer>
          <SubsectionTitle>{t('dashboard.dailyActiveUsers')}</SubsectionTitle>
          {dailyActiveUsersLoading ? (
            <div>{t('dashboard.loadingDailyActiveUsers')}</div>
          ) : dailyActiveUsersError ? (
            <div>
              {t('dashboard.errorLoadingDailyActiveUsers')}{" "}
              {JSON.stringify(dailyActiveUsersError)}
            </div>
          ) : (
            <DailyActiveUsersChart data={dailyActiveUsers} />
          )}
        </ChartContainer>
      </ChartsSection>

      <SessionsTable
        sessions={sessions || []}
        title={t('dashboard.recentSessions')}
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
