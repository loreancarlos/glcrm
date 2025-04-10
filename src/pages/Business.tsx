import React, { useState, useEffect, useMemo } from "react";
import { Plus, Play } from "lucide-react";
import { useBusinessStore } from "../store/businessStore";
import { useLeadStore } from "../store/leadStore";
import { useDevelopmentStore } from "../store/developmentStore";
import { useAuthStore } from "../store/authStore";
import { useTeamStore } from "../store/teamStore";
import { useUserStore } from "../store/userStore";
import { useCallModeSessionStore } from "../store/callModeSessionStore";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { BusinessForm } from "../components/business/BusinessForm";
import { getBusinessColumns } from "../components/business/BusinessColumns";
import { BusinessFilters } from "../components/business/BusinessFilters";
import { CallModeModal } from "../components/business/CallModeModal";
import { Business } from "../types";
import { removeAcento } from "../utils/format";

export function BusinessPage() {
  const { user } = useAuthStore();
  const {
    businesses,
    loading: businessLoading,
    error: businessError,
    fetchBusinesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
  } = useBusinessStore();

  const {
    leads,
    loading: leadsLoading,
    fetchLeads,
    updateLead,
  } = useLeadStore();
  const {
    developments,
    loading: developmentsLoading,
    fetchDevelopments,
  } = useDevelopmentStore();
  const { teams, fetchTeams } = useTeamStore();
  const { users, loading: usersLoading, fetchUsers } = useUserStore();
  const { createSession, updateSession } = useCallModeSessionStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevelopment, setSelectedDevelopment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCallModeOpen, setIsCallModeOpen] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(
    null
  );
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState<Partial<Business>>({
    leadId: "",
    developmentId: "",
    source: "organic",
    status: "new",
    notes: "",
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchBusinesses();
    fetchDevelopments();
    fetchTeams();
    fetchUsers();
  }, [fetchBusinesses, fetchLeads, fetchDevelopments, fetchTeams, fetchUsers]);

  const teamBrokers = useMemo(() => {
    if (user?.role !== "teamLeader") return [];
    const leaderTeam = teams.find((t) => t.leaderId === user.id);
    return users.filter(
      (u) =>
        (u.teamId === leaderTeam?.id || leaderTeam?.leaderId === u.id) &&
        (u.role === "broker" || u.role === "teamLeader")
    );
  }, [users, user, teams]);

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

  useEffect(() => {
    if (hasValidationErrors) {
      setHasValidationErrors(false);
    }
  }, [selectedDevelopment, selectedStatus]);

  const filteredBusinesses = useMemo(() => {
    let filtered = businesses;
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
        filtered = filtered.filter((business) =>
          teamBrokerIds.includes(business.brokerId)
        );
      }
      if (selectedBroker) {
        filtered = filtered.filter(
          (business) => business.brokerId === selectedBroker
        );
      }
    } else if (user?.role === "teamLeader") {
      if (selectedBroker) {
        filtered = filtered.filter(
          (business) => business.brokerId === selectedBroker
        );
      } else {
        filtered = filtered.filter((business) =>
          teamBrokers.some((broker) => broker.id === business.brokerId)
        );
      }
    } else {
      filtered = filtered.filter((business) => business.brokerId === user?.id);
    }

    const searchLower = removeAcento(searchTerm.toLowerCase());
    filtered = filtered.filter((business) => {
      const lead = leads.find((lead) => lead.id === business.leadId);
      let matchesSearch;
      if (lead) {
        matchesSearch = removeAcento(
          lead.name ? lead.name.toLowerCase() : lead.name
        ).includes(searchLower);
      }
      const matchesDevelopment =
        !selectedDevelopment || business.developmentId === selectedDevelopment;
      const matchesStatus =
        !selectedStatus || business.status === selectedStatus;

      return matchesSearch && matchesDevelopment && matchesStatus;
    });

    if (selectedStatus === "new") {
      const withoutLastCall = filtered.filter((b) => !b.lastCallAt);
      const withLastCall = filtered.filter((b) => b.lastCallAt);

      withoutLastCall.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      withLastCall.sort(
        (a, b) =>
          new Date(a.lastCallAt!).getTime() - new Date(b.lastCallAt!).getTime()
      );

      filtered = [...withoutLastCall, ...withLastCall];
    }

    return filtered;
  }, [
    businesses,
    searchTerm,
    selectedDevelopment,
    selectedStatus,
    selectedTeam,
    selectedBroker,
    user,
    leads,
    users,
    teams,
    teamBrokers,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBusiness) {
        if (editingBusiness.status !== formData.status) {
          let countWhatsapp = 0;
          let countRecall = 0;
          let countScheduled = 0;
          let countLost = 0;
          let countTalked = 0;

          if (formData.status === "whatsapp") {
            countWhatsapp = 1;
          } else if (formData.status === "recall") {
            countRecall = 1;
            countTalked = 1;
          } else if (formData.status === "scheduled") {
            countScheduled = 1;
            countTalked = 1;
          } else if (formData.status === "lost") {
            countLost = 1;
          }
          await createSession({
            startTime: new Date(),
            endTime: new Date(),
            businessViewed: [],
            answeredCalls: 0,
            talkedCalls: countTalked,
            scheduledCalls: countScheduled,
            whatsappCalls: countWhatsapp,
            notInterestCalls: countLost,
            recallCalls: countRecall,
            voicemailCalls: 0,
            invalidNumberCalls: 0,
            notReceivingCalls: 0,
          });
        }

        await updateBusiness(editingBusiness.id, formData);
      } else {
        await addBusiness(formData as Required<typeof formData>);
      }
      handleCloseModal();
      fetchBusinesses();
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Erro ao salvar negócio"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBusiness(null);
    setFormData({
      leadId: "",
      developmentId: "",
      source: "organic",
      status: "new",
      notes: "",
    });
    setOperationError(null);
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setFormData(business);
    setIsModalOpen(true);
  };

  const handleDelete = (business: Business) => {
    setBusinessToDelete(business);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (businessToDelete) {
      try {
        await deleteBusiness(businessToDelete.id);
        setBusinessToDelete(null);
        setIsConfirmOpen(false);
      } catch (error) {
        setOperationError(
          error instanceof Error ? error.message : "Erro ao excluir negócio"
        );
      }
    }
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    setSelectedBroker("");
  };

  const handleStartCallMode = async () => {
    if (selectedStatus !== "new" || !selectedDevelopment) {
      setHasValidationErrors(true);
      return;
    }

    try {
      const session = await createSession({
        startTime: new Date(),
        endTime: new Date(),
        businessViewed: [],
        answeredCalls: 0,
        talkedCalls: 0,
        scheduledCalls: 0,
        whatsappCalls: 0,
        notInterestCalls: 0,
        recallCalls: 0,
        voicemailCalls: 0,
        invalidNumberCalls: 0,
        notReceivingCalls: 0,
      });
      setCurrentSessionId(session.id);
      setIsCallModeOpen(true);
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Erro ao iniciar modo de ligação"
      );
    }
  };

  const handleCallModeEnd = async (sessionData: {
    startTime: Date;
    endTime: Date;
    businessViewed: string[];
    answeredCalls: number;
    scheduledCalls: number;
    whatsappCalls: number;
    notInterestCalls: number;
    recallCalls: number;
    voicemailCalls: number;
    invalidNumberCalls: number;
    notReceivingCalls: number;
  }) => {
    try {
      if (currentSessionId) {
        await updateSession(currentSessionId, sessionData);
      }
      setCurrentSessionId(null);
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Erro ao salvar sessão do modo de ligação"
      );
    }
  };

  const handleStatusUpdate = async (
    businessId: string,
    updates: {
      status?: Business["status"];
      scheduledAt?: string;
      recallAt?: string;
      notes?: string;
      lastCallAt?: Date;
    }
  ) => {
    try {
      await updateBusiness(businessId, updates);
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do negócio"
      );
    }
  };

  const handleLeadUpdate = async (leadId: string, lastCallAt: Date) => {
    try {
      await updateLead(leadId, { lastContact: lastCallAt });
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar data de contato do lead"
      );
    }
  };

  const handleSessionUpdate = async (sessionData: {
    businessViewed: string[];
    answeredCalls: number;
    scheduledCalls: number;
    whatsappCalls: number;
    notInterestCalls: number;
    recallCalls: number;
    voicemailCalls: number;
    invalidNumberCalls: number;
    notReceivingCalls: number;
  }) => {
    try {
      if (currentSessionId) {
        await updateSession(currentSessionId, sessionData);
      }
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Erro ao atualizar sessão"
      );
    }
  };

  if (businessLoading || leadsLoading || developmentsLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Negócios {`(${filteredBusinesses.length})`}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleStartCallMode}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            Modo de Ligação
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Negócio
          </button>
        </div>
      </div>

      <BusinessFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDevelopment={selectedDevelopment}
        onDevelopmentChange={setSelectedDevelopment}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        developments={developments}
        showTeamFilter={user?.role === "admin"}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
        teams={teams}
        showBrokerFilter={user?.role === "teamLeader" || user?.role === "admin"}
        selectedBroker={selectedBroker}
        onBrokerChange={setSelectedBroker}
        teamBrokers={teamBrokers}
        availableBrokers={availableBrokers}
        hasValidationErrors={hasValidationErrors}
      />

      {(businessError || operationError) && (
        <ErrorMessage
          message={businessError || operationError || ""}
          onDismiss={() => {
            if (businessError) fetchBusinesses();
            setOperationError(null);
          }}
        />
      )}

      <Table
        data={filteredBusinesses}
        columns={getBusinessColumns()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBusiness ? "Editar Negócio" : "Novo Negócio"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BusinessForm
            formData={formData}
            setFormData={setFormData}
            leads={leads}
            developments={developments}
            isEditing={!!editingBusiness}
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
              {editingBusiness ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <CallModeModal
        isOpen={isCallModeOpen}
        onClose={() => setIsCallModeOpen(false)}
        businesses={filteredBusinesses}
        leads={leads}
        developments={developments}
        onSessionEnd={handleCallModeEnd}
        onStatusUpdate={handleStatusUpdate}
        sessionId={currentSessionId || ""}
        selectedStatus={selectedStatus || ""}
        onSessionUpdate={handleSessionUpdate}
        onLeadUpdate={handleLeadUpdate}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Negócio"
        message="Tem certeza que deseja excluir este negócio? Esta ação não pode ser desfeita."
      />
    </div>
  );
}