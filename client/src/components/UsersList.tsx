import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUsers } from "../services/api";
import { User } from "../types";

export const UsersList: FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <UsersListContainer>
      <SectionTitle>Users</SectionTitle>
      <UsersSection>
        {!loading && !error ? (
          <UsersTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
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
        ) : (
          <LoadingMessage>Loading users...</LoadingMessage>
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
