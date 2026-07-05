import { useNavigate } from "react-router";
import { ArrowUpRight, Star } from "lucide-react";
import type { RawgGame } from "../lib/rawg";
import { getAgeBadgeClass, getAgeBadgeLabel } from "../lib/esrb";
import { useSession } from "../hooks/useSession";
import { useLibraryStore } from "../store/libraryStore";

interface GameCardProps {
  game: RawgGame;
  variant?: "grid" | "list";
  hideFooter?: boolean; 
}

function GameCard({ game, variant = "grid", hideFooter = false }: GameCardProps) {
  const navigate = useNavigate();
  const { session } = useSession();
  const entries = useLibraryStore((s) => s.entries);
  const entry = session
    ? entries.find((e) => e.user_id === session.user.id && e.game.id === game.id)
    : undefined;
  const addToLibrary = useLibraryStore((s) => s.addToLibrary);

  const genreText =
    game.genres
      .slice(0, 2)
      .map((g) => g.name)
      .join(", ") || "Uncategorized";
  const extraGenres =
    game.genres.length > 2 ? ` +${game.genres.length - 2} More` : "";

  function goToDetails() {
    navigate(`/games/${game.id}`);
  }

  function handleAddToLibrary(e: React.MouseEvent) {
    e.stopPropagation();
    if (!session) {
      navigate("/login");
      return;
    }
    addToLibrary(session.user.id, game);
  }

  const libraryButtonLabel = !session
    ? "Login to Add"
    : entry
      ? entry.status === "played"
        ? "Played"
        : "In Library"
      : "Add to Library";

  const isDisabled = Boolean(session && entry);

  if (variant === "list") {
    return (
      <div
        onClick={goToDetails}
        className="flex gap-4 items-center py-4 border-b border-border cursor-pointer"
      >
        <div className="w-40 sm:w-48 aspect-video overflow-hidden bg-secondary shrink-0">
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-lg truncate min-w-0">
              {game.name}
            </h3>
            <span
              className={`shrink-0 px-2.5 py-1 rounded-[6px] text-sm font-semibold text-white ${getAgeBadgeClass(
                game.esrb_rating,
              )}`}
            >
              {getAgeBadgeLabel(game.esrb_rating)}
            </span>
          </div>

          <p className="text-muted-foreground text-sm mt-1 truncate">
            {genreText}
            {extraGenres}
          </p>

          <div className="flex items-center gap-1.5 mt-1">
            <Star size={14} className="fill-chart-3 text-chart-3" />
            <span className="text-sm font-medium">
              {game.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {!hideFooter && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleAddToLibrary}
              disabled={isDisabled}
              className="h-10 px-5 bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {libraryButtonLabel}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToDetails();
              }}
              className="w-10 h-10 flex items-center justify-center border-2 border-border hover:bg-accent transition-colors cursor-pointer"
              aria-label={`View ${game.name} details`}
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div onClick={goToDetails} className="cursor-pointer">
      <div className="w-full aspect-video overflow-hidden bg-secondary">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
          loading="lazy"
          />
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <h3 className="font-medium text-xl truncate min-w-0">{game.name}</h3>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-[6px] text-sm font-medium text-white ${getAgeBadgeClass(
            game.esrb_rating,
          )}`}
        >
          {getAgeBadgeLabel(game.esrb_rating)}
        </span>
      </div>

      <p className="text-muted-foreground mt-1 truncate">
        {genreText}
        {extraGenres}
      </p>

      <div className="flex items-center gap-1.5 mt-1">
        <Star size={16} className="fill-chart-3 text-chart-3" />
        <span className="font-medium">{game.rating.toFixed(1)}</span>
      </div>

      {!hideFooter && (
        <div className="flex gap-3 mt-10">
          <button
            onClick={handleAddToLibrary}
            disabled={isDisabled}
            className="flex-1 h-11 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {libraryButtonLabel}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
            className="w-12 h-11 flex items-center justify-center border-2 border-border hover:bg-accent transition-colors cursor-pointer"
            aria-label={`View ${game.name} details`}
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function GameCardSkeleton({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <div className="flex gap-4 items-center py-4 border-b border-border animate-pulse">
        <div className="w-40 sm:w-48 aspect-video bg-secondary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-5 w-1/3 bg-secondary" />
          <div className="h-4 w-1/4 mt-2 bg-secondary" />
          <div className="h-4 w-16 mt-2 bg-secondary" />
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="h-10 w-32 bg-secondary" />
          <div className="h-10 w-10 bg-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="w-full aspect-video bg-secondary" />
      <div className="flex items-center justify-between mt-4">
        <div className="h-5 w-2/3 bg-secondary" />
        <div className="h-6 w-10 bg-secondary" />
      </div>
      <div className="h-4 w-1/3 mt-2 bg-secondary" />
      <div className="h-4 w-16 mt-2 bg-secondary" />
      <div className="flex gap-3 mt-4">
        <div className="flex-1 h-12 bg-secondary" />
        <div className="w-12 h-12 bg-secondary" />
      </div>
    </div>
  );
}

export { GameCard, GameCardSkeleton };