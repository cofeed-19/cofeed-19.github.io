import { useState } from "react";
import { FavoritesList, FeedSection, NewFeedForm } from "../components";
import { useFeeds } from "../hooks";
import Styles from "../styles/index.module.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"feeds" | "favorites">("feeds");
  const { storedFeeds, addFeed, removeFeed, pinFeed } = useFeeds();

  async function onSubmit(newFeed: string) {
    const feedUrls = newFeed.trim().split(",").filter(Boolean);
    try {
      await addFeed(feedUrls);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  function onRemoveClick(feedUrl: string, feedTitle?: string) {
    if (confirm(`Delete ${feedTitle} from feeds?`)) {
      removeFeed(feedUrl);
    }
  }

  const sortedFeeds = storedFeeds
    .slice()
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return (
    <div className={Styles.container}>
      <NewFeedForm onSubmit={onSubmit} />
      <div className={Styles.tabsList}>
        <button
          onClick={() => setActiveTab("feeds")}
          disabled={activeTab === "feeds"}
        >
          Feeds
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          disabled={activeTab === "favorites"}
        >
          Favorites
        </button>
      </div>
      {activeTab === "feeds" &&
        sortedFeeds.map((storedFeed) => (
          <FeedSection
            key={storedFeed.url}
            feedUrl={storedFeed.url}
            storedFeed={storedFeed}
            onRemove={onRemoveClick}
            onPin={pinFeed}
          />
        ))}
      {activeTab === "favorites" && <FavoritesList />}
    </div>
  );
}
