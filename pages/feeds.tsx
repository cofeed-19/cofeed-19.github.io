import { useCallback, useRef, useState } from "react";
import { ExternalLink, Footer, Header, HeadMeta } from "../components";
import JSONFeeds from "../data/feeds.json";
import { insertSiteFeed } from "../services/indexeddbService";
import Style from "../styles/feeds.module.css";

interface JSONFeed {
  siteUrl: string;
  feedUrl: string;
  description: string;
}

interface Props {
  list: JSONFeed[];
}

interface DialogElement extends HTMLElement {
  showModal: () => void;
  close: () => void;
  open: boolean;
}

export default function Feeds({ list }: Props) {
  const dialogRef = useRef<DialogElement>(null);
  const [addedFeed, setAddedFeed] = useState<string>("");

  const onAddButtonClick = useCallback(
    async (url: string) => {
      await insertSiteFeed({ url, visited: {} });
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
        <dialog ref={dialogRef}>{addedFeed} was added to your feeds</dialog>
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
