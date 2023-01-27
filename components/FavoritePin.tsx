import { useMemo } from "react";
import { Feed } from "../models";
import Styles from "../styles/FavoritePin.module.css";

interface FavoritePinProps {
  feed: Feed;
  onClick: (feed: Feed) => void;
}

export function FavoritePin({ feed, onClick }: FavoritePinProps) {
  const className = useMemo(() => {
    const baseClass = Styles.pin;

    if (feed.priority) {
      return `${baseClass} ${Styles.pinned}`;
    }

    return baseClass;
  }, [feed.priority]);

  const title = feed.priority ? "Unpin" : "Pin";

  return (
    <abbr title={title} className={className} onClick={() => onClick(feed)}>
      📌
    </abbr>
  );
}
