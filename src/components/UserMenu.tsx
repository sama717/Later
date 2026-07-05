import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { User } from "lucide-react";

interface UserMenuProps {
  session: Session;
}

function UserMenu({ session }: UserMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const email = session.user.email ?? "";
  const initial = email.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate("/");
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Account menu"
        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-lg z-20 rounded-[8px]">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
          >
            <User size={16} />
            <span>View Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-accent transition-colors cursor-pointer text-accent-grad-start"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
