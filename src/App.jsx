import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import SignupClient from './pages/SignupClient';
import SignupLawyer from './pages/SignupLawyer';
import Login from './pages/Login';
import ClientDashboard from './pages/client/Dashboard';
import CreateCase from './pages/client/CreateCase';
import CaseDetail from './pages/client/CaseDetail';
import PaymentProcessing from './pages/client/PaymentProcessing';
import LawyerMarketplace from './pages/lawyer/Marketplace';
import MarketplaceCaseDetail from './pages/lawyer/MarketplaceCaseDetail';
import MyQuotes from './pages/lawyer/MyQuotes';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/client" element={<SignupClient />} />
        <Route path="/signup/lawyer" element={<SignupLawyer />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/client/dashboard"
          element={
            <PrivateRoute requiredRole="client">
              <ClientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/cases/new"
          element={
            <PrivateRoute requiredRole="client">
              <CreateCase />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/cases/:id"
          element={
            <PrivateRoute requiredRole="client">
              <CaseDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/cases/:id/payment/processing"
          element={
            <PrivateRoute requiredRole="client">
              <PaymentProcessing />
            </PrivateRoute>
          }
        />

        <Route
          path="/lawyer/marketplace"
          element={
            <PrivateRoute requiredRole="lawyer">
              <LawyerMarketplace />
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer/marketplace/cases/:id"
          element={
            <PrivateRoute requiredRole="lawyer">
              <MarketplaceCaseDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer/my-quotes"
          element={
            <PrivateRoute requiredRole="lawyer">
              <MyQuotes />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
