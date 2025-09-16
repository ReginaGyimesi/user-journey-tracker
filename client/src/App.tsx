import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import styled from "styled-components";
import { store } from "./store";
import { Dashboard } from "./components/pages/Dashboard";
import { UsersList } from "./components/pages/UsersList";
import { UserJourney } from "./components/pages/UserJourney";
import { NavBar } from "./components/common/NavBar";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContainer>
          <Content>
            <NavBar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/:userId" element={<UserJourney />} />
            </Routes>
          </Content>
        </AppContainer>
      </Router>
    </Provider>
  );
};

export default App;

const AppContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #7889d8 0%, #ceb2e9 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;
