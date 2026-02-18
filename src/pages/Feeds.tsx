import { useCallback, useRef, useState } from "react";
import { ExternalLink } from "../components";
import JSONFeeds from "../data/feeds.json";
import { insertSiteFeed } from "../services/indexeddbService";
import Style from "../styles/feeds.module.css";
import { getFavicon } from "../utils";

interface JSONFeed {
  siteUrl: string;
  feedUrl: string;
  description: string;
}

export default function FeedsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [addedFeed, setAddedFeed] = useState<string>("");
  const list = JSONFeeds as JSONFeed[];

  const onAddButtonClick = useCallback(
    async (url: string) => {
      const feedFavicon = await getFavicon(url);
      await insertSiteFeed({
        url,
        visited: {},
        priority: 0,
        favicon: feedFavicon,
        title: "",
        items: [],
      });
      setAddedFeed(url);

      if (dialogRef.current) {
        const dialog = dialogRef.current;

        dialog.showModal();
        setTimeout(() => dialog.close(), 2000);
      }
    },
    [dialogRef]
  );

  return (
    <div>
      <h2>Feeds suggested by users</h2>
      <ExternalLink
        link="https://github.com/cofeed-19/cofeed-19.github.io/edit/master/src/data/feeds.json"
        title="Suggest a feed"
      />
      <dialog className={Style.dialog} ref={dialogRef}>
        {addedFeed} was added to your feeds
      </dialog>
      <ul className={Style.feedsList}>
        {list.map(({ feedUrl, siteUrl, description }) => (
          <li key={feedUrl}>
            <button onClick={() => onAddButtonClick(feedUrl)}>➕</button>
            <div>
              <ExternalLink link={siteUrl} />
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
