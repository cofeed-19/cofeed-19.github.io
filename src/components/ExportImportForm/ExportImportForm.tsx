import { ChangeEvent } from "react";
import { exportData, importDataFromFile } from "../../services/exportService";
import Styles from "./ExportImportForm.module.css";

async function onExportClick() {
  exportData();
}

async function onFileLoad(e: ChangeEvent<HTMLInputElement>) {
  const dataFile = e.target.files?.[0];
  const text = await dataFile?.text();
  text && importDataFromFile(text);
}

export function ExportImportForm() {
  return (
    <details className={Styles.form}>
      <summary>Export/Import</summary>
      <p>
        In case if you want to move to a new browser or new device you can
        export the current state of your feeds and favorites:
      </p>
      <button onClick={onExportClick}>Export data</button>
      <hr />
      <p>Import from file</p>
      <input type="file" name="my_files[]" onChange={onFileLoad} />
    </details>
  );
}
