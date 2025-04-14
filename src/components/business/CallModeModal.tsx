import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "../common/Modal";
import { ErrorMessage } from "../common/ErrorMessage";
import { Pause, Edit2, Check, X as XIcon } from "lucide-react";
import { Business, Development, Lead } from "../../types";
import { formatPhoneDisplay, formatDateTime } from "../../utils/format";
import { api } from "../../services/api";
import { SessionTimer } from "./SessionTimer";

interface CallModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  leads: Lead[];
  developments: Development[];
  onSessionEnd: (sessionData: {
    startTime: Date;
    endTime: Date;
    businessViewed: string[];
    answeredCalls: number;
    talkedCalls: number;
    scheduledCalls: number;
    whatsappCalls: number;
    notInterestCalls: number;
    recallCalls: number;
    voicemailCalls: number;
    invalidNumberCalls: number;
    notReceivingCalls: number;
  }) => void;
  onStatusUpdate: (
    businessId: string,
    updates: {
      status: Business["status"];
      scheduledAt?: string | null;
      recallAt?: string | null;
      notes?: string | null;
      lastCallAt?: Date | null;
    }
  ) => Promise<void>;
  onLeadUpdate: (leadId: string, lastCallAt: Date) => Promise<void>;
  sessionId: string;
  selectedStatus: string;
  onSessionUpdate: (sessionData: {
    businessViewed: string[];
    answeredCalls: number;
    talkedCalls: number;
    scheduledCalls: number;
    whatsappCalls: number;
    notInterestCalls: number;
    recallCalls: number;
    voicemailCalls: number;
    invalidNumberCalls: number;
    notReceivingCalls: number;
  }) => Promise<void>;
}

export function CallModeModal({
  isOpen,
  onClose,
  businesses,
  leads,
  developments,
  onSessionEnd,
  onStatusUpdate,
  onLeadUpdate,
  sessionId,
  selectedStatus,
  onSessionUpdate,
}: CallModeModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [businessesViewed, setBusinessesViewed] = useState<string[]>([]);
  const [newBusinessesViewed, setNewBusinessesViewed] = useState<string[]>([]);
  const [localBusinesses, setLocalBusinesses] =
    useState<Business[]>(businesses);
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
  const [initialized, setInitialized] = useState(false);
  const [notes, setNotes] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Estados do status da chamada
  const [answered, setAnswered] = useState(false);
  const [talked, setTalked] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [notInterested, setNotInterested] = useState(false);
  const [voicemail, setVoicemail] = useState(false);
  const [numberNotExists, setNumberNotExists] = useState(false);
  const [notReceivingCalls, setNotReceivingCalls] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");

  // Contadores para o relatório
  const [answeredCount, setAnsweredCount] = useState(0);
  const [talkedCount, setTalkedCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [whatsappCount, setWhatsappCount] = useState(0);
  const [notInterestCount, setNotInterestCount] = useState(0);
  const [recallCount, setRecallCount] = useState(0);
  const [voicemailCount, setVoicemailCount] = useState(0);
  const [invalidNumberCount, setInvalidNumberCount] = useState(0);
  const [notReceivingCount, setNotReceivingCount] = useState(0);

  useEffect(() => {
    if (isOpen && businesses.length > 0 && !initialized) {
      setLocalBusinesses(businesses);
      setBusinessesViewed([businesses[0].id]);
      resetCallStatus();
      setCurrentIndex(0);
      setNotes(businesses[currentIndex].notes || "");
      setStartTime(new Date());
      setInitialized(true);
    } else if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen, businesses, initialized]);

  // Ouvir por novos negócios via WebSocket
  useEffect(() => {
    api.onMessage("NEW_BUSINESS", (newBusiness) => {
      const matchesFilters = businesses.some(
        (b) =>
          b.developmentId === newBusiness.developmentId &&
          b.status === newBusiness.status
      );

      if (matchesFilters) {
        setLocalBusinesses((prev) => [...prev, newBusiness]);
      }
    });
  }, [businesses]);

  const resetCallStatus = () => {
    setAnswered(false);
    setTalked(false);
    setScheduled(false);
    setRescheduled(false);
    setWhatsapp(false);
    setNotInterested(false);
    setVoicemail(false);
    setNumberNotExists(false);
    setNotReceivingCalls(false);
    setScheduledDateTime("");
  };

  const handleNext = async () => {
    // Primeiro atualiza os contadores com base no status atual
    let newAnsweredCount = answeredCount;
    let newTalkedCount = talkedCount;
    let newScheduledCount = scheduledCount;
    let newWhatsappCount = whatsappCount;
    let newNotInterestCount = notInterestCount;
    let newRecallCount = recallCount;
    let newVoicemailCount = voicemailCount;
    let newInvalidNumberCount = invalidNumberCount;
    let newNotReceivingCount = notReceivingCount;
    const newLocalBusinessesViewed = [
      ...newBusinessesViewed,
      businesses[currentIndex].id,
    ];

    if (answered) {
      newAnsweredCount++;
      if (talked) {
        newTalkedCount++;
        if (scheduled) {
          newScheduledCount++;
        }
      }
      if (rescheduled) {
        newRecallCount++;
      } else if (notInterested) {
        newNotInterestCount++;
      }
    } else {
      if (voicemail) {
        newVoicemailCount++;
      } else if (whatsapp) {
        newWhatsappCount++;
      } else if (numberNotExists) {
        newInvalidNumberCount++;
      } else if (notReceivingCalls) {
        newNotReceivingCount++;
      }
    }

    // Atualiza os contadores no estado
    setAnsweredCount(newAnsweredCount);
    setTalkedCount(newTalkedCount);
    setScheduledCount(newScheduledCount);
    setWhatsappCount(newWhatsappCount);
    setNotInterestCount(newNotInterestCount);
    setRecallCount(newRecallCount);
    setVoicemailCount(newVoicemailCount);
    setInvalidNumberCount(newInvalidNumberCount);
    setNotReceivingCount(newNotReceivingCount);
    setNewBusinessesViewed([
      ...newBusinessesViewed,
      businesses[currentIndex].id,
    ]);

    // Atualiza a sessão com os novos contadores
    await onSessionUpdate({
      businessViewed: newLocalBusinessesViewed,
      answeredCalls: newAnsweredCount,
      talkedCalls: newTalkedCount,
      scheduledCalls: newScheduledCount,
      whatsappCalls: newWhatsappCount,
      notInterestCalls: newNotInterestCount,
      recallCalls: newRecallCount,
      voicemailCalls: newVoicemailCount,
      invalidNumberCalls: newInvalidNumberCount,
      notReceivingCalls: newNotReceivingCount,
    });

    // Salva o status do negócio atual
    await saveCurrentStatus();

    // Update lastContact for this lead
    const thisLead = localLeads.find(
      (lead) => lead.id === businesses[currentIndex].leadId
    );
    const now = new Date();

    if (thisLead) {
      await onLeadUpdate(thisLead.id, now);
    }

    if (currentIndex <= businesses.length - 1) {
      let nextIndex = currentIndex;
      if (!answered && selectedStatus !== "new") {
        nextIndex++;
        setNotes(businesses[nextIndex].notes || "");
      } else {
        setNotes(businesses[nextIndex + 1].notes || "");
      }
      setCurrentIndex(nextIndex);
      // Adiciona o próximo negócio à lista de visualizados
      const nextBusinessId = businesses[nextIndex].id;
      if (!businessesViewed.includes(nextBusinessId)) {
        const updatedBusinessesViewed = [...businessesViewed, nextBusinessId];
        setBusinessesViewed(updatedBusinessesViewed);
      }
      // Atualiza as notas para o próximo negócio
      resetCallStatus();
    }
  };

  const handleStop = async () => {
    // Atualiza os contadores finais
    let finalAnsweredCount = answeredCount;
    let finalTalkedCount = talkedCount;
    let finalScheduledCount = scheduledCount;
    let finalWhatsappCount = whatsappCount;
    let finalNotInterestCount = notInterestCount;
    let finalRecallCount = recallCount;
    let finalVoicemailCount = voicemailCount;
    let finalInvalidNumberCount = invalidNumberCount;
    let finalNotReceivingCount = notReceivingCount;
    const newLocalBusinessesViewed = [
      ...newBusinessesViewed,
      businesses[currentIndex].id,
    ];
    if (answered) {
      finalAnsweredCount++;
      if (talked) {
        finalTalkedCount++;
        if (scheduled) {
          finalScheduledCount++;
        }
      }
      if (rescheduled) {
        finalRecallCount++;
      } else if (notInterested) {
        finalNotInterestCount++;
      }
    } else {
      if (voicemail) {
        finalVoicemailCount++;
      } else if (whatsapp) {
        finalWhatsappCount++;
      } else if (numberNotExists) {
        finalInvalidNumberCount++;
      } else if (notReceivingCalls) {
        finalNotReceivingCount++;
      }
    }

    // Salva o status do último negócio
    await saveCurrentStatus();

    // Update lastContact for this lead

    const thisLead = localLeads.find(
      (lead) => lead.id === businesses[currentIndex].leadId
    );
    const now = new Date();
    if (thisLead) {
      await onLeadUpdate(thisLead.id, now);
    }

    onSessionEnd({
      startTime,
      endTime: new Date(),
      businessViewed: newLocalBusinessesViewed,
      answeredCalls: finalAnsweredCount,
      talkedCalls: finalTalkedCount,
      scheduledCalls: finalScheduledCount,
      whatsappCalls: finalWhatsappCount,
      notInterestCalls: finalNotInterestCount,
      recallCalls: finalRecallCount,
      voicemailCalls: finalVoicemailCount,
      invalidNumberCalls: finalInvalidNumberCount,
      notReceivingCalls: finalNotReceivingCount,
    });
    setInitialized(false);
    onClose();
  };

  const saveCurrentStatus = async () => {
    const currentBusiness = businesses[currentIndex];
    if (!currentBusiness) return;

    let status: Business["status"] = currentBusiness.status;
    const now = new Date();
    const lastCallAt = now;
    const updates: {
      status: Business["status"];
      scheduledAt?: string | null;
      recallAt?: string | null;
      notes?: string | null;
      lastCallAt?: Date;
    } = {
      status,
      lastCallAt,
      scheduledAt: null,
      recallAt: null,
      notes,
    };
    if (answered) {
      if (talked) {
        if (scheduled) {
          status = "scheduled";
          updates.scheduledAt = scheduledDateTime;
        }
      }
      if (rescheduled) {
        status = "recall";
        updates.recallAt = scheduledDateTime;
      } else if (notInterested) {
        status = "lost";
      }
      if (whatsapp) {
        status = "whatsapp";
      }
    }
    updates.lastCallAt = now;
    updates.status = status;
    await onStatusUpdate(currentBusiness.id, updates);
  };

  const handleEditName = () => {
    const currentLead = localLeads.find(
      (lead) => lead.id === businesses[currentIndex].leadId
    );
    if (currentLead) {
      setTempName(currentLead.name);
      setEditingName(true);
    }
  };

  const handleSaveName = async () => {
    try {
      const currentLead = localLeads.find(
        (lead) => lead.id === businesses[currentIndex].leadId
      );
      if (currentLead && tempName.trim()) {
        await api.updateLead(currentLead.id, {
          ...currentLead,
          name: tempName.trim(),
        });
        setEditingName(false);
        setError(null);

        // Update local leads array
        setLocalLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === currentLead.id
              ? { ...lead, name: tempName.trim() }
              : lead
          )
        );
      }
    } catch (error) {
      setError("Erro ao atualizar o nome do lead");
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setTempName("");
    setError(null);
  };

  const currentBusiness = businesses[currentIndex];
  if (!currentBusiness) return null;

  const currentLead = localLeads.find(
    (lead) => lead.id === currentBusiness.leadId
  );
  const currentDevelopment = developments.find(
    (dev) => dev.id === currentBusiness.developmentId
  );

  if (!currentLead || !currentDevelopment) return null;

  const Toggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <label className="flex items-center justify-between cursor-pointer">
        <div className="relative inline-block w-12 h-6">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div
            className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              checked ? "bg-indigo-600" : "bg-gray-300"
            }`}
          />
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
              checked ? "transform translate-x-6" : "transform translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleStop} title="Modo de Ligação">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <SessionTimer startTime={startTime} />
          <div className="text-sm text-gray-500">
            Nº de Negócios: {businesses.length}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <div className="flex items-center mt-1">
                {editingName ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-green-600 hover:text-green-900">
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-900">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {currentLead.name}
                    </p>
                    <button
                      onClick={handleEditName}
                      className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                <a href={`tel:015 ${formatPhoneDisplay(currentLead.phone)}`}>
                  {`015 ${formatPhoneDisplay(currentLead.phone)}`}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Empreendimento
              </h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {currentDevelopment.name}
              </p>
            </div>
            {currentBusiness.lastCallAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Última Ligação
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatDateTime(currentBusiness.lastCallAt)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <Toggle
              label="Atendeu"
              checked={answered}
              onChange={(checked) => {
                setAnswered(checked);
                if (!checked) {
                  setTalked(false);
                  setScheduled(false);
                  setRescheduled(false);
                  setNotInterested(false);
                  setScheduledDateTime("");
                }
              }}
            />

            {answered && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                <Toggle
                  label="Conversou"
                  checked={talked}
                  onChange={(checked) => {
                    setTalked(checked);
                    if (!checked) {
                      setScheduled(false);
                      setScheduledDateTime("");
                    }
                  }}
                />

                {talked && (
                  <>
                    <Toggle
                      label="Agendou"
                      checked={scheduled}
                      onChange={(checked) => {
                        setScheduled(checked);
                        if (checked) {
                          setRescheduled(false);
                          setWhatsapp(false);
                          setNotInterested(false);
                        }
                      }}
                    />
                    {scheduled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Data e Hora
                        </label>
                        <input
                          type="datetime-local"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={scheduledDateTime}
                          onChange={(e) => setScheduledDateTime(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
                <Toggle
                  label="Retornar"
                  checked={rescheduled}
                  onChange={(checked) => {
                    setRescheduled(checked);
                    if (checked) {
                      setScheduled(false);
                      setWhatsapp(false);
                      setNotInterested(false);
                    }
                  }}
                />

                {rescheduled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data e Hora
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                    />
                  </div>
                )}

                <Toggle
                  label="Não tem interesse"
                  checked={notInterested}
                  onChange={(checked) => {
                    setNotInterested(checked);
                    if (checked) {
                      setScheduled(false);
                      setRescheduled(false);
                      setWhatsapp(false);
                    }
                  }}
                />
              </div>
            )}

            {!answered && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                <Toggle
                  label="Caixa Postal"
                  checked={voicemail}
                  onChange={setVoicemail}
                />

                <Toggle
                  label="Número não existe"
                  checked={numberNotExists}
                  onChange={setNumberNotExists}
                />

                <Toggle
                  label="Não recebe ligação"
                  checked={notReceivingCalls}
                  onChange={setNotReceivingCalls}
                />
              </div>
            )}
            <Toggle
              label="WhatsApp"
              checked={whatsapp}
              onChange={(checked) => {
                setWhatsapp(checked);
                if (checked) {
                  setScheduled(false);
                  setRescheduled(false);
                  setNotInterested(false);
                }
              }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Anotações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Adicione suas anotações aqui..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleStop}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            <Pause className="h-4 w-4 mr-2" />
            Parar
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === businesses.length - 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Próximo
          </button>
        </div>
      </div>
    </Modal>
  );
}
