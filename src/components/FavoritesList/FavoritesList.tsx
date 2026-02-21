import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Favorite } from "../../models";
import { getFavorites, removeFavorite } from "../../services/favoritesService";
import { DateComponent } from "../Date/Date";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import Styles from "./FavoritesList.module.css";

export function FavoritesList() {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    select: (favs) =>
      [...favs].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)),
  });

  const removeMutation = useMutation({
    mutationFn: async (favorite: Favorite) => {
      if (
        favorite.link &&
        confirm(`Remove "${favorite.title}" from favorites?`)
      ) {
        await removeFavorite(favorite.link);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

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
                onClick={() => removeMutation.mutate(favorite)}
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
