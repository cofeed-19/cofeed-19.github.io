const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
export const LAST_EXPORT_KEY = "cofeed_last_export_date";

export function shouldShowExportReminder(): boolean {
  const lastExport = localStorage.getItem(LAST_EXPORT_KEY);
  if (!lastExport) {
    localStorage.setItem(LAST_EXPORT_KEY, Date.now().toString());
    return false;
  }
  return Date.now() - Number(lastExport) >= THIRTY_DAYS_MS;
}

export function dismissExportReminder(): void {
  localStorage.setItem(LAST_EXPORT_KEY, Date.now().toString());
}
