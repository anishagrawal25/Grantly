import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { useAppStore } from './store/useAppStore';

// Pages
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Tracker from './pages/Tracker';
import Unlock from './pages/Unlock';
import Wallet from './pages/Wallet';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const onboarded = useAppStore((state) => state.onboarded);

  if (!onboarded) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected App Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarship/:id"
            element={
              <ProtectedRoute>
                <ScholarshipDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships/:id"
            element={
              <ProtectedRoute>
                <ScholarshipDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/unlock"
            element={
              <ProtectedRoute>
                <Unlock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <Tracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
