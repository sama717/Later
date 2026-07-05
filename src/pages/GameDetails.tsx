import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  BookmarkCheck
} from "lucide-react";
import {
  FaPlaystation,
  FaXbox,
  FaLaptop,
  FaApple,
  FaLinux,
  FaAndroid,
} from "react-icons/fa6";
import { BsNintendoSwitch } from "react-icons/bs";
import {
  fetchGameDetails,
  fetchGameScreenshots,
  fetchSuggestedGames,
  fetchGameTrailers,
} from "../lib/rawg";
import type {
  RawgGameDetails,
  RawgScreenshot,
  RawgGame,
  RawgTrailer,
} from "../lib/rawg";
import { GameCard } from "../components/GameCard";
import { useSession } from "../hooks/useSession";
import { useLibraryStore } from "../store/libraryStore";

const getPlatformIcon = (slug: string) => {
  switch (slug) {
    case "pc":
      return <FaLaptop className="text-lg text-foreground" />;
    case "playstation":
      return <FaPlaystation className="text-lg text-[#00439C]" />;
    case "xbox":
      return <FaXbox className="text-lg text-[#107C10]" />;
    case "nintendo":
      return <BsNintendoSwitch className="text-lg text-[#E60012]" />;
    case "mac":
      return <FaApple className="text-lg text-foreground" />;
    case "linux":
      return <FaLinux className="text-lg text-foreground" />;
    case "android":
      return <FaAndroid className="text-lg text-foreground" />;
    default:
      return null;
  }
};

function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();

  const entries = useLibraryStore((s) => s.entries);
  const addToLibrary = useLibraryStore((s) => s.addToLibrary);
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary);

  const [game, setGame] = useState<RawgGameDetails | null>(null);
  const [screenshots, setScreenshots] = useState<RawgScreenshot[]>([]);
  const [trailers, setTrailers] = useState<RawgTrailer[]>([]);
  const [suggested, setSuggested] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const currentLibraryEntry = entries.find(
    (e) => e.user_id === session?.user?.id && e.game_id.toString() === id,
  );

  useEffect(() => {
    if (!id) return;

    const getPageData = async () => {
      try {
        setLoading(true);
        setActiveVideoUrl(null);

        const detailsData = await fetchGameDetails(id);
        setGame(detailsData);

        const primaryGenreSlug = detailsData.genres[0]?.slug;

        const [screenshotData, suggestedData, trailerData] = await Promise.all([
          fetchGameScreenshots(id),
          fetchSuggestedGames(id, primaryGenreSlug),
          fetchGameTrailers(id),
        ]);

        setScreenshots(screenshotData);
        setTrailers(trailerData);

        const filteredSuggested = suggestedData
          .filter((item) => item.id.toString() !== id.toString())
          .slice(0, 4);

        setSuggested(filteredSuggested);
      } catch (err) {
        console.error("Error building layout assets:", err);
      } finally {
        setLoading(false);
      }
    };

    getPageData();
  }, [id]);

  if (loading || !game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center text-muted-foreground font-medium">
        Loading…
      </div>
    );
  }

  const genreLabels = game.genres.map((g) => g.name).join(" • ") || "Action";
  const developerLabels =
    game.developers.map((d) => d.name).join(", ") || "Unknown Developer";
  const publisherLabels =
    game.publishers.map((p) => p.name).join(", ") || "Unknown Publisher";
  const tagLabels = game.tags.map((t) => t.name).join(", ");

  const handleLibraryToggle = () => {
    if (!session) {
      alert("Please log in to save games to your library!");
      return;
    }

    if (currentLibraryEntry) {
      removeFromLibrary(session.user.id, game.id);
    } else {
      addToLibrary(session.user.id, game);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-40 bg-background text-foreground min-h-screen">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-2">
          {game.name}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-8">
          <div className="flex items-center gap-3 text-medium text-muted-foreground">
            <span>{genreLabels}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-foreground">
              <Star size={14} className="fill-chart-3 text-chart-3" />{" "}
              {game.rating || "4.8"}
            </span>
            <span>•</span>
            <span>{game.esrb_rating?.name || "17+"}</span>
          </div>

          <button
            onClick={handleLibraryToggle}
            className={`flex items-center justify-center gap-2 py-4 px-8 w-96 font-medium font-heading transition-all cursor-pointer rounded-md border ${
              currentLibraryEntry
                ? "bg-secondary text-foreground border-border hover:bg-destructive hover:text-white hover:border-destructive group"
                : "bg-primary text-primary-foreground border-transparent hover:opacity-90"
            }`}
          >
            {currentLibraryEntry ? (
              <>
                <BookmarkCheck size={18} className="group-hover:hidden" />
                <span className="group-hover:hidden">
                  In Library ({currentLibraryEntry.status})
                </span>
                <span className="hidden group-hover:inline">
                  Remove From Library
                </span>
              </>
            ) : (
              <>
                <span>Add to Library</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video w-full bg-black overflow-hidden rounded-lg">
              {activeVideoUrl ? (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {trailers.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => setActiveVideoUrl(null)}
                  className={`relative w-30 h-30 bg-secondary border overflow-hidden cursor-pointer transition-colors rounded-md ${
                    !activeVideoUrl
                      ? "border-foreground"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={game.background_image}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-70"
                  />
                </button>

                {trailers.slice(0, 3).map((video) => {
                  const targetUrl = video.data.max || video.data[480];
                  const isActive = activeVideoUrl === targetUrl;
                  return (
                    <button
                      key={video.id}
                      onClick={() => setActiveVideoUrl(targetUrl)}
                      className={`relative w-30 h-30 bg-secondary border overflow-hidden cursor-pointer transition-colors rounded-md ${
                        isActive
                          ? "border-foreground"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img
                        src={video.preview || game.background_image}
                        alt={video.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play size={20} className="text-white fill-white" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {trailers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No trailers available for this title yet.
              </p>
            )}

            <div className="pt-8 border-t border-border space-y-3">
              <h2 className="text-lg font-bold text-foreground">About</h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {game.description_raw || "No description available."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Platforms</h3>
                  <div className="flex flex-wrap gap-3">
                    {game.parent_platforms?.map(({ platform }) => (
                      <div key={platform.id} title={platform.name}>
                        {getPlatformIcon(platform.slug)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-1">Release</h3>
                  <p className="text-sm text-muted-foreground">
                    {game.released
                      ? new Date(game.released).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-1">Developer</h3>
                  <p className="text-sm text-muted-foreground">
                    {developerLabels}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-1">Publisher</h3>
                  <p className="text-sm text-muted-foreground">
                    {publisherLabels}
                  </p>
                </div>
              </div>
            </div>

            {tagLabels && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-bold mb-1">Tags</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tagLabels}
                </p>
              </div>
            )}

            {game.website && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-bold mb-1">Website</h3>
                <a
                  href={game.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-foreground underline hover:opacity-80 transition-opacity break-all"
                >
                  {game.website}
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between h-114.5">
            <h2 className="text-muted-foreground mb-4 text-4xl">Gallery</h2>
            <div className="grid grid-cols-2 gap-3">
              {screenshots.slice(0, 4).map((shot, idx) => (
                <div
                  key={shot.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative aspect-square bg-secondary overflow-hidden cursor-pointer group rounded-md"
                >
                  <img
                    src={shot.image}
                    alt="Screenshot"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {idx === 3 && screenshots.length > 4 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold text-sm rounded-md">
                      +{screenshots.length - 4}
                    </div>
                  )}
                </div>
              ))}
              {screenshots.length === 0 && (
                <p className="col-span-2 text-xs text-muted-foreground">
                  No screenshots available.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-border">
          <h2 className="text-2xl font-bold text-center mb-12">
            You Might Also Like
          </h2>

          {suggested.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {suggested.map((item) => (
                <GameCard key={item.id} game={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No recommendations available right now.
            </p>
          )}
        </div>

        {lightboxIndex !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none">
            <div
              className="absolute inset-0"
              onClick={() => setLightboxIndex(null)}
            />

            <button
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : screenshots.length - 1,
                )
              }
              className="absolute left-6 text-white hover:text-muted-foreground z-10 p-3 bg-black/50 cursor-pointer rounded-sm"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative max-w-5xl max-h-[80vh] overflow-hidden bg-black rounded-md">
              <img
                src={screenshots[lightboxIndex]?.image}
                alt="Expanded screenshot"
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>

            <button
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev !== null && prev < screenshots.length - 1 ? prev + 1 : 0,
                )
              }
              className="absolute right-6 text-white hover:text-muted-foreground z-10 p-3 bg-black/50 cursor-pointer rounded-sm"
            >
              <ChevronRight size={24} />
            </button>

            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white text-sm border border-white/20 py-2 px-4 hover:bg-white/10 transition-colors cursor-pointer rounded-md"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default GameDetails;
