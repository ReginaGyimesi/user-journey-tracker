import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { LanguageSelector } from "./LanguageSelector";
import { UserSearch } from "./UserSearch";

export const NavBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
          {t("navigation.dashboard")}
        </NavLink>
        <NavLink
          $isActive={isActive("/users")}
          onClick={() => navigate("/users")}
        >
          {t("navigation.users")}
        </NavLink>
      </NavLinks>
      <SectionTitle>
        <NavLink onClick={() => navigate("/dashboard")}>
          <h3>{t("navigation.userJourneyTracker")}</h3>
        </NavLink>
      </SectionTitle>
      <SearchContainer>
        <UserSearch placeholder={t("navigation.search")} />
        <LanguageSelector />
      </SearchContainer>
    </NavigationBar>
  );
};

const SectionTitle = styled.div`
  color: #333;
  font-size: 18px;

  @media (min-width: 1024px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
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

  @media (min-width: 1024px) {
    position: relative;
  }
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
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 24px);
      height: 2px;
      background-color: #4f46e5;
    }
  `}
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
