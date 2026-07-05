import { useEffect, useState } from "react";
import { fetchGames, RawgApiError } from "../lib/rawg";
import type { RawgGame } from "../lib/rawg";

interface UseFeaturedGamesResult {
  games: RawgGame[];
  isLoading: boolean;
  error: string | null;
}

function getRecentDateRange(monthsBack: number): string {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - monthsBack);
  const format = (d: Date) => d.toISOString().split("T")[0];
  return `${format(start)},${format(end)}`;
}

function isActuallyReleased(game: RawgGame): boolean {
  if (game.tba) return false;
  if (!game.released) return false;
  return new Date(game.released) <= new Date();
}

export function useFeaturedGames(): UseFeaturedGamesResult {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const results = await fetchGames({
          ordering: "-added",
          dates: getRecentDateRange(6),
          pageSize: 15,
        });
        const releasedOnly = results.filter(isActuallyReleased).slice(0, 3);
        if (!cancelled) {
          setGames(releasedOnly);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof RawgApiError
              ? err.message
              : "Something went wrong loading featured games"
          );
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { games, isLoading, error };
}