import { ChangeEvent } from "react";
import { exportData, importDataFromFile } from "../../services/exportService";
import Styles from "./ExportImportForm.module.css";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function getExportInfo(): { lastExported: string; nextReminder: string } {
  const raw = localStorage.getItem("cofeed_last_export_date");
  if (!raw) return { lastExported: "Never", nextReminder: "Soon" };
  const ts = Number(raw);
  const nextTs = ts + THIRTY_DAYS_MS;
  return {
    lastExported: new Date(ts).toLocaleDateString(),
    nextReminder: new Date(nextTs).toLocaleDateString(),
  };
}

async function onExportClick() {
  exportData();
}

async function onFileLoad(e: ChangeEvent<HTMLInputElement>) {
  const dataFile = e.target.files?.[0];
  const text = await dataFile?.text();
  text && importDataFromFile(text);
}

export function ExportImportForm() {
  const { lastExported, nextReminder } = getExportInfo();

  return (
    <details className={Styles.form}>
      <summary>Export/Import</summary>
      <p>
        In case if you want to move to a new browser or new device you can
        export the current state of your feeds and favorites:
      </p>
      <p>Last exported: {lastExported}</p>
      <p>Next reminder: {nextReminder}</p>
      <button onClick={onExportClick}>Export data</button>
      <hr />
      <p>Import from file</p>
      <input type="file" name="my_files[]" onChange={onFileLoad} />
    </details>
  );
}
