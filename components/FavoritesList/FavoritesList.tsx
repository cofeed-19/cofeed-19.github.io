import { useCallback, useEffect, useState } from "react";
import { Favorite } from "../../models";
import { getFavorites, removeFavorite } from "../../services/favoritesService";
import { DateComponent } from "../Date/Date";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import Styles from "./FavoritesList.module.css";

export function FavoritesList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const loadFavorites = useCallback(async () => {
    const favs = await getFavorites();
    const sortedFavs = [...favs].sort(
      (a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)
    );
    setFavorites(sortedFavs);
  }, []);

  const handleRemoveClick = useCallback(
    async (favorite: Favorite) => {
      if (
        favorite.link &&
        confirm(`Remove "${favorite.title}" from favorites?`)
      ) {
        await removeFavorite(favorite.link);
        await loadFavorites();
      }
    },
    [loadFavorites]
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <div className={Styles.container}>
      <h2>Favorites</h2>
      <ul className={Styles.list}>
        {favorites.map((favorite) => (
          <li key={favorite.url} className={Styles.item}>
            <DateComponent date={favorite.pubDate} />
            <div>
              <ExternalLink
                title={favorite.title || favorite.link || ""}
                link={favorite.link || ""}
              />
              <button
                onClick={() => handleRemoveClick(favorite)}
                className={Styles.removeButton}
                title="Remove from favorites"
              >
                ❌
              </button>
              <div className={Styles.source}>
                from{" "}
                <ExternalLink
                  title={favorite.sourceFeedTitle}
                  link={favorite.sourceFeedUrl || ""}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
