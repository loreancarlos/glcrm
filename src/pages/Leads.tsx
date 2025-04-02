import React, { useState, useEffect, useMemo } from "react";
import { Plus, Upload } from "lucide-react";
import { useLeadStore } from "../store/leadStore";
import { useAuthStore } from "../store/authStore";
import { useDevelopmentStore } from "../store/developmentStore";
import { useUserStore } from "../store/userStore";
import { useTeamStore } from "../store/teamStore";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { SearchInput } from "../components/common/SearchInput";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LeadForm } from "../components/leads/LeadForm";
import { getLeadColumns } from "../components/leads/LeadColumns";
import { ImportLeadsModal } from "../components/leads/ImportLeadsModal";
import { Lead } from "../types";
import { removeAcento } from "../utils/format";
import { Combobox } from "../components/common/Combobox";

export function Leads() {
  const { user } = useAuthStore();
  const { leads, loading, error, fetchLeads, addLead, updateLead, deleteLead } =
    useLeadStore();
  const {
    developments,
    loading: developmentsLoading,
    fetchDevelopments,
  } = useDevelopmentStore();
  const { users, fetchUsers } = useUserStore();
  const { teams, fetchTeams } = useTeamStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: "",
    phone: "",
    developmentsInterest: [],
    brokerId: user?.id || "",
  });

  useEffect(() => {
    fetchLeads();
    fetchDevelopments();
    fetchUsers();
    fetchTeams();
  }, [fetchLeads, fetchDevelopments, fetchUsers, fetchTeams]);

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

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // Filtrar por time e corretor
    if (user?.role === "admin") {
      if (selectedTeam) {
        const teamBrokerIds = users
          .filter(
            (u) =>
              (u.teamId === selectedTeam ||
                teams.find((t) => t.leaderId === u.id)?.id === selectedTeam) &&
              (u.role === "broker" || u.role === "teamLeader")
          )
          .map((u) => u.id);
        filtered = filtered.filter((lead) =>
          teamBrokerIds.includes(lead.brokerId)
        );
      }
      if (selectedBroker) {
        filtered = filtered.filter((lead) => lead.brokerId === selectedBroker);
      }
    } else if (user?.role === "teamLeader") {
      if (selectedBroker) {
        filtered = filtered.filter((lead) => lead.brokerId === selectedBroker);
      } else {
        filtered = filtered.filter((lead) =>
          teamBrokers.some((broker) => broker.id === lead.brokerId)
        );
      }
    } else {
      filtered = filtered.filter((lead) => lead.brokerId === user?.id);
    }

    const searchLower = removeAcento(searchTerm.toLowerCase());
    return filtered.filter(
      (lead) =>
        removeAcento(lead.name.toLowerCase()).includes(searchLower) ||
        lead.phone.includes(searchTerm)
    );
  }, [
    leads,
    searchTerm,
    selectedTeam,
    selectedBroker,
    user,
    users,
    teams,
    teamBrokers,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadData = {
        ...formData,
        brokerId: user?.role === "broker" ? user.id : formData.brokerId,
      };
      if (editingLead) {
        await updateLead(editingLead.id, leadData);
      } else {
        await addLead(leadData);
      }
      handleCloseModal();
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Erro ao salvar lead"
      );
    }
  };

  const handleImportLeads = async (leads: any[]) => {
    try {
      for (const lead of leads) {
        await addLead(lead);
      }
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Erro ao importar leads"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    setFormData({
      name: "",
      phone: "",
      developmentsInterest: [],
      brokerId: user?.id || "",
    });
    setOperationError(null);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setIsModalOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (leadToDelete) {
      try {
        await deleteLead(leadToDelete.id);
        setLeadToDelete(null);
        setIsConfirmOpen(false);
      } catch (error) {
        setOperationError(
          error instanceof Error ? error.message : "Erro ao excluir lead"
        );
      }
    }
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    setSelectedBroker("");
  };

  const canImportLeads = user?.role === "admin" || user?.role === "teamLeader";
  const showBrokerField = user?.role === "admin" || user?.role === "teamLeader";

  if ((loading && !leads.length) || developmentsLoading) {
    return <LoadingSpinner />;
  }

  const teamOptions = [
    { id: "", label: "" },
    ...teams.map((team) => ({ id: team.id, label: team.name })),
  ];

  const brokerOptions = [
    { id: "", label: "" },
    ...(user?.role === "admin" ? availableBrokers : teamBrokers)
      .filter((broker) => broker.active)
      .map((broker) => ({ id: broker.id, label: broker.name })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Leads {`(${filteredLeads.length})`}
        </h1>
        <div className="flex space-x-2">
          {canImportLeads && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Importar Excel
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="relative">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Pesquisar por nome ou telefone..."
            />
          </div>
          <div
            className={`grid grid-cols-1 ${
              user?.role === "admin"
                ? "md:grid-cols-2"
                : user?.role === "teamLeader"
                ? "md:grid-cols-1"
                : "md:grid-cols-1"
            } gap-4`}>
            {user?.role === "admin" && (
              <Combobox
                options={teamOptions}
                value={selectedTeam}
                onChange={handleTeamChange}
                placeholder="Todos os times"
                label="Time"
                allowClear
              />
            )}

            {(user?.role === "teamLeader" || user?.role === "admin") && (
              <Combobox
                options={brokerOptions}
                value={selectedBroker}
                onChange={setSelectedBroker}
                placeholder="Todos os corretores"
                label="Corretor"
                allowClear
              />
            )}
          </div>
        </div>
      </div>

      {(error || operationError) && (
        <ErrorMessage
          message={error || operationError || ""}
          onDismiss={() => {
            if (error) fetchLeads();
            setOperationError(null);
          }}
        />
      )}

      <Table
        data={filteredLeads}
        columns={getLeadColumns()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLead ? "Editar Lead" : "Novo Lead"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LeadForm
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingLead}
            developments={developments}
            showBrokerField={showBrokerField}
            brokers={availableBrokers}
          />

          {operationError && <ErrorMessage message={operationError} />}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              {editingLead ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLeads}
        brokers={availableBrokers}
        developments={developments}
        showBrokerField={showBrokerField}
        currentUserId={user?.id || ""}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Lead"
        message="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
