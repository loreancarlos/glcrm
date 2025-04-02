import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { useDevelopmentStore } from "../store/developmentStore";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { SearchInput } from "../components/common/SearchInput";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Development } from "../types";
import { getDeleteDevelopmentErrorMessage } from "../utils/developmentValidations";
import { getDevelopmentColumns } from "../components/developments/DevelopmentColumns";
import { DevelopmentForm } from "../components/developments/DevelopmentForm";

const initialFormData = {
  name: "",
  location: "",
  description: "",
};

export function Developments() {
  const {
    developments,
    loading,
    error,
    fetchDevelopments,
    addDevelopment,
    updateDevelopment,
    deleteDevelopment,
  } = useDevelopmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [developmentToDelete, setDevelopmentToDelete] =
    useState<Development | null>(null);
  const [editingDevelopment, setEditingDevelopment] =
    useState<Development | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchDevelopments();
  }, [fetchDevelopments]);

  const columns = getDevelopmentColumns();

  const filteredDevelopments = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return developments.filter(
      (development) =>
        development.name.toLowerCase().includes(searchTermLower) ||
        development.location.toLowerCase().includes(searchTermLower) ||
        development.description.toLowerCase().includes(searchTermLower)
    );
  }, [developments, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const developmentData = {
        ...formData,
      };

      if (editingDevelopment) {
        await updateDevelopment(editingDevelopment.id, developmentData);
      } else {
        await addDevelopment(developmentData);
      }
      handleCloseModal();
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Erro ao salvar empreendimento"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDevelopment(null);
    setFormData(initialFormData);
    setOperationError(null);
  };

  const handleEdit = (development: Development) => {
    setEditingDevelopment(development);
    setFormData({
      ...development,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (development: Development) => {
    const errorMessage = getDeleteDevelopmentErrorMessage(development.id);
    if (errorMessage) {
      setOperationError(errorMessage);
      return;
    }

    setDevelopmentToDelete(development);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (developmentToDelete) {
      try {
        await deleteDevelopment(developmentToDelete.id);
        setDevelopmentToDelete(null);
        setIsConfirmOpen(false);
      } catch (error) {
        setOperationError(
          error instanceof Error
            ? error.message
            : "Erro ao excluir empreendimento"
        );
      }
    }
  };

  if (loading && !developments.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Empreendimentos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Empreendimento
        </button>
      </div>

      <div className="max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome, localização ou descrição..."
        />
      </div>

      {(error || operationError) && (
        <ErrorMessage
          message={operationError || error || ""}
          onDismiss={() => {
            if (error) fetchDevelopments();
            setOperationError(null);
          }}
        />
      )}

      <Table
        data={filteredDevelopments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingDevelopment ? "Editar Empreendimento" : "Novo Empreendimento"
        }>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DevelopmentForm
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingDevelopment}
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
              {editingDevelopment ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Empreendimento"
        message="Tem certeza que deseja excluir este empreendimento? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
