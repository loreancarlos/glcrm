export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}


// Função para converter data do formato DD/MM/YYYY para YYYY-MM-DD (formato do PostgreSQL)
export function formatDateToAPI(date: string): string {
  if (!date) return '';
  
  // Se a data já estiver no formato YYYY-MM-DD, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Converte de DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Função para converter data do formato YYYY-MM-DD (formato do PostgreSQL) para DD/MM/YYYY
export function formatDateFromAPI(date: string): string {
  if (!date) return '';
  
  // Se a data já estiver no formato DD/MM/YYYY, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  // Converte de YYYY-MM-DD para DD/MM/YYYY
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

// Função para formatar data do input type="date" (YYYY-MM-DD) para exibição (DD/MM/YYYY)
export function formatDateForDisplay(date: string): string {
  if (!date) return '';
  return formatDateFromAPI(date);
}

// Função para formatar data de exibição (DD/MM/YYYY) para input type="date" (YYYY-MM-DD)
export function formatDateForInput(date: string): string {
  if (!date) return '';
  return formatDateToAPI(date);
}

// Função para validar se uma string está no formato DD/MM/YYYY
export function isValidDateFormat(date: string): boolean {
  if (!date) return false;
  
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(date)) return false;
  
  const [, day, month, year] = date.match(regex) || [];
  const numDay = parseInt(day, 10);
  const numMonth = parseInt(month, 10);
  const numYear = parseInt(year, 10);
  
  if (numMonth < 1 || numMonth > 12) return false;
  
  const lastDayOfMonth = new Date(numYear, numMonth, 0).getDate();
  if (numDay < 1 || numDay > lastDayOfMonth) return false;
  
  return true;
}