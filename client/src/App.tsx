import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RecordsTable } from "./components/RecordsTable";
import { AddRecordForm } from "./components/AddRecordForm";
import { fetchRecords } from "./services/api";
import { Record } from "./types";

const App: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecords();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleRecordAdded = (newRecord: Record) => {
    setRecords((prev) => [...prev, newRecord]);
  };

  return (
    <AppContainer>
      <Header>
        <Title>User journey tracker</Title>
      </Header>
      <Content>
        <AddRecordForm onRecordAdded={handleRecordAdded} />
        <RecordsTable records={records} loading={loading} error={error} />
      </Content>
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
