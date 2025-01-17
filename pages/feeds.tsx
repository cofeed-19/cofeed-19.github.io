import { useCallback, useRef, useState } from "react";
import { ExternalLink, Footer, Header, HeadMeta } from "../components";
import JSONFeeds from "../data/feeds.json";
import { insertSiteFeed } from "../services/indexeddbService";
import Style from "../styles/feeds.module.css";
import { getFavicon } from "../utils";

interface JSONFeed {
  siteUrl: string;
  feedUrl: string;
  description: string;
}

interface Props {
  list: JSONFeed[];
}

export default function Feeds({ list }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [addedFeed, setAddedFeed] = useState<string>("");

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
    <>
      <HeadMeta />
      <Header />
      <main>
        <h2>Feeds suggested by users</h2>
        <ExternalLink
          link="https://github.com/cofeed-19/cofeed-19.github.io/edit/master/data/feeds.json"
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
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      list: JSONFeeds,
    },
  };
}
