import React from "react";
import styled from "styled-components";
import { UsersList } from "./components/UsersList";

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header>
        <Title>User tracking dashboard</Title>
      </Header>
      <Content>
        <UsersList />
      </Content>
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #7889d8 0%, #ceb2e9 100%);
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  color: white;
`;

const Content = styled.div`
  max-width: 90%;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
