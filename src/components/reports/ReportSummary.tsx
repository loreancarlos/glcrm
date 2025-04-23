import React from "react";
import { ReportData } from "../../types";

interface ReportSummaryProps {
  data: ReportData;
}

export function ReportSummary({ data }: ReportSummaryProps) {
  // Calculate percentages for the metrics
  const totalCalls = data.totalBusinessViewed;
  const answeredPercentage = ((data.answeredCalls / totalCalls) * 100).toFixed(
    1
  );
  const talkedPercentage = (
    (data.talkedCalls / data.answeredCalls) *
    100
  ).toFixed(1);
  const scheduledPercentage = (
    (data.scheduledCalls / data.talkedCalls) *
    100
  ).toFixed(1);

  const metrics = [
    {
      title: "Tentativas de Contato",
      value: data.totalBusinessViewed,
      gradient: "from-purple-500 to-pink-500",
      percentage: totalCalls > 0 ? "100" : "0",
    },
    {
      title: "Atenderam",
      value: data.answeredCalls,
      gradient: "from-blue-500 to-teal-500",
      percentage: parseInt(answeredPercentage) > 0 ? answeredPercentage : "0",
    },
    {
      title: "Conversaram",
      value: data.talkedCalls,
      gradient: "from-yellow-500 to-orange-500",
      percentage: parseInt(talkedPercentage) > 0 ? talkedPercentage : "0",
    },
    {
      title: "Agendaram",
      value: data.scheduledCalls,
      gradient: "from-green-500 to-emerald-500",
      percentage: parseInt(scheduledPercentage) > 0 ? scheduledPercentage : "0",
    },
  ];

  const secondaryMetrics = [
    {
      title: "WhatsApp",
      value: data.whatsappCalls,
      icon: "📱",
    },
    {
      title: "Sem Interesse",
      value: data.notInterestCalls,
      icon: "❌",
    },
    {
      title: "Religaram",
      value: data.recallCalls,
      icon: "📞",
    },
    {
      title: "Caixa Postal",
      value: data.voicemailCalls,
      icon: "📧",
    },
    {
      title: "Número Inválido",
      value: data.invalidNumberCalls,
      icon: "⚠️",
    },
    {
      title: "Não Recebe",
      value: data.notReceivingCalls,
      icon: "🚫",
    },
  ];

  return (
    <div className="mt-8 space-y-8">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.title}
                </h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.percentage}%
                </span>
              </div>
              <div className="flex items-baseline">
                <p className="text-xl font-semibold dark:text-white">
                  {metric.value}
                </p>
              </div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full`}
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {secondaryMetrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white dark:bg-dark-secondary rounded-lg p-4 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{metric.icon}</span>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.title}
                </h3>
                <p className="text-xl font-semibold dark:text-white">
                  {metric.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
