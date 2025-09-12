import React from "react";
import styled from "styled-components";
import { Record } from "../types";

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  loading,
  error,
}) => {
  if (loading) {
    return <LoadingMessage>Loading records...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Position</TableHeaderCell>
            <TableHeaderCell>Level</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {records.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.position}</TableCell>
              <TableCell>{record.level}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  margin: 20px;
  font-family: Arial, sans-serif;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }

  &:hover {
    background: #e9ecef;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
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

interface RecordsTableProps {
  records: Record[];
  loading: boolean;
  error: string | null;
}
