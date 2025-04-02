import React, { useState, useEffect, useMemo } from "react";
import { useClientStore } from "../store/clientStore";
import { useDevelopmentStore } from "../store/developmentStore";
import { useAuthStore } from "../store/authStore";
import { useSaleStore } from "../store/saleStore";
import { useUserStore } from "../store/userStore";
import { Table } from "../components/common/Table";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { CommissionFilters } from "../components/commissions/CommissionFilters";
import { CommissionSummary } from "../components/commissions/CommissionSummary";
import { getCommissionColumns } from "../components/commissions/CommissionColumns";
import { getCurrentYear, getYearFromDate } from "../utils/yearFilter";
import { removeAcento } from "../utils/format";
import { useTeamStore } from "../store/teamStore";

export function Commissions() {
  const { user } = useAuthStore();
  const {
    sales,
    loading: salesLoading,
    error: salesError,
    fetchSales,
  } = useSaleStore();
  const { clients, loading: clientsLoading, fetchClients } = useClientStore();
  const { teams, fetchTeams } = useTeamStore();
  const {
    developments,
    loading: developmentsLoading,
    fetchDevelopments,
  } = useDevelopmentStore();
  const { users, loading: usersLoading, fetchUsers } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevelopment, setSelectedDevelopment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedYear, setSelectedYear] = useState(getCurrentYear().toString());
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchTeams();
    fetchDevelopments();
    fetchUsers();
  }, [fetchSales, fetchClients, fetchTeams, fetchDevelopments, fetchUsers]);

  // Filtrar corretores da equipe do líder
  const teamBrokers = useMemo(() => {
    if (user?.role !== "teamLeader") return [];
    const leaderTeam = teams.find((t) => t.leaderId === user.id);
    return users.filter(
      (u) =>
        (u.teamId === leaderTeam?.id || leaderTeam?.leaderId === u.id) &&
        (u.role === "broker" || u.role === "teamLeader")
    );
  }, [users, user, teams]);

  // Filtrar corretores disponíveis para o admin baseado no time selecionado
  const availableBrokers = useMemo(() => {
    if (user?.role !== "admin") return [];
    if (selectedTeam) {
      return users.filter(
        (u) =>
          (u.teamId === selectedTeam ||
            teams.find((t) => t.leaderId === u.id)?.id === selectedTeam) &&
          (u.role === "broker" || u.role === "teamLeader")
      );
    }
    return users.filter(
      (u) => (u.role === "broker" || u.role === "teamLeader") && u.active
    );
  }, [users, selectedTeam, teams, user]);

  // Limpar o corretor selecionado se ele não pertencer ao time selecionado
  useEffect(() => {
    if (user?.role === "admin" && selectedTeam && selectedBroker) {
      const brokerBelongsToTeam = availableBrokers.some(
        (broker) => broker.id === selectedBroker
      );
      if (!brokerBelongsToTeam) {
        setSelectedBroker("");
      }
    }
  }, [selectedTeam, availableBrokers, selectedBroker, user]);

  // Obter o ano de criação do corretor mais antigo da equipe ou do usuário
  const oldestYear = useMemo(() => {
    if (user?.role === "admin") {
      if (selectedTeam) {
        const teamUsers = users.filter(
          (u) =>
            (u.teamId === selectedTeam ||
              teams.find((t) => t.leaderId === u.id)?.id === selectedTeam) &&
            (u.role === "broker" || u.role === "teamLeader")
        );
        return Math.min(
          ...teamUsers.map((u) => new Date(u.createdAt).getFullYear())
        );
      }
      if (selectedBroker) {
        const selectedUser = users.find((u) => u.id === selectedBroker);
        return selectedUser
          ? new Date(selectedUser.createdAt).getFullYear()
          : getCurrentYear();
      }
      return Math.min(
        ...users
          .filter((u) => u.role === "broker" || u.role === "teamLeader")
          .map((u) => new Date(u.createdAt).getFullYear())
      );
    }

    if (user?.role === "teamLeader" && teamBrokers.length) {
      return Math.min(
        ...teamBrokers.map((broker) => new Date(broker.createdAt).getFullYear())
      );
    }

    return user?.createdAt
      ? new Date(user.createdAt).getFullYear()
      : getCurrentYear();
  }, [user, teamBrokers, users, selectedTeam, selectedBroker, teams]);

  const myCommissions = useMemo(() => {
    if (!user || !sales.length || !clients.length || !developments.length)
      return [];

    let filteredSales = sales;

    if (user.role === "admin") {
      if (selectedTeam) {
        const teamBrokerIds = users
          .filter(
            (u) =>
              (u.teamId === selectedTeam ||
                teams.find((t) => t.leaderId === u.id)?.id === selectedTeam) &&
              (u.role === "broker" || u.role === "teamLeader")
          )
          .map((u) => u.id);
        filteredSales = sales.filter((sale) =>
          teamBrokerIds.includes(sale.brokerId)
        );
      }
      if (selectedBroker) {
        filteredSales = filteredSales.filter(
          (sale) => sale.brokerId === selectedBroker
        );
      }
    } else if (user.role === "teamLeader") {
      filteredSales = sales.filter((sale) => {
        if (selectedBroker) {
          return sale.brokerId === selectedBroker;
        }
        return teamBrokers.some((broker) => broker.id === sale.brokerId);
      });
    } else {
      filteredSales = sales.filter((sale) => sale.brokerId === user.id);
    }

    return filteredSales.map((sale) => {
      const client = clients.find((c) => c.id === sale.clientId);
      const secondClient = clients.find((c) => c.id === sale.secondBuyerId);
      const development = developments.find((d) => d.id === sale.developmentId);

      return {
        id: sale.id,
        clientName: client?.name || "Comprador não encontrado",
        clientCPF: client?.cpf || "CPF de Comprador não encontrado",
        secondClientName:
          secondClient?.name || "Segundo comprador não encontrado",
        secondClientCPF:
          secondClient?.cpf || "CPF de segundo comprador não encontrado",
        developmentName: development?.name || "Empreendimento não encontrado",
        developmentId: sale.developmentId,
        blockNumber: sale.blockNumber,
        lotNumber: sale.lotNumber,
        totalValue: Number(sale.totalValue) || 0,
        commissionValue: Number(sale.commissionValue) || 0,
        status: sale.status,
        purchaseDate: sale.purchaseDate,
        updatedAt: sale.updatedAt,
      };
    });
  }, [
    sales,
    clients,
    developments,
    user,
    selectedBroker,
    teamBrokers,
    selectedTeam,
    users,
    teams,
  ]);

  const filteredCommissions = useMemo(() => {
    const searchLower = removeAcento(searchTerm.toLowerCase());
    return myCommissions.filter((commission) => {
      const matchesSearch =
        removeAcento(commission.clientName.toLowerCase()).includes(
          searchLower
        ) ||
        commission.clientCPF.toLowerCase().includes(searchLower) ||
        removeAcento(commission.secondClientName.toLowerCase()).includes(
          searchLower
        ) ||
        commission.secondClientCPF.toLowerCase().includes(searchLower) ||
        commission.blockNumber.toLowerCase().includes(searchLower) ||
        commission.lotNumber.toLowerCase().includes(searchLower);
      const matchesDevelopment =
        !selectedDevelopment ||
        commission.developmentId === selectedDevelopment;
      const matchesStatus =
        !selectedStatus || commission.status === selectedStatus;
      const matchesYear =
        !selectedYear ||
        getYearFromDate(commission.purchaseDate).toString() === selectedYear;

      return (
        matchesSearch && matchesDevelopment && matchesStatus && matchesYear
      );
    });
  }, [
    myCommissions,
    searchTerm,
    selectedDevelopment,
    selectedStatus,
    selectedYear,
  ]);

  const summaryData = useMemo(() => {
    return filteredCommissions.reduce(
      (acc, commission) => ({
        totalSales: acc.totalSales + (commission.totalValue || 0),
        totalCommissions:
          acc.totalCommissions + (commission.commissionValue || 0),
        numberOfSales: acc.numberOfSales + 1,
      }),
      { totalSales: 0, totalCommissions: 0, numberOfSales: 0 }
    );
  }, [filteredCommissions]);

  if (salesLoading || clientsLoading || developmentsLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    // Limpar o corretor selecionado ao trocar de time
    setSelectedBroker("");
  };

  return (
    <div className="space-y-4">
      {myCommissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma comissão encontrada.
        </div>
      ) : (
        <>
          <CommissionSummary
            totalSales={summaryData.totalSales}
            totalCommissions={summaryData.totalCommissions}
            numberOfSales={summaryData.numberOfSales}
          />
        </>
      )}
      <div className="flex justify-between items-center">
        <h1 className="mt-8 text-2xl font-bold">
          {user?.role === "admin"
            ? "Comissões"
            : user?.role === "teamLeader"
            ? "Comissões da Equipe"
            : "Minhas Comissões"}
        </h1>
      </div>

      <CommissionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDevelopment={selectedDevelopment}
        onDevelopmentChange={setSelectedDevelopment}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        developments={developments}
        userCreationYear={oldestYear}
        showTeamFilter={user?.role === "admin"}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
        teams={teams}
        showBrokerFilter={user?.role === "teamLeader" || user?.role === "admin"}
        selectedBroker={selectedBroker}
        onBrokerChange={setSelectedBroker}
        teamBrokers={teamBrokers}
        availableBrokers={availableBrokers}
      />
      <Table data={filteredCommissions} columns={getCommissionColumns()} />
      {salesError && <ErrorMessage message={salesError} />}
    </div>
  );
}
