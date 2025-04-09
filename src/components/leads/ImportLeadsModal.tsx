import React, { useState, useCallback } from "react";
import { Modal } from "../common/Modal";
import { ErrorMessage } from "../common/ErrorMessage";
import { Upload, AlertCircle, Search, X, FileText } from "lucide-react";
import { read, utils } from "xlsx";
import { Combobox } from "../common/Combobox";
import { User, Development } from "../../types";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: any[]) => Promise<any[]>;
  brokers: User[];
  developments: Development[];
  showBrokerField?: boolean;
  currentUserId: string;
}

export function ImportLeadsModal({
  isOpen,
  onClose,
  onImport,
  brokers,
  developments,
  showBrokerField = false,
  currentUserId,
}: ImportLeadsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedDevelopments, setSelectedDevelopments] = useState<string[]>(
    []
  );
  const [fileData, setFileData] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [haveBusiness, setHaveBusiness] = useState<any[] | null>(null);
  const [numberImports, setNumberImports] = useState(0);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const data = await file.arrayBuffer();
        const workbook = read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);

        // Validate required columns
        const requiredColumns = ["nome", "telefone"];
        const headers = Object.keys(jsonData[0] || {}).map((header) =>
          header.toLowerCase()
        );

        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          setError(
            `Colunas obrigatórias ausentes: ${missingColumns.join(", ")}`
          );
          setFileName(null);
          return;
        }

        setFileData(jsonData);
        setFileName(file.name);
        setError(null);
      } catch (error) {
        setError(
          "Erro ao processar o arquivo. Verifique o formato e tente novamente."
        );
        setFileName(null);
      }
    },
    []
  );

  const handleRemoveFile = () => {
    setFileData(null);
    setFileName(null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImport = async () => {
    if (showBrokerField && !selectedBroker) {
      setError("Selecione um corretor para atribuir os leads");
      return;
    }
    if (selectedDevelopments.length === 0) {
      setError("Selecione pelo menos um empreendimento");
      return;
    }
    if (!fileData) {
      setError("Nenhum arquivo selecionado");
      return;
    }

    try {
      setNumberImports(0);
      setHaveBusiness([]);
      setIsLoading(true);
      setError(null);

      // Transform data to match API format
      const leads = fileData.map((row: any) => ({
        name: row.nome,
        phone: row.telefone.toString().replace(/\D/g, ""),
        developmentsInterest: selectedDevelopments,
        brokerId: showBrokerField ? selectedBroker : currentUserId,
        source: "importedList",
      }));
      setNumberImports(leads.length);
      setHaveBusiness(await onImport(leads));
    } catch (error) {
      setError("Erro ao importar leads. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const brokerOptions = [
    { id: "", label: "" },
    ...brokers.map((broker) => ({
      id: broker.id,
      label: broker.name,
    })),
  ];

  const filteredDevelopments = developments.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedDevelopments.includes(dev.id)
  );

  const handleAddDevelopment = (developmentId: string) => {
    setSelectedDevelopments([...selectedDevelopments, developmentId]);
    setSearchTerm("");
  };

  const handleRemoveDevelopment = (developmentId: string) => {
    setSelectedDevelopments(
      selectedDevelopments.filter((id) => id !== developmentId)
    );
  };

  const getSelectedDevelopmentNames = () => {
    return selectedDevelopments
      .map((id) => developments.find((dev) => dev.id === id))
      .filter((dev): dev is Development => dev !== undefined);
  };

  const handleClose = () => {
    setHaveBusiness([]);
    setNumberImports(0);
    setSelectedBroker("");
    setSelectedDevelopments([]);
    setSearchTerm("");
    setFileData(null);
    setFileName(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importar Leads do Excel">
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Instruções</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">
                  O arquivo Excel deve conter as seguintes colunas:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>nome</strong>: Nome do lead
                  </li>
                  <li>
                    <strong>telefone</strong>: Número de telefone (apenas
                    números)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {showBrokerField && (
          <Combobox
            options={brokerOptions}
            value={selectedBroker}
            onChange={setSelectedBroker}
            placeholder="Selecione um corretor"
            label="Corretor Responsável"
            required
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Empreendimentos
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Pesquisar empreendimentos..."
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {isSearchFocused && filteredDevelopments.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredDevelopments.map((development) => (
                  <div
                    key={development.id}
                    onClick={() => handleAddDevelopment(development.id)}
                    className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50">
                    {development.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {getSelectedDevelopmentNames().map((development) => (
              <div
                key={development.id}
                className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                {development.name}
                <button
                  type="button"
                  onClick={() => handleRemoveDevelopment(development.id)}
                  className="ml-2 inline-flex items-center rounded-full p-0.5 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {selectedDevelopments.length === 0 && (
            <p className="mt-2 text-sm text-red-600">
              Selecione pelo menos um empreendimento
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Arquivo Excel
          </label>
          <div className="mt-1 flex flex-col gap-4">
            {fileName ? (
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <FileText className="h-4 w-4 mr-2" />
                  {fileName}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 inline-flex items-center rounded-full p-0.5 text-green-800 hover:bg-green-200 hover:text-green-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Selecione um arquivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">XLSX, XLS até 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {haveBusiness && (
          <div>
            {haveBusiness.map((business) => (
              <p className="mt-2 text-sm text-red-600" key={business.id}>
                Lead {business.leadName} | {business.developmentName} - Corretor{" "}
                {business.brokerName}
              </p>
            ))}
            {
              <p className="mt-2 text-sm text-green-600">
                Total duplicados: {haveBusiness.length} | Total cadastrados:{" "}
                {numberImports - haveBusiness.length}
              </p>
            }
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            {haveBusiness ? "Fechar" : "Cancelar"}
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isLoading || !fileData}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Importando..." : "Importar Leads"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
