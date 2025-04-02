import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  UserCheck,
  UserX,
  Clock,
  Edit2,
  Trash2,
  Key,
  Users as UsersIcon,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useTeamStore } from "../store/teamStore";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { UserForm } from "../components/users/UserForm";
import { AdminResetPasswordModal } from "../components/users/AdminResetPasswordModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { TeamForm } from "../components/teams/TeamForm";
import { TeamMemberList } from "../components/teams/TeamMemberList";
import { User, Team } from "../types";
import { formatLastDate } from "../utils/format";
import { SearchInput } from "../components/common/SearchInput";

export function Users() {
  const {
    users,
    loading: usersLoading,
    error: usersError,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    adminResetPassword,
  } = useUserStore();

  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
    fetchTeams,
    addTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
  } = useTeamStore();

  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [searchTeamTerm, setSearchTeamTerm] = useState("");

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false);
  const [isUserConfirmOpen, setIsUserConfirmOpen] = useState(false);
  const [isTeamConfirmOpen, setIsTeamConfirmOpen] = useState(false);

  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] =
    useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[] | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "user",
    active: true,
  });
  const [teamFormData, setTeamFormData] = useState<Partial<Team>>({
    name: "",
    leaderId: "",
  });
  const [operationUserError, setOperationUserError] = useState<string | null>(
    null
  );
  const [operationTeamError, setOperationTeamError] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, [fetchUsers, fetchTeams]);

  // Atualiza a lista de membros quando há mudanças nos usuários
  useEffect(() => {
    if (selectedTeam) {
      const updatedMembers = users.filter((u) => u.teamId === selectedTeam.id);
      setTeamMembers(updatedMembers);
    }
  }, [users, selectedTeam]);

  const filteredUsers = useMemo(() => {
    const searchTermLower = searchUserTerm.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTermLower)
    );
  }, [users, searchUserTerm]);

  const filteredTeams = useMemo(() => {
    const searchTermLower = searchTeamTerm.toLowerCase();
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTermLower) ||
        users
          .find((user) => user.id === team.leaderId)
          ?.name.toLowerCase()
          .includes(searchTermLower) ||
        users
          .find((user) => user.teamId === team.id)
          ?.name.toLowerCase()
          .includes(searchTermLower)
    );
  }, [teams, users, searchTeamTerm]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userFormData);
      } else {
        await addUser(userFormData);
      }
      handleCloseUserModal();
    } catch (error) {
      setOperationUserError(
        error instanceof Error ? error.message : "Erro ao salvar usuário"
      );
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, teamFormData);
      } else {
        await addTeam(teamFormData);
      }
      handleCloseTeamModal();
    } catch (error) {
      setOperationTeamError(
        error instanceof Error ? error.message : "Erro ao salvar equipe"
      );
    }
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserFormData({
      name: "",
      email: "",
      role: "user",
      active: true,
    });
    setOperationUserError(null);
  };

  const handleCloseTeamModal = () => {
    setIsTeamModalOpen(false);
    setEditingTeam(null);
    setTeamFormData({
      name: "",
      leaderId: "",
    });
    setOperationTeamError(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData(user);
    setIsUserModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamFormData(team);
    setIsTeamModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsUserConfirmOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setIsTeamConfirmOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleUserStatus(id);
    } catch (error) {
      setOperationUserError(
        error instanceof Error ? error.message : "Erro ao alterar status"
      );
    }
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    try {
      await adminResetPassword(userId, newPassword);
    } catch (error) {
      setOperationUserError(
        error instanceof Error ? error.message : "Erro ao redefinir senha"
      );
    }
  };

  const handleShowTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    const teamMembers = users.filter((user) => user.teamId === team.id);
    setTeamMembers(teamMembers);
    setIsTeamDetailsModalOpen(true);
  };

  const handleAddTeamMember = async (teamId: string, userId: string) => {
    try {
      await addTeamMember(teamId, userId);
      await fetchUsers();
    } catch (error) {
      setOperationTeamError(
        error instanceof Error ? error.message : "Erro ao adicionar membro"
      );
    }
  };

  const handleRemoveTeamMember = async (userId: string) => {
    try {
      await removeTeamMember(userId);
      await fetchUsers();
    } catch (error) {
      setOperationTeamError(
        error instanceof Error ? error.message : "Erro ao remover membro"
      );
    }
  };

  const confirmUserDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setUserToDelete(null);
        setIsUserConfirmOpen(false);
      } catch (error) {
        setOperationUserError(
          error instanceof Error ? error.message : "Erro ao excluir usuário"
        );
      }
    }
  };

  const confirmTeamDelete = async () => {
    if (teamToDelete) {
      try {
        await deleteTeam(teamToDelete.id);
        setTeamToDelete(null);
        setIsTeamConfirmOpen(false);
      } catch (error) {
        setOperationTeamError(
          error instanceof Error ? error.message : "Erro ao excluir time"
        );
      }
    }
  };

  const getRoleDisplay = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "broker":
        return "Corretor";
      case "teamLeader":
        return "Supervisor";
      default:
        return "Usuário";
    }
  };

  const userColumns = [
    { header: "Nome", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    {
      header: "Perfil",
      accessor: "role" as const,
      render: (value: User["role"]) => getRoleDisplay(value),
    },
    {
      header: "Status",
      accessor: "active" as const,
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          {value ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      header: "Último Acesso",
      accessor: "lastLogin" as const,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{formatLastDate(value)}</span>
        </div>
      ),
    },
    {
      header: "Criado em",
      accessor: "createdAt" as const,
      render: (value: string) => formatLastDate(value),
    },
  ];

  const teamColumns = [
    { header: "Nome", accessor: "name" as const },
    {
      header: "Líder",
      accessor: "leaderId" as const,
      render: (leaderId: string) => {
        const leader = users.find((user) => user.id === leaderId);
        return leader?.name || "Líder não encontrado";
      },
    },
    {
      header: "Membros",
      accessor: "id" as const,
      render: (teamId: string) => {
        const memberCount = users.filter(
          (user) => user.teamId === teamId
        ).length;
        return memberCount;
      },
    },
  ];

  const renderUserActions = (user: User) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => handleEditUser(user)}
        className="text-indigo-600 hover:text-indigo-900"
        title="Editar usuário">
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleToggleStatus(user.id)}
        className={`p-1 rounded-full ${
          user.active
            ? "text-red-600 hover:text-red-900"
            : "text-green-600 hover:text-green-900"
        }`}
        title={user.active ? "Desativar usuário" : "Ativar usuário"}>
        {user.active ? (
          <UserX className="h-4 w-4" />
        ) : (
          <UserCheck className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => setSelectedUserForPasswordReset(user)}
        className="text-yellow-600 hover:text-yellow-900"
        title="Redefinir senha">
        <Key className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDeleteUser(user)}
        className="text-red-600 hover:text-red-900"
        title="Excluir usuário">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  const renderTeamActions = (team: Team) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => handleShowTeamDetails(team)}
        className="text-indigo-600 hover:text-indigo-900"
        title="Ver detalhes">
        <UsersIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleEditTeam(team)}
        className="text-indigo-600 hover:text-indigo-900"
        title="Editar equipe">
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDeleteTeam(team)}
        className="text-red-600 hover:text-red-900"
        title="Excluir equipe">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (usersLoading || teamsLoading) {
    return <LoadingSpinner />;
  }

  // Filter team leaders who are not already leading a team
  const availableTeamLeaders = users.filter(
    (user) =>
      user.role === "teamLeader" &&
      user.active &&
      (!editingTeam
        ? !teams.some((team) => team.leaderId === user.id)
        : !teams.some(
            (team) => team.leaderId === user.id && team.id !== editingTeam.id
          ))
  );

  const availableMembers = users.filter(
    (user) => !user.teamId && user.active && user.role === "broker"
  );

  return (
    <div className="space-y-8">
      {/* Seção de Equipes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Equipes</h1>
          <button
            onClick={() => setIsTeamModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Equipe
          </button>
        </div>

        <div className="max-w-md">
          <SearchInput
            value={searchTeamTerm}
            onChange={setSearchTeamTerm}
            placeholder="Pesquisar por nome do time, líder de equipe ou membros..."
          />
        </div>

        {(teamsError || operationTeamError) && (
          <ErrorMessage
            message={operationTeamError || teamsError || ""}
            onDismiss={() => {
              if (teamsError) fetchTeams();
              setOperationTeamError(null);
            }}
          />
        )}

        <Table
          data={filteredTeams}
          columns={teamColumns}
          renderActions={renderTeamActions}
        />
      </div>

      {/* Seção de Usuários */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Usuários</h1>
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </button>
        </div>

        <div className="max-w-md">
          <SearchInput
            value={searchUserTerm}
            onChange={setSearchUserTerm}
            placeholder="Pesquisar por nome..."
          />
        </div>

        {(usersError || operationUserError) && (
          <ErrorMessage
            message={operationUserError || usersError || ""}
            onDismiss={() => {
              if (usersError) fetchUsers();
              setOperationUserError(null);
            }}
          />
        )}

        <Table
          data={filteredUsers}
          columns={userColumns}
          renderActions={renderUserActions}
        />
      </div>

      {/* Modal de Novo Usuário */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        title={editingUser ? "Editar Usuário" : "Novo Usuário"}>
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <UserForm
            formData={userFormData}
            setFormData={setUserFormData}
            isEditing={!!editingUser}
          />
          {operationUserError && <ErrorMessage message={operationUserError} />}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseUserModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              {editingUser ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Nova Equipe */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={handleCloseTeamModal}
        title={editingTeam ? "Editar Equipe" : "Nova Equipe"}>
        <form onSubmit={handleTeamSubmit} className="space-y-4">
          <TeamForm
            formData={teamFormData}
            setFormData={setTeamFormData}
            teamLeaders={availableTeamLeaders}
            isEditing={!!editingTeam}
          />
          {operationTeamError && <ErrorMessage message={operationTeamError} />}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseTeamModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              {editingTeam ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Detalhes da Equipe */}
      <Modal
        isOpen={isTeamDetailsModalOpen}
        onClose={() => {
          setIsTeamDetailsModalOpen(false);
          setSelectedTeam(null);
          setTeamMembers(null);
        }}
        title={`Detalhes da Equipe - ${selectedTeam?.name || ""}`}>
        <div className="space-y-6">
          {selectedTeam && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Nome da Equipe
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTeam.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Líder da Equipe
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {users.find((u) => u.id === selectedTeam.leaderId)?.name ||
                      "Líder não encontrado"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Adicionar Membro
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) =>
                      handleAddTeamMember(selectedTeam.id, e.target.value)
                    }
                    value="">
                    <option value="">Selecione um membro</option>
                    {availableMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({getRoleDisplay(member.role)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <TeamMemberList
                members={teamMembers}
                onRemoveMember={handleRemoveTeamMember}
              />
            </>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsTeamDetailsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Fechar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Reset de Senha */}
      <AdminResetPasswordModal
        isOpen={!!selectedUserForPasswordReset}
        onClose={() => setSelectedUserForPasswordReset(null)}
        onSubmit={handleResetPassword}
        userName={selectedUserForPasswordReset?.name || ""}
        userId={selectedUserForPasswordReset?.id || ""}
      />

      {/* Diálogo de Confirmação - Usuários*/}
      <ConfirmDialog
        isOpen={isUserConfirmOpen}
        onClose={() => setIsUserConfirmOpen(false)}
        onConfirm={confirmUserDelete}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
      />

      {/* Diálogo de Confirmação - Times*/}
      <ConfirmDialog
        isOpen={isTeamConfirmOpen}
        onClose={() => setIsTeamConfirmOpen(false)}
        onConfirm={confirmTeamDelete}
        title="Excluir Time"
        message="Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
