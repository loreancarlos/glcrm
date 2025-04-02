import { Sale, Client, Development, CalendarCharge } from "../types";
import { addMonths } from "./dates";

export function getMonthlyCharges(
  sales: Sale[],
  clients: Client[],
  developments: Development[],
  currentDate: Date
): CalendarCharge[] {
  const charges: CalendarCharge[] = [];
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  sales.forEach((sale) => {
    if (sale.status !== "active") return;

    const client = clients.find((c) => c.id === sale.clientId);
    const development = developments.find(
      (d) => d.id === sale.developmentId
    );

    if (!client || !development) return;

    const firstInstallmentDate = new Date(sale.firstInstallmentDate);
    firstInstallmentDate.setHours(firstInstallmentDate.getHours() + 3);
    const installmentValue =
      (sale.totalValue - sale.downPayment) /
      sale.installments;

    // Calculate all installments for this sale
    for (let i = 0; i < sale.installments; i++) {
      const dueDate = addMonths(firstInstallmentDate, i);

      // Only include charges for the current month/year
      if (
        dueDate.getMonth() === currentMonth &&
        dueDate.getFullYear() === currentYear
      ) {
        charges.push({
          clientId: client.id,
          clientName: client.name,
          developmentId: development.id,
          developmentName: development.name,
          value: installmentValue,
          dueDate: dueDate,
          installmentNumber: i + 1,
          totalInstallments: sale.installments,
        });
      }
    }
  });

  return charges;
}