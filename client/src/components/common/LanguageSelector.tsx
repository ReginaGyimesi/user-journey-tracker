import { FC } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const LanguageSelector: FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageSelectorContainer>
      <LanguageButton
        $isActive={i18n.language === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </LanguageButton>
      <LanguageButton
        $isActive={i18n.language === "hu"}
        onClick={() => changeLanguage("hu")}
      >
        HU
      </LanguageButton>
    </LanguageSelectorContainer>
  );
};

const LanguageSelectorContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 10px;
`;

const LanguageButton = styled.button<{ $isActive: boolean }>`
  background: ${(props) => (props.$isActive ? "#4f46e5" : "white")};
  color: ${(props) => (props.$isActive ? "white" : "#333")};
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isActive ? "#4338ca" : "#f0f0f0")};
    border-color: #4f46e5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;
