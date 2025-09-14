import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGetUsersQuery } from "../store/api";
import { useApiError } from "../hooks/useApiError";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const UsersList: FC = () => {
  const navigate = useNavigate();
  const { data: users, isLoading: loading, error } = useGetUsersQuery();
  const errorMessage = useApiError(error as FetchBaseQueryError | undefined);

  return (
    <UsersListContainer>
      <SectionTitle>Users</SectionTitle>
      <UsersSection>
        {loading ? (
          <LoadingMessage>Loading users...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>Error loading users: {errorMessage}</ErrorMessage>
        ) : (
          <UsersTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => navigate(`/users/${user._id}`)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </UsersTable>
        )}
      </UsersSection>
    </UsersListContainer>
  );
};

const UsersListContainer = styled.div`
  flex: 1;
  padding: 20px;
  font-family: Arial, sans-serif;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const UsersSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UsersTable = styled.table`
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

  tr {
    cursor: pointer;

    &:hover {
      background-color: #f8f9fa;
    }
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
