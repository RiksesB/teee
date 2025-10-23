import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, USER_ROLES } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ClientsPage } from './pages/admin/ClientsPage';
import { CoursesPage } from './pages/admin/CoursesPage';
import { LicensesPage } from './pages/admin/LicensesPage';
import { CampaignsPage } from './pages/admin/CampaignsPage';
import { ReportsPage } from './pages/admin/ReportsPage';

// Client Pages
import { ClientDashboard } from './pages/client/ClientDashboard';
import { CatalogPage } from './pages/client/CatalogPage';
import { ClientLicensesPage } from './pages/client/ClientLicensesPage';
import { ClientCampaignsPage } from './pages/client/ClientCampaignsPage';
import { TrackingPage } from './pages/client/TrackingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/licenses" element={<LicensesPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/client/*"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CLIENT]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<ClientDashboard />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/licenses" element={<ClientLicensesPage />} />
                    <Route path="/campaigns" element={<ClientCampaignsPage />} />
                    <Route path="/tracking" element={<TrackingPage />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
