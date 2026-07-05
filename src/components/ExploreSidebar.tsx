import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { 
  FaLaptop, 
  FaPlaystation, 
  FaXbox, 
  FaApple, 
  FaLinux, 
  FaAndroid, 
  FaMobileScreen 
} from "react-icons/fa6";
import { BsNintendoSwitch } from "react-icons/bs";
import { 
  LuSwords, 
  LuShieldAlert, 
  LuTarget, 
  LuCompass, 
  LuLayers, 
  LuBrain, 
  LuGamepad,
  LuCar, 
  LuTrophy, 
  LuCpu 
} from "react-icons/lu";

interface FilterOption {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_PLATFORMS: FilterOption[] = [
  { label: "PC", value: "1", icon: FaLaptop },
  { label: "PlayStation", value: "2", icon: FaPlaystation },
  { label: "Xbox", value: "3", icon: FaXbox },
  { label: "Nintendo", value: "7", icon: BsNintendoSwitch },
  { label: "iOS", value: "4", icon: FaMobileScreen },
  { label: "Apple Macintosh", value: "5", icon: FaApple },
  { label: "Linux", value: "6", icon: FaLinux },
  { label: "Android", value: "8", icon: FaAndroid },
];

const ALL_GENRES: FilterOption[] = [
  { label: "Action", value: "action", icon: LuSwords },
  { label: "RPG", value: "role-playing-games-rpg", icon: LuShieldAlert },
  { label: "Shooter", value: "shooter", icon: LuTarget },
  { label: "Adventure", value: "adventure", icon: LuCompass },
  { label: "Strategy", value: "strategy", icon: LuLayers },
  { label: "Indie", value: "indie", icon: LuGamepad },
  { label: "Puzzle", value: "puzzle", icon: LuBrain },
  { label: "Racing", value: "racing", icon: LuCar },
  { label: "Sports", value: "sports", icon: LuTrophy },
  { label: "Simulation", value: "simulation", icon: LuCpu },
];

const COLLAPSED_COUNT = 4;

interface ExploreSidebarProps {
  selectedPlatform: string | null;
  selectedGenre: string | null;
  onPlatformChange: (value: string | null) => void;
  onGenreChange: (value: string | null) => void;
  onAllGamesClick: () => void;
}

function ExploreSidebar({
  selectedPlatform,
  selectedGenre,
  onPlatformChange,
  onGenreChange,
  onAllGamesClick,
}: ExploreSidebarProps) {
  const [platformsExpanded, setPlatformsExpanded] = useState(false);
  const [genresExpanded, setGenresExpanded] = useState(false);

  const isAllGamesActive = !selectedPlatform && !selectedGenre;

  const visiblePlatforms = platformsExpanded
    ? ALL_PLATFORMS
    : ALL_PLATFORMS.slice(0, COLLAPSED_COUNT);

  const visibleGenres = genresExpanded
    ? ALL_GENRES
    : ALL_GENRES.slice(0, COLLAPSED_COUNT);

  return (
    <aside className="w-full sm:w-48 shrink-0 select-none">
      <h2 className="text-3xl font-medium font-heading uppercase tracking-tight">Explore</h2>

      <nav className="mt-6 flex flex-col gap-1">
        <button
          onClick={onAllGamesClick}
          className={`text-left cursor-pointer text-lg tracking-wide uppercase font-heading ${
            isAllGamesActive
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground transition-colors"
          }`}
        >
          All Games
        </button>
      </nav>

      <div className="mt-8">
        <h3 className="font-heading font-medium mb-3 text-lg tracking-wide uppercase border-b border-border pb-1">
          Platforms
        </h3>
        <ul className="flex flex-col gap-2">
          {visiblePlatforms.map((platform) => {
            const Icon = platform.icon;
            const isActive = selectedPlatform === platform.value;
            return (
              <li key={platform.value}>
                <button
                  onClick={() => onPlatformChange(isActive ? null : platform.value)}
                  className={`flex items-center gap-2.5 text-left w-full text-sm py-1 cursor-pointer transition-colors group ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`text-base shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                  <span>{platform.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {ALL_PLATFORMS.length > COLLAPSED_COUNT && (
          <button
            onClick={() => setPlatformsExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground mt-3 cursor-pointer transition-colors"
          >
            <span>{platformsExpanded ? "Show Less" : "Show All"}</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${platformsExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-heading font-medium mb-3 text-lg tracking-wide uppercase border-b border-border pb-1">
          Genres
        </h3>
        <ul className="flex flex-col gap-2">
          {visibleGenres.map((genre) => {
            const Icon = genre.icon;
            const isActive = selectedGenre === genre.value;
            return (
              <li key={genre.value}>
                <button
                  onClick={() => onGenreChange(isActive ? null : genre.value)}
                  className={`flex items-center gap-2.5 text-left w-full text-sm py-1 cursor-pointer transition-colors group ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`text-base shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                  <span>{genre.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {ALL_GENRES.length > COLLAPSED_COUNT && (
          <button
            onClick={() => setGenresExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground mt-3 cursor-pointer transition-colors"
          >
            <span>{genresExpanded ? "Show Less" : "Show All"}</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${genresExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </aside>
  );
}

export { ALL_PLATFORMS, ALL_GENRES };
export default ExploreSidebar;