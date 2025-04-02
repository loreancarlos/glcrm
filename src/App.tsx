import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Clients } from "./pages/Clients";
import { Developments } from "./pages/Developments";
import { Sales } from "./pages/Sales";
import { Users } from "./pages/Users";
import { Commissions } from "./pages/Commissions";
import { Leads } from "./pages/Leads";
import { BusinessPage } from "./pages/Business";
import { Reports } from "./pages/Reports";
import { Profile } from "./pages/Profile";
import { useAuthStore } from "./store/authStore";
import { PrivateRoute } from "./components/routing/PrivateRoute";
import { AuthRoute } from "./components/routing/AuthRoute";

export function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - Login */}
        <Route
          path="/"
          element={
            <AuthRoute requireAuth={false}>
              <Login />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }>
          {/* Profile route - accessible to all authenticated users */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/clients"
            element={
              <PrivateRoute requireAdmin>
                <Clients />
              </PrivateRoute>
            }
          />
          <Route
            path="/developments"
            element={
              <PrivateRoute requireAdmin>
                <Developments />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute requireAdmin>
                <Sales />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute requireAdmin>
                <Users />
              </PrivateRoute>
            }
          />

          {/* Broker, Team Leader and Admin routes */}
          <Route
            path="/commissions"
            element={
              <PrivateRoute requireBrokerOrTeamLeaderOrAdmin>
                <Commissions />
              </PrivateRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <PrivateRoute requireBrokerOrTeamLeaderOrAdmin>
                <Leads />
              </PrivateRoute>
            }
          />
          <Route
            path="/business"
            element={
              <PrivateRoute requireBrokerOrTeamLeaderOrAdmin>
                <BusinessPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute requireBrokerOrTeamLeaderOrAdmin>
                <Reports />
              </PrivateRoute>
            }
          />

          {/* Catch all route - redirect to appropriate page based on role */}
          <Route
            path="*"
            element={
              user?.role === "broker" || user?.role === "teamLeader" ? (
                <Navigate to="/commissions" replace />
              ) : (
                <Navigate to="/clients" replace />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}