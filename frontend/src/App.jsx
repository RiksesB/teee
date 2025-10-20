import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, USER_ROLES } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ClientDashboard } from './pages/client/ClientDashboard';

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

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/clients" element={<div>Clientes Page</div>} />
                    <Route path="/courses" element={<div>Cursos Page</div>} />
                    <Route path="/licenses" element={<div>Licencias Page</div>} />
                    <Route path="/campaigns" element={<div>Campañas Page</div>} />
                    <Route path="/reports" element={<div>Reportes Page</div>} />
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
                    <Route path="/catalog" element={<div>Catálogo Page</div>} />
                    <Route path="/licenses" element={<div>Mis Licencias Page</div>} />
                    <Route path="/campaigns" element={<div>Mis Campañas Page</div>} />
                    <Route path="/tracking" element={<div>Seguimiento Page</div>} />
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
