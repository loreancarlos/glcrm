import React from "react";
import { ReportData } from "../../types";

interface ReportSummaryProps {
  data: ReportData;
}

export function ReportSummary({ data }: ReportSummaryProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-dark-secondary">
      <h2
        className="text-lg font-semibold mb-4 dark:text-white
">
        Resumo das Ligações
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover">
          <p className="text-sm text-gray-500 dark:text-white">Tentativas de Contato</p>
          <p className="text-xl font-bold dark:text-white">{data.totalBusinessViewed}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Atenderam</p>
          <p className="text-xl font-bold dark:text-white">{data.answeredCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Conversaram</p>
          <p className="text-xl font-bold dark:text-white">{data.talkedCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Agendaram</p>
          <p className="text-xl font-bold dark:text-white">{data.scheduledCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">WhatsApp</p>
          <p className="text-xl font-bold dark:text-white">{data.whatsappCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Sem Interesse</p>
          <p className="text-xl font-bold dark:text-white">{data.notInterestCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Religaram</p>
          <p className="text-xl font-bold dark:text-white">{data.recallCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Caixa Postal</p>
          <p className="text-xl font-bold dark:text-white">{data.voicemailCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Número Não Existe</p>
          <p className="text-xl font-bold dark:text-white">{data.invalidNumberCalls}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover ">
          <p className="text-sm text-gray-500 dark:text-white">Não Recebe Ligação</p>
          <p className="text-xl font-bold dark:text-white">{data.notReceivingCalls}</p>
        </div>
      </div>
    </div>
  );
}
