import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthRoute({ children, requireAuth = true }: AuthRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authentication is not required and user is authenticated
  if (!requireAuth && isAuthenticated) {
    return (
      <Navigate
        to={
          user?.role === "broker" || user?.role === "teamLeader"
            ? "/commissions"
            : "/clients"
        }
        replace
      />
    );
  }

  return <>{children}</>;
}
