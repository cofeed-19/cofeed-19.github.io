import Styles from "../styles/Date.module.css";

export function DateComponent({ date }: { date?: string }) {
  return (
    <span className={Styles.container}>
      <i>
        {date
          ? new Date(date).toLocaleDateString(undefined, {
              timeZone: "UTC",
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "No Date"}
      </i>
    </span>
  );
}
