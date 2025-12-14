import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from "./pages/AuthPage.jsx"
import ChatPage from './pages/ChatPage.jsx'
import LandingPage from './pages/Landing.jsx';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
