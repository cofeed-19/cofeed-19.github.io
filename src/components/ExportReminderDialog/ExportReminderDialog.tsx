import { forwardRef } from "react";
import { exportData } from "../../services/exportService";
import { dismissExportReminder } from "../../services/exportReminderService";

export const ExportReminderDialog = forwardRef<HTMLDialogElement>(
  function ExportReminderDialog(_, ref) {
    function handleExportNow() {
      exportData();
      (ref as React.RefObject<HTMLDialogElement>).current?.close();
    }

    function handleDismiss() {
      dismissExportReminder();
      (ref as React.RefObject<HTMLDialogElement>).current?.close();
    }

    return (
      <dialog ref={ref}>
        <p>It's been over a month since your last export.</p>
        <p>Export your feeds to avoid losing data if browser storage is cleared.</p>
        <button onClick={handleExportNow}>Export now</button>
        <button onClick={handleDismiss}>Remind me next month</button>
      </dialog>
    );
  }
);
