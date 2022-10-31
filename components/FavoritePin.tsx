import { useMemo } from "react";
import { Feed } from "../models";

interface FavoritePinProps {
  feed: Feed;
  onClick: (feed: Feed) => void;
}

export function FavoritePin({ feed, onClick }: FavoritePinProps) {
  const className = useMemo(() => {
    const baseClass = "favorite-pin";

    if (feed.favorite) {
      return `${baseClass} pinned`;
    }

    return baseClass;
  }, [feed.favorite]);

  return (
    <span className={className} onClick={() => onClick(feed)}>
      📌
    </span>
  );
}
