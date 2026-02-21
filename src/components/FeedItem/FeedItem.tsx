import RSSParser from "rss-parser";
import { Feed } from "../../models";
import { DateComponent } from "../Date/Date";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import Styles from "./FeedItem.module.css";

type Props = {
  item: RSSParser.Item;
  feed: Feed;
  onClick?: () => void;
  onFavoriteClick?: () => void;
  isFavorited?: boolean;
  testId?: string;
};

export function FeedItem({
  item,
  onClick,
  onFavoriteClick,
  isFavorited,
  testId,
}: Props) {
  return (
    <li className={Styles.item} data-testid={testId}>
      {onFavoriteClick && (
        <button
          onClick={onFavoriteClick}
          className={`${Styles.favoriteButton} ${isFavorited ? Styles.favorited : ""}`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          data-testid="favorite-button"
        >
          {isFavorited ? "★" : "☆"}
        </button>
      )}
      <DateComponent date={item.pubDate} />
      <ExternalLink
        title={item.title || item.link || ""}
        link={item.link || ""}
        onClick={onClick}
      />
    </li>
  );
}
