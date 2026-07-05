import { useEffect, useState } from "react";
import { fetchTopGameForGenre, RawgApiError } from "../lib/rawg";

export interface GenreCard {
  name: string;
  slug: string;
  coverImage: string | null;
}

const GENRES: { name: string; slug: string }[] = [
  { name: "Action", slug: "action" },
  { name: "Indie", slug: "indie" },
  { name: "Adventure", slug: "adventure" },
  { name: "RPG", slug: "role-playing-games-rpg" },
  { name: "Strategy", slug: "strategy" },
  { name: "Shooter", slug: "shooter" },
];

interface UseGenreCardsResult {
  genres: GenreCard[];
  isLoading: boolean;
  error: string | null;
}

export function useGenreCards(): UseGenreCardsResult {
  const [genres, setGenres] = useState<GenreCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const results = await Promise.all(
          GENRES.map(async (genre) => {
            const game = await fetchTopGameForGenre(genre.slug);
            return {
              name: genre.name,
              slug: genre.slug,
              coverImage: game?.background_image ?? null,
            };
          })
        );

        if (!cancelled) {
          setGenres(results);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof RawgApiError
              ? err.message
              : "Something went wrong loading genres"
          );
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { genres, isLoading, error };
}