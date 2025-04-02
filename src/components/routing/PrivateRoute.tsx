import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireBrokerOrTeamLeaderOrAdmin?: boolean;
}

export function PrivateRoute({
  children,
  requireAdmin = false,
  requireBrokerOrTeamLeaderOrAdmin = false,
}: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If broker, team leader or admin access is required
  if (requireBrokerOrTeamLeaderOrAdmin) {
    const allowedRoles = ["broker", "teamLeader", "admin"];
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
