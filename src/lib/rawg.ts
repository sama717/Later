const RAWG_BASE_URL = "https://api.rawg.io/api";
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export interface RawgGenre {
  id: number;
  name: string;
  slug: string;
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

export interface FetchGamesListParams {
  search?: string;
  genres?: string;
  searchPrecise?: boolean;
  parentPlatforms?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

export interface RawgPaginatedResponse {
  count: number;
  results: RawgGame[];
}

export async function fetchGamesList(
  params: FetchGamesListParams
): Promise<RawgPaginatedResponse> {
  if (!API_KEY) {
    throw new RawgApiError("Missing VITE_RAWG_API_KEY in environment");
  }

  const searchParams = new URLSearchParams({ key: API_KEY });
  if (params.search) searchParams.set("search", params.search);
  if (params.search && params.searchPrecise) {
    searchParams.set("search_precise", "true");
  }
  if (params.genres) searchParams.set("genres", params.genres);
  if (params.parentPlatforms)
    searchParams.set("parent_platforms", params.parentPlatforms);
  searchParams.set("ordering", params.ordering ?? "-added");
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.pageSize ?? 12));

  const response = await fetch(`${RAWG_BASE_URL}/games?${searchParams}`);

  if (!response.ok) {
    throw new RawgApiError(
      `Failed to fetch games: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export interface RawgGameDetails extends RawgGame {
  description_raw: string;
  website: string;
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
}

export interface RawgScreenshot {
  id: number;
  image: string;
  width: number;
  height: number;
}

export interface RawgTrailer {
  id: number;
  name: string;
  preview: string;
  data: { 480: string; max: string };
}

export async function fetchGameDetails(id: string): Promise<RawgGameDetails> {
  if (!API_KEY) throw new RawgApiError("Missing VITE_RAWG_API_KEY");
  const response = await fetch(`${RAWG_BASE_URL}/games/${id}?key=${API_KEY}`);
  if (!response.ok) throw new RawgApiError(`Failed to fetch game details`);
  return response.json();
}

export async function fetchGameScreenshots(id: string): Promise<RawgScreenshot[]> {
  if (!API_KEY) throw new RawgApiError("Missing VITE_RAWG_API_KEY");
  const response = await fetch(`${RAWG_BASE_URL}/games/${id}/screenshots?key=${API_KEY}`);
  if (!response.ok) throw new RawgApiError(`Failed to fetch screenshots`);
  const data = await response.json();
  return data.results || [];
}

export async function fetchGameTrailers(id: string): Promise<RawgTrailer[]> {
  if (!API_KEY) throw new RawgApiError("Missing VITE_RAWG_API_KEY");
  const response = await fetch(`${RAWG_BASE_URL}/games/${id}/movies?key=${API_KEY}`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.results || [];
}

export async function fetchSuggestedGames(
  id: string,
  genreSlug?: string
): Promise<RawgGame[]> {
  if (!API_KEY) throw new RawgApiError("Missing VITE_RAWG_API_KEY");

  const response = await fetch(`${RAWG_BASE_URL}/games/${id}/suggested?key=${API_KEY}`);
  if (response.ok) {
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results;
    }
  }

  if (genreSlug) {
    const fallbackResponse = await fetch(
      `${RAWG_BASE_URL}/games?key=${API_KEY}&genres=${genreSlug}&ordering=-added&page_size=8`
    );
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      return fallbackData.results || [];
    }
  }

  return [];
}