import Styles from "./ProgressLoader.module.css";

type Props = {
  loadedFeeds: { loaded: number; total: number };
};

export function ProgressLoader({ loadedFeeds }: Props) {
  return loadedFeeds.loaded !== loadedFeeds.total ? (
    <div className={Styles.container}>
      Loading:
      <progress
        id="loading"
        value={loadedFeeds.loaded}
        max={loadedFeeds.total}
      ></progress>
    </div>
  ) : null;
}
