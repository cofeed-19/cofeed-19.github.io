import { useState, ChangeEvent, FormEvent } from "react";
import { exportFeed, importFeed } from "../services/exportService";

export function ExportImportForm() {
  const [importFeeds, setImportFeeds] = useState("");

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setImportFeeds(e.target.value);
  }

  function onFormSubmit(e: FormEvent) {
    e.preventDefault();
    importFeeds && importFeed(importFeeds);
  }

  async function onExportClick() {
    const exportedData = await exportFeed();
    if (exportedData) {
      await navigator.clipboard.writeText(exportedData);
      alert(
        "Encoded export data was copied to clipboard. Go to a new browser or device and paste it into import input."
      );
    }
  }

  return (
    <details>
      <summary>Export/Import</summary>
      <p>
        In case if you want to move to a new browser or new device you can
        export the current state of your feeds:
      </p>
      <button onClick={onExportClick}>Export feeds</button>
      <form onSubmit={onFormSubmit}>
        <input
          placeholder="https://cofeed-19.github.io/eyJkYiI6MSwiZmVlZMSEW8SA"
          type="text"
          value={importFeeds}
          onChange={onInputChange}
        />
        <button type="submit">Import feeds</button>
      </form>
    </details>
  );
}
