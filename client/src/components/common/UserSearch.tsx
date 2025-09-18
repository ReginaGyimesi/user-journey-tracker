import { ChangeEvent, FC, Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSearchUsersQuery } from "../../store/api/users";
import { User } from "../../types";

type Props = {
  placeholder?: string;
};

export const UserSearch: FC<Props> = ({ placeholder }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only search if query is at least 2 characters long
  const shouldSearch = query.length >= 2;
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchUsersQuery({ query, limit: 8 }, { skip: !shouldSearch });

  const users = searchResults?.users || [];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleUserSelect = (user: User) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/users/${user._id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SearchContainer ref={searchRef}>
      <SearchInput
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder || t("navigation.search")}
        autoComplete="off"
      />

      {isOpen && (
        <DropdownContainer>
          {isLoading && <LoadingMessage>{t("search.loading")}</LoadingMessage>}

          {error && <ErrorMessage>{t("search.error")}</ErrorMessage>}

          {!isLoading && !error && users.length === 0 && query.length >= 2 && (
            <NoResultsMessage>{t("search.noResults")}</NoResultsMessage>
          )}

          {users.length > 0 && (
            <Fragment>
              <DropdownHeader>
                {t("search.results", { count: searchResults?.total || 0 })}
              </DropdownHeader>
              {users.map((user, _) => (
                <DropdownItem
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                >
                  <UserSection>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserSection>
                  <UserMeta>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </UserMeta>
                </DropdownItem>
              ))}
            </Fragment>
          )}
        </DropdownContainer>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
`;

const DropdownHeader = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: #6c757d;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
  font-weight: 500;
`;

const DropdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UserSection = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserMeta = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-left: 12px;
  white-space: nowrap;
`;

const LoadingMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #dc3545;
  font-size: 14px;
`;

const NoResultsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
`;
