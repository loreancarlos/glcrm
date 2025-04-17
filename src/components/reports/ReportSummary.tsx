import React from "react";
import { ReportData } from "../../types";

interface ReportSummaryProps {
  data: ReportData;
}

export function ReportSummary({ data }: ReportSummaryProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Resumo das Ligações</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Tentativas de Contato</p>
          <p className="text-xl font-bold">{data.totalBusinessViewed}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Atenderam</p>
          <p className="text-xl font-bold">{data.answeredCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Conversaram</p>
          <p className="text-xl font-bold">{data.talkedCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Agendaram</p>
          <p className="text-xl font-bold">{data.scheduledCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">WhatsApp</p>
          <p className="text-xl font-bold">{data.whatsappCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Sem Interesse</p>
          <p className="text-xl font-bold">{data.notInterestCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Religaram</p>
          <p className="text-xl font-bold">{data.recallCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Caixa Postal</p>
          <p className="text-xl font-bold">{data.voicemailCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Número Não Existe</p>
          <p className="text-xl font-bold">{data.invalidNumberCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Não Recebe Ligação</p>
          <p className="text-xl font-bold">{data.notReceivingCalls}</p>
        </div>
      </div>
    </div>
  );
}