import { useSearchParams } from "react-router";
import { Toaster } from "sonner";
import { Search, LayoutGrid, List, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useExploreGames } from "../hooks/useExploreGames";
import ExploreSidebar, { ALL_PLATFORMS, ALL_GENRES } from "../components/ExploreSidebar";
import { GameCard, GameCardSkeleton } from "../components/GameCard";
import { useDebounce } from "../hooks/useDebounce";
import { useState } from "react";
import { useTitle } from "../hooks/useTitle"; 

const SORT_OPTIONS = [
  { label: "Popularity", value: "-added" },
  { label: "Rating", value: "-rating" },
  { label: "Release Date", value: "-released" },
  { label: "Name", value: "name" },
];

const PAGE_SIZE = 12;

function Explore() {
  useTitle("Explore");
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1");
  const ordering = searchParams.get("ordering") || SORT_OPTIONS[0].value;
  const genre = searchParams.get("genre");
  const platform = searchParams.get("platform");
  const searchInput = searchParams.get("search") || "";
  
  const [localSearch, setLocalSearch] = useState(searchInput);
  const debouncedSearch = useDebounce(localSearch, 500);

  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { games, totalCount, isLoading, error } = useExploreGames({
    search: debouncedSearch,
    genre,
    parentPlatform: platform,
    searchPrecise: true,
    ordering,
    page,
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === ordering)?.label ?? "Popularity";

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const pageTitle = genre
    ? ALL_GENRES.find((g) => g.value === genre)?.label ?? "All Games"
    : platform
    ? ALL_PLATFORMS.find((p) => p.value === platform)?.label ?? "All Games"
    : "All Games";

  return (
    <div className="max-w-6xl mx-auto px-4 pt-12 pb-40">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col sm:flex-row gap-12">
        <ExploreSidebar
          selectedPlatform={platform}
          selectedGenre={genre}
          onPlatformChange={(value) => updateParams({ platform: value, genre: null, page: "1" })}
          onGenreChange={(value) => updateParams({ genre: value, platform: null, page: "1" })}
          onAllGamesClick={() => updateParams({ platform: null, genre: null, page: "1" })}
        />

        <div className="flex-1 min-w-0">
          <h1 className="text-4xl sm:text-5xl font-medium">{pageTitle}</h1>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  updateParams({ search: e.target.value, page: "1" });
                }}
                className="w-full h-11 pl-10 pr-4 border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-[8px]"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
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
                          updateParams({ ordering: option.value, page: "1" });
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
              <button onClick={() => setViewMode("grid")} className={`w-11 h-11 flex items-center border border-border justify-center cursor-pointer rounded-[8px] ${viewMode === "grid" ? "bg-accent" : "hover:bg-accent/50"}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode("list")} className={`w-11 h-11 flex items-center justify-center border border-border cursor-pointer rounded-[8px] ${viewMode === "list" ? "bg-accent" : "hover:bg-accent/50"}`}><List size={18} /></button>
            </div>
          </div>

          <p className="text-muted-foreground mt-4">
            {isLoading ? "Loading…" : `Showing ${totalCount.toLocaleString()} results`}
          </p>

          {/* Combined Loading/Empty/Error View */}
          {error ? (
            <p className="text-sm text-destructive mt-4">Couldn't load games right now. {error}</p>
          ) : games.length === 0 && !isLoading ? (
            <p className="text-center py-20 text-muted-foreground">No games found matching your criteria.</p>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6" : "mt-6"}>
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => <GameCardSkeleton key={i} variant={viewMode} />)
                : games.map((game) => <GameCard key={game.id} game={game} variant={viewMode} />)
              }
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-end gap-4 mt-12">
              <button onClick={() => updateParams({ page: (page - 1).toString() })} disabled={page === 1} className="flex items-center gap-1 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <ArrowLeft size={16} /> Prev
              </button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button onClick={() => updateParams({ page: (page + 1).toString() })} disabled={page === totalPages} className="flex items-center gap-1 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
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