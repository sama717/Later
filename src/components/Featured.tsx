import { ArrowRight } from "lucide-react";
import { useFeaturedGames } from "../hooks/useFeaturedGames";
import { GameCard, GameCardSkeleton } from "./GameCard";

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
          Array.from({ length: 3 }).map((_, i) => <GameCardSkeleton key={i} />)}

        {!isLoading && games.map((game) => <GameCard key={game.id} game={game} />)}
      </div>
    </section>
  );
}

export default Featured;