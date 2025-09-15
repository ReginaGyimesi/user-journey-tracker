import React from "react";
import styled from "styled-components";
import { Session } from "../../types";
import { calculateDuration } from "../../utils/helpers";

interface SessionsTableProps {
  sessions: Session[];
  title?: string;
  showUserColumn?: boolean;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  title,
  showUserColumn = false,
}) => {
  if (!sessions || sessions.length === 0) {
    return (
      <SessionsTableContainer>
        {title && <SectionTitle>{title}</SectionTitle>}
        <EmptyMessage>No sessions found</EmptyMessage>
      </SessionsTableContainer>
    );
  }

  return (
    <SessionsTableContainer>
      {title && <SectionTitle>{title}</SectionTitle>}
      <Table>
        <thead>
          <tr>
            <th>Session ID</th>
            {showUserColumn && <th>User ID</th>}
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Device</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session._id}>
              <td>{session._id}</td>
              {showUserColumn && <td>{session.userId}</td>}
              <td>{new Date(session.startTime).toLocaleString()}</td>
              <td>{new Date(session.endTime).toLocaleString()}</td>
              <td>
                {calculateDuration(session.startTime, session.endTime)} minutes
              </td>
              <td>
                {session.deviceInfo.browser} on {session.deviceInfo.os}
              </td>
              <td>{session.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </SessionsTableContainer>
  );
};

const SessionsTableContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
`;

const Table = styled.table`
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;
