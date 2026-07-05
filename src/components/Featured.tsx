import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { useFeaturedGames } from "../hooks/useFeaturedGames";
import { getAgeBadgeClass, getAgeBadgeLabel } from "../lib/esrb";

function FeaturedCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-video rounded-[10px] bg-secondary" />
      <div className="flex items-center justify-between mt-4">
        <div className="h-5 w-2/3 rounded-[8px] bg-secondary" />
        <div className="h-6 w-10 rounded-[8px] bg-secondary" />
      </div>
      <div className="h-4 w-1/3 mt-2 rounded-[8px] bg-secondary" />
      <div className="h-4 w-16 mt-2 rounded-[8px] bg-secondary" />
      <div className="flex gap-3 mt-4">
        <div className="flex-1 h-12 rounded-[8px] bg-secondary" />
        <div className="w-12 h-12 rounded-[8px] bg-secondary" />
      </div>
    </div>
  );
}

function Featured() {
  const { games, isLoading, error } = useFeaturedGames();

  return (
    <section className="max-w-6xl mx-auto px-4 py-30">
      <div className="flex items-end justify-between pb-4 border-b border-border mb-15">
        <h2 className="text-4xl sm:text-5xl font-medium">Featured</h2>
        <a
          href="/explore"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          See All <ArrowRight size={20} />
        </a>
      </div>

      {error && (
        <p className="text-sm text-destructive mt-6">
          Couldn't load featured games right now. {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <FeaturedCardSkeleton key={i} />)}

        {!isLoading &&
          games.map((game) => (
            <div key={game.id}>
              <div className="w-full aspect-video overflow-hidden bg-secondary">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-between gap-3 mt-4">
                <h3 className="font-semibold text-xl truncate">{game.name}</h3>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-[8px] text-sm font-semibold text-white ${getAgeBadgeClass(game.esrb_rating)}`}
                >
                  {getAgeBadgeLabel(game.esrb_rating)}
                </span>
              </div>

              <p className="text-muted-foreground mt-1">
                {game.genres.slice(0, 2).map((g) => g.name).join(", ") || "Uncategorized"}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <Star size={16} className="fill-chart-3 text-chart-3" />
                <span className="font-medium">{game.rating.toFixed(1)}</span>
              </div>

              <div className="flex gap-3 mt-15">
                <button className="flex-1 h-12 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  Add to Library
                </button>
                <button
                  className="w-12 h-12 flex items-center justify-center border-2 border-border hover:bg-accent transition-colors cursor-pointer"
                  aria-label={`View ${game.name} details`}
                  onClick={() => { /* TODO: navigate to detail page */ }}
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default Featured;