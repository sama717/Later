import { Link, NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Languages, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "../hooks/useSession";
import UserMenu from "./UserMenu";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Explore", path: "/explore" },
  { label: "Library", path: "/library" },
];

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, isLoading } = useSession();

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  }

  return (
    <>
      <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-background border-b border-border relative">
        <div className="flex items-center gap-10">
          <Link to="/">
            <img src="/Logo.svg" alt="LATER Logo" className="h-8 w-auto dark:invert" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-sans text-sm transition-colors ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button aria-label="Toggle language" className="text-muted-foreground hover:text-foreground transition-colors">
            <Languages size={20} />
          </button>

          <button aria-label="Toggle dark mode" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isLoading && (
            session ? (
              <UserMenu session={session} />
            ) : (
              <Button render={<Link to="/login" />} className="w-30">
                Login
              </Button>
            )
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-6 bg-background border-b border-border">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `font-sans text-base transition-colors ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <button aria-label="Toggle language" className="text-muted-foreground hover:text-foreground transition-colors">
              <Languages size={20} />
            </button>

            <button aria-label="Toggle dark mode" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!isLoading && (
              session ? (
                <UserMenu session={session} />
              ) : (
                <Button render={<Link to="/login" />} onClick={() => setIsMenuOpen(false)} className="w-30">
                  Login
                </Button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;