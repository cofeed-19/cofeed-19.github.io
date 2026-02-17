import { useCallback, useEffect, useState } from "react";
import Styles from "../styles/feeds.module.css";
import { Feed } from "../models";
import { getSiteFeeds } from "../services/indexeddbService";

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  useEffect(() => {
    getSiteFeeds().then(setFeeds).catch(console.error);
  }, []);

  return (
    <div className={Styles.container}>
      <h1>Feeds</h1>
      <ul className={Styles.list}>
        {feeds.map((feed) => (
          <li key={feed.url} className={Styles.item}>
            {feed.favicon && (
              <img src={feed.favicon} alt="" className={Styles.favicon} />
            )}
            <span>{feed.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
