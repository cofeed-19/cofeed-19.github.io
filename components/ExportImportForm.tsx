import { ChangeEvent } from "react";
import { exportFeed, importFeedFromFile } from "../services/exportService";
import Styles from "../styles/ExportImportForm.module.css";

async function onExportClick() {
  exportFeed();
}

async function onFileLoad(e: ChangeEvent<HTMLInputElement>) {
  const feedFile = e.target.files?.[0];
  const text = await feedFile?.text();
  text && importFeedFromFile(text);
}

export function ExportImportForm() {
  return (
    <details className={Styles.form}>
      <summary>Export/Import</summary>
      <p>
        In case if you want to move to a new browser or new device you can
        export the current state of your feeds:
      </p>
      <button onClick={onExportClick}>Export feeds</button>
      <hr />
      <p>Import from file</p>
      <input type="file" name="my_files[]" onChange={onFileLoad} />
    </details>
  );
}
