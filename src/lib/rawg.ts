const RAWG_BASE_URL = "https://api.rawg.io/api";
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export interface RawgGenre {
  id: number;
  name: string;
}

export interface RawgEsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface RawgGame {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  rating: number;
  genres: RawgGenre[];
  esrb_rating: RawgEsrbRating | null;
  released: string | null;
  tba: boolean;
}

export class RawgApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "RawgApiError";
    this.status = status;
  }
}

export interface FetchGamesQueryParams {
  ordering?: string;
  dates?: string;
  pageSize?: number;
}

interface RawgListResponse {
  results: RawgGame[];
}

export async function fetchGames(
  params: FetchGamesQueryParams
): Promise<RawgGame[]> {
  if (!API_KEY) {
    throw new RawgApiError("Missing VITE_RAWG_API_KEY in environment");
  }

  const searchParams = new URLSearchParams({ key: API_KEY });
  if (params.ordering) searchParams.set("ordering", params.ordering);
  if (params.dates) searchParams.set("dates", params.dates);
  searchParams.set("page_size", String(params.pageSize ?? 3));

  const response = await fetch(`${RAWG_BASE_URL}/games?${searchParams}`);

  if (!response.ok) {
    throw new RawgApiError(
      `Failed to fetch games: ${response.statusText}`,
      response.status
    );
  }

  const data: RawgListResponse = await response.json();
  return data.results;
}

export interface FetchGamesByGenreParams {
  genreSlug: string;
  ordering?: string;
  pageSize?: number;
}

export async function fetchTopGameForGenre(
  genreSlug: string
): Promise<RawgGame | null> {
  if (!API_KEY) {
    throw new RawgApiError("Missing VITE_RAWG_API_KEY in environment");
  }

  const searchParams = new URLSearchParams({
    key: API_KEY,
    genres: genreSlug,
    ordering: "-added",
    page_size: "1",
  });

  const response = await fetch(`${RAWG_BASE_URL}/games?${searchParams}`);

  if (!response.ok) {
    throw new RawgApiError(
      `Failed to fetch top game for genre "${genreSlug}": ${response.statusText}`,
      response.status
    );
  }

  const data: RawgListResponse = await response.json();
  return data.results[0] ?? null;
}