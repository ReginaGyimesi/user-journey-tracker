import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavigationBar>
      <NavLinks>
        <NavLink
          $isActive={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </NavLink>
        <NavLink
          $isActive={isActive("/users")}
          onClick={() => navigate("/users")}
        >
          Users
        </NavLink>
      </NavLinks>
      <SectionTitle>
        <NavLink onClick={() => navigate("/dashboard")}>
          <h3>User journey tracker</h3>
        </NavLink>
      </SectionTitle>
      <SearchInput placeholder="Search" />
    </NavigationBar>
  );
};

const SectionTitle = styled.h3`
  color: #333;
  font-size: 18px;
`;

const NavigationBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  flex-shrink: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.$isActive ? "#4f46e5" : "#333")};
  font-size: 16px;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background-color: #f0f0f0;
    color: #4f46e5;
  }

  ${(props) =>
    props.$isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -18px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 24px);
      height: 2px;
      background-color: #4f46e5;
    }
  `}
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 300px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;
