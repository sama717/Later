import { Link } from "react-router";
import { LayoutGrid, List, Trash2 } from "lucide-react";
import { useSession } from "../hooks/useSession";
import { useLibraryStore } from "../store/libraryStore";
import { getAgeBadgeClass, getAgeBadgeLabel } from "../lib/esrb";
import { useEffect, useMemo, useState } from "react";
import { GameCard } from "../components/GameCard";

function Library() {
  const { session, isLoading } = useSession();
  const [activeTab, setActiveTab] = useState<"backlog" | "played">("backlog");
  const fetchLibrary = useLibraryStore((s) => s.fetchLibrary);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const entries = useLibraryStore((s) => s.entries);

  useEffect(() => {
    if (session?.user?.id) {
      fetchLibrary(session.user.id);
    }
  }, [session?.user?.id, fetchLibrary]);

  const backlogEntries = useMemo(
  () =>
    session
      ? entries.filter(
          (e) => e.user_id === session.user.id && e.status === "backlog", 
        )
      : [],
  [entries, session],
);

  const playedEntries = useMemo(
    () =>
      session
        ? entries.filter(
            (e) => e.user_id === session.user.id && e.status === "played",
          )
        : [],
    [entries, session],
  );

  const markAsPlayed = useLibraryStore((s) => s.markAsPlayed);
  const markAsBacklog = useLibraryStore((s) => s.markAsBacklog);
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center text-muted-foreground font-medium uppercase tracking-widest">
        Loading Assets...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-40 text-center">
        <h1 className="text-3xl font-medium">Your Library is waiting</h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Log in to save games to your backlog and track what you've played.
        </p>
        <Link
          to="/login"
          className="inline-block mt-12 h-12 px-8 leading-12 bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 rounded-md transition-opacity w-44 text-center align-middle"
        >
          Login
        </Link>
      </div>
    );
  }

  const activeEntries = activeTab === "backlog" ? backlogEntries : playedEntries;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-background text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-4xl font-medium tracking-tight">
          Library
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border px-3 h-11 bg-card text-sm rounded-[8px]">
            <select className="bg-transparent outline-none cursor-pointer text-muted-foreground font-medium">
              <option>Sort: Recently Added</option>
            </select>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`w-11 h-11 flex items-center justify-center border border-border cursor-pointer rounded-[8px] ${
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
      </div>

      <div className="flex p-1 mb-12 mt-6 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200/50 dark:border-zinc-800/30">
        <button
          onClick={() => setActiveTab("backlog")}
          className={`flex-1 h-10 font-medium text-sm transition-all rounded-full cursor-pointer ${
            activeTab === "backlog"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Backlog ({backlogEntries.length})
        </button>
        <button
          onClick={() => setActiveTab("played")}
          className={`flex-1 h-10 font-medium text-sm transition-all rounded-full cursor-pointer ${
            activeTab === "played"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Played ({playedEntries.length})
        </button>
      </div>

      {activeEntries.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 font-medium text-sm">
          {activeTab === "backlog"
            ? "Nothing in your backlog yet. Go add some games from Explore!"
            : "You haven't marked anything as played yet."}
        </p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
              : "flex flex-col gap-6"
          }
        >
          {activeEntries.map(({ game, status }) => (
            <div key={game.id} className={viewMode === "grid" ? "flex flex-col h-full group" : ""}>
              {viewMode === "grid" ? (
                <>
                  <GameCard game={game} hideFooter={true} />
                  
                  <div className="flex gap-2 mt-10 pt-1">
                    {status === "backlog" ? (
                      <button
                        onClick={() => markAsPlayed(session.user.id, game.id)}
                        className="flex-1 h-11 bg-primary text-primary-foreground text-sm font-bold transition-opacity hover:opacity-90 rounded-md cursor-pointer"
                      >
                        Mark as Played
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsBacklog(session.user.id, game.id)}
                        className="flex-1 h-11 bg-primary text-primary-foreground text-sm font-bold transition-opacity hover:opacity-90 rounded-md cursor-pointer"
                      >
                        Move to Backlog
                      </button>
                    )}
                    <button
                      onClick={() => removeFromLibrary(session.user.id, game.id)}
                      aria-label={`Remove ${game.name} from library`}
                      className="w-11 h-11 flex items-center justify-center bg-[#ef4444] hover:bg-red-600 text-white transition-colors cursor-pointer rounded-md shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-4 items-center py-4 border-b border-border">
                  <Link
                    to={`/games/${game.id}`}
                    className="w-40 aspect-video overflow-hidden bg-muted border border-border shrink-0 block rounded-md"
                  >
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-lg text-foreground truncate min-w-0 tracking-tight">
                        {game.name}
                      </h3>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider ${getAgeBadgeClass(
                          game.esrb_rating,
                        )}`}
                      >
                        {getAgeBadgeLabel(game.esrb_rating)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">
                      {game.genres
                        .slice(0, 2)
                        .map((g) => g.name)
                        .join(" • ") || "Uncategorized"}
                    </p>

                    <div className="flex gap-2 mt-4 max-w-60">
                      {status === "backlog" ? (
                        <button
                          onClick={() => markAsPlayed(session.user.id, game.id)}
                          className="flex-1 h-9 bg-primary text-primary-foreground text-xs font-medium transition-opacity hover:opacity-90 rounded-md cursor-pointer"
                        >
                          Mark as Played
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsBacklog(session.user.id, game.id)}
                          className="flex-1 h-9 bg-primary text-primary-foreground text-xs font-medium transition-opacity hover:opacity-90 rounded-md cursor-pointer"
                        >
                          Move to Backlog
                        </button>
                      )}
                      <button
                        onClick={() => removeFromLibrary(session.user.id, game.id)}
                        aria-label={`Remove ${game.name} from library`}
                        className="w-9 h-9 flex items-center justify-center bg-[#ef4444] hover:bg-red-600 text-white transition-colors cursor-pointer rounded-md shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;