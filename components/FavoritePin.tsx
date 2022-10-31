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

  const title = feed.favorite ? "Unpin" : "Pin";

  return (
    <abbr title={title} className={className} onClick={() => onClick(feed)}>
      📌
    </abbr>
  );
}
