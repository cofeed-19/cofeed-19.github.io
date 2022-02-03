type Props = {
  loadedFeeds: { loaded: number; total: number };
}

export function ProgressLoader({ loadedFeeds }: Props) {
  return loadedFeeds.loaded !== loadedFeeds.total ? (
    <h3>
      Loading:
      <progress
        id="loading"
        value={loadedFeeds.loaded}
        max={loadedFeeds.total}
      ></progress>
    </h3>
  ) : null;
}
