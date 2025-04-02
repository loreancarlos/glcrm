import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Users,
  FileText,
  LogOut,
  UserCog,
  DollarSign,
  Menu,
  X,
  Building2,
  UserPlus,
  User,
  Briefcase,
  BarChart,
} from "lucide-react";

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "border-indigo-500 text-gray-900"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";

  const renderMobileNavLinks = () => (
    <>
      {user?.role === "admin" && (
        <>
          <Link
            to="/clients"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/clients"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Clientes
            </div>
          </Link>
          <Link
            to="/developments"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/developments"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Empreendimentos
            </div>
          </Link>
          <Link
            to="/sales"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/sales"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Vendas
            </div>
          </Link>
          <Link
            to="/users"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/users"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <UserCog className="h-5 w-5 mr-2" />
              Usuários
            </div>
          </Link>
        </>
      )}

      {(user?.role === "broker" ||
        user?.role === "teamLeader" ||
        user?.role === "admin") && (
        <>
          <Link
            to="/commissions"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/commissions"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Comissões
            </div>
          </Link>
          <Link
            to="/leads"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/leads"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Leads
            </div>
          </Link>
          <Link
            to="/business"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/business"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Negócios
            </div>
          </Link>
          <Link
            to="/reports"
            className={`block px-3 py-2 text-base font-medium ${
              location.pathname === "/reports"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Relatórios
            </div>
          </Link>
        </>
      )}
    </>
  );

  const renderDesktopNavLinks = () => (
    <>
      {user?.role === "admin" && (
        <>
          <Link
            to="/clients"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/clients"
            )}`}>
            <Users className="h-4 w-4 mr-1" />
            Clientes
          </Link>
          <Link
            to="/developments"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/developments"
            )}`}>
            <Building2 className="h-4 w-4 mr-1" />
            Empreendimentos
          </Link>
          <Link
            to="/sales"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/sales"
            )}`}>
            <FileText className="h-4 w-4 mr-1" />
            Vendas
          </Link>
          <Link
            to="/users"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/users"
            )}`}>
            <UserCog className="h-4 w-4 mr-1" />
            Usuários
          </Link>
        </>
      )}

      {(user?.role === "broker" ||
        user?.role === "teamLeader" ||
        user?.role === "admin") && (
        <>
          <Link
            to="/commissions"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/commissions"
            )}`}>
            <DollarSign className="h-4 w-4 mr-1" />
            Comissões
          </Link>
          <Link
            to="/leads"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/leads"
            )}`}>
            <UserPlus className="h-4 w-4 mr-1" />
            Leads
          </Link>
          <Link
            to="/business"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/business"
            )}`}>
            <Briefcase className="h-4 w-4 mr-1" />
            Negócios
          </Link>
          <Link
            to="/reports"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
              "/reports"
            )}`}>
            <BarChart className="h-4 w-4 mr-1" />
            Relatórios
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                  CRM
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {renderDesktopNavLinks()}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <User className="h-4 w-4 mr-1" />
                Perfil
              </Link>
              <button
                id="logout"
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Sair</span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {renderMobileNavLinks()}
              <Link
                to="/profile"
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-5 w-5 mr-2" />
                Perfil
              </Link>
              <div className="px-3 py-2 text-base font-medium text-gray-700 flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                {user?.name}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}