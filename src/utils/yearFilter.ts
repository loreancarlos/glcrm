export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getYearFromDate(dateString: string): number {
  return new Date(dateString).getFullYear();
}

export function generateYearOptions(
  startYear: number
): Array<{ id: string; label: string }> {
  const currentYear = getCurrentYear();
  const years: Array<{ id: string; label: string }> = [];

  for (let year = currentYear; year >= startYear; year--) {
    years.push({
      id: year.toString(),
      label: year.toString(),
    });
  }

  return years;
}
