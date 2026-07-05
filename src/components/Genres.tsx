import { ArrowRight } from "lucide-react";
import { useGenreCards } from "../hooks/useGenreCards";

function GenreCardSkeleton() {
  return <div className="w-full aspect-square bg-secondary animate-pulse" />;
}

function Genres() {
  const { genres, isLoading, error } = useGenreCards();

  return (
    <section className="max-w-6xl mx-auto px-4 py-40">
      <div className="flex items-end justify-between pb-4 border-b border-border mb-15">
        <h2 className="text-4xl sm:text-5xl font-medium">
          Genres
        </h2>
        <a
          href="/explore"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          See All <ArrowRight size={20} />
        </a>
      </div>

      {error && (
        <p className="text-sm text-destructive mt-6">
          Couldn't load genres right now. {error}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mt-8">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <GenreCardSkeleton key={i} />)}

        {!isLoading &&
          genres.map((genre) => (
            <a
              key={genre.slug}
              href={`/explore?genre=${genre.slug}`}
              className="group relative w-full aspect-square overflow-hidden bg-secondary"
            >
              {genre.coverImage && (
                <img
                  src={genre.coverImage}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />

              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl sm:text-3xl 
              font-medium font-heading">
                {genre.name}
              </span>
            </a>
          ))}
      </div>
    </section>
  );
}

export default Genres;