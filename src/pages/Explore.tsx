import { useState } from "react";
import { Search, LayoutGrid, List, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useExploreGames } from "../hooks/useExploreGames";
import ExploreSidebar, { ALL_PLATFORMS, ALL_GENRES } from "../components/ExploreSidebar";
import { GameCard, GameCardSkeleton } from "../components/GameCard";

const SORT_OPTIONS = [
  { label: "Popularity", value: "-added" },
  { label: "Rating", value: "-rating" },
  { label: "Release Date", value: "-released" },
  { label: "Name", value: "name" },
];

const PAGE_SIZE = 12;

function Explore() {
  const [searchInput, setSearchInput] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [ordering, setOrdering] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { games, totalCount, isLoading, error } = useExploreGames({
    search: searchInput,
    genre,
    parentPlatform: platform,
    searchPrecise: true,
    ordering,
    page,
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === ordering)?.label ?? "Popularity";

  const pageTitle = genre
    ? ALL_GENRES.find((g) => g.value === genre)?.label ?? "All Games"
    : platform
    ? ALL_PLATFORMS.find((p) => p.value === platform)?.label ?? "All Games"
    : "All Games";

  return (
    <div className="max-w-6xl mx-auto px-4 pt-12 pb-40">
      <div className="flex flex-col sm:flex-row gap-12">
        <ExploreSidebar
          selectedPlatform={platform}
          selectedGenre={genre}
          onPlatformChange={(value) => {
            setPlatform(value);
            setGenre(null);
            setPage(1);
          }}
          onGenreChange={(value) => {
            setGenre(value);
            setPlatform(null);
            setPage(1);
          }}
          onAllGamesClick={() => {
            setPlatform(null);
            setGenre(null);
            setPage(1);
          }}
        />

        <div className="flex-1 min-w-0">
          <h1 className="text-4xl sm:text-5xl font-medium">
            {pageTitle}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 pl-10 pr-4 border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-[8px]"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="rounded-[8px] flex items-center gap-2 h-11 px-4 border border-border bg-card whitespace-nowrap cursor-pointer"
              >
                Sort: {currentSortLabel} <ChevronDown size={16} />
              </button>

              {sortOpen && (
                <ul className="absolute right-0 mt-1 w-44 bg-card border border-border shadow-lg z-10">
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          setOrdering(option.value);
                          setPage(1);
                          setSortOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`w-11 h-11 flex items-center border border-border justify-center cursor-pointer rounded-[8px] ${
                  viewMode === "grid" ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`w-11 h-11 flex items-center justify-center border border-border cursor-pointer rounded-[8px] ${
                  viewMode === "list" ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <p className="text-muted-foreground mt-4">
            {isLoading ? "Loading…" : `Showing ${totalCount.toLocaleString()} results`}
          </p>

          {error && (
            <p className="text-sm text-destructive mt-4">
              Couldn't load games right now. {error}
            </p>
          )}

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {isLoading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
              {!isLoading && games.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          ) : (
            <div className="mt-6">
              {isLoading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <GameCardSkeleton key={i} variant="list" />
                ))}
              {!isLoading &&
                games.map((game) => (
                  <GameCard key={game.id} game={game} variant="list" />
                ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-end gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft size={16} /> Prev
              </button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;