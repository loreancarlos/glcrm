import { addMonths } from './dates';

export function calculateInstallmentWithInterest(
  baseValue: number,
  interestRate: number,
  firstInstallmentDate: Date,
  installmentNumber: number
): number {
  if (interestRate <= 0) return baseValue;

  // Calcula quantos períodos de 12 meses completos se passaram
  const installmentDate = addMonths(firstInstallmentDate, installmentNumber - 1);
  const monthsDiff = (
    installmentDate.getFullYear() - firstInstallmentDate.getFullYear()
  ) * 12 + (installmentDate.getMonth() - firstInstallmentDate.getMonth());
  
  // Número de anos completos para aplicação dos juros
  const completedYears = Math.floor(monthsDiff / 12);
  
  // Aplica juros compostos apenas para anos completos
  const annualInterest = interestRate / 100;
  return baseValue * Math.pow(1 + annualInterest, completedYears);
}