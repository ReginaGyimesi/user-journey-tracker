import { FC } from "react";
import { styled } from "styled-components";

type Props = {
  statsLoading: boolean;
  stats: { key: string | number | undefined; label: string }[];
};

export const MetricCardsSection: FC<Props> = ({ statsLoading, stats }) => {
  return (
    <MetricsSection>
      {stats.map(({ key, label }) => (
        <MetricCard key={label}>
          <MetricValue>{statsLoading ? "..." : key || 0}</MetricValue>
          <MetricLabel>{label}</MetricLabel>
        </MetricCard>
      ))}
    </MetricsSection>
  );
};

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
