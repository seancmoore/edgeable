import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Upgrade from './pages/Upgrade.jsx';
import Guide from './pages/Guide.jsx';
import Admin from './pages/Admin.jsx';
import NewTransaction from './pages/admin/NewTransaction.jsx';
import EditTransaction from './pages/admin/EditTransaction.jsx';
import SubscriberDetail from './pages/admin/SubscriberDetail.jsx';
import AllTransactions from './pages/admin/AllTransactions.jsx';
import PendingRequests from './pages/admin/PendingRequests.jsx';
import PnLManager from './pages/admin/PnLManager.jsx';
import CardManager from './pages/admin/CardManager.jsx';
import PublicCard from './pages/PublicCard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Root: anonymous visitors get the public landing page; signed-in users go
// straight to their dashboard (admin or subscriber).
function RootRoute() {
  const { currentUser, role, loading } = useAuth();
  if (loading) return null;
  if (currentUser) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <Landing />;
}

export default function App() {
  return (
    <Routes>
      {/* Public front door: the landing page (verifiable record + join). */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/card" element={<PublicCard />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upgrade"
        element={
          <ProtectedRoute requiredRole="user">
            <Upgrade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide"
        element={
          <ProtectedRoute>
            <Guide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute requiredRole="admin">
            <AllTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions/new"
        element={
          <ProtectedRoute requiredRole="admin">
            <NewTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions/:id/edit"
        element={
          <ProtectedRoute requiredRole="admin">
            <EditTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscribers/:uid"
        element={
          <ProtectedRoute requiredRole="admin">
            <SubscriberDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute requiredRole="admin">
            <PendingRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pnl"
        element={
          <ProtectedRoute requiredRole="admin">
            <PnLManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/card"
        element={
          <ProtectedRoute requiredRole="admin">
            <CardManager />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
