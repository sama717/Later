import { useEffect, useState } from "react";
import { fetchGamesList, RawgApiError } from "../lib/rawg";
import type { RawgGame } from "../lib/rawg";

export interface ExploreFilters {
  search: string;
  searchPrecise?: boolean;
  genre: string | null;
  parentPlatform: string | null;
  ordering: string;
  page: number;
}

interface UseExploreGamesResult {
  games: RawgGame[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

const PAGE_SIZE = 12;

export function useExploreGames(filters: ExploreFilters): UseExploreGamesResult {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!cancelled) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const data = await fetchGamesList({
          search: filters.search || undefined,
          searchPrecise: filters.searchPrecise,
          genres: filters.genre ?? undefined,
          parentPlatforms: filters.parentPlatform ?? undefined,
          ordering: filters.ordering,
          page: filters.page,
          pageSize: PAGE_SIZE,
        });

        if (!cancelled) {
          setGames(data.results);
          setTotalCount(data.count);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof RawgApiError
              ? err.message
              : "Something went wrong loading games"
          );
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [
    filters.search,
    filters.searchPrecise,
    filters.genre,
    filters.parentPlatform,
    filters.ordering,
    filters.page,
  ]);

  return { games, totalCount, isLoading, error };
}