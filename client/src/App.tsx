import { FC } from "react";
import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import styled from "styled-components";
import { NavBar } from "./components/common/NavBar";
import { Dashboard } from "./components/pages/Dashboard";
import { UserJourney } from "./components/pages/UserJourney";
import { UsersList } from "./components/pages/UsersList";
import { store } from "./store";

const App: FC = () => {
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
