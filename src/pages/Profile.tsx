import { useSession } from "../hooks/useSession";
import { useLibraryStore } from "../store/libraryStore";
import { useMemo } from "react";
import { Link } from "react-router";
import { Gamepad2, CheckCircle2, Calendar, Mail } from "lucide-react";

function Profile() {
  const { session, isLoading } = useSession();
  const entries = useLibraryStore((s) => s.entries);

  const stats = useMemo(() => {
    if (!session) return { backlog: 0, played: 0, total: 0 };
    
    const userEntries = entries.filter((e) => e.userId === session.user.id);
    const backlog = userEntries.filter((e) => e.status === "backlog").length;
    const played = userEntries.filter((e) => e.status === "played").length;
    
    return {
      backlog,
      played,
      total: userEntries.length,
    };
  }, [entries, session]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center text-muted-foreground font-medium uppercase tracking-widest">
        Loading Profile...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-40 text-center">
        <h1 className="text-3xl font-medium tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Please log in to view your profile dashboard.
        </p>
        <Link
          to="/login"
          className="inline-block mt-8 h-12 px-8 leading-12 bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 rounded-md transition-opacity w-44 text-center align-middle"
        >
          Login
        </Link>
      </div>
    );
  }

  const displayName = session.user.user_metadata?.full_name || "Gamer";
  const userInitial = displayName.charAt(0).toUpperCase();
  const joinedDate = session.user.created_at 
    ? new Date(session.user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recent";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 bg-background text-foreground">
      <h1 className="text-4xl font-medium tracking-tight mb-10">Account Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center shadow-sm">
          <div className="w-24 h-24 bg-primary text-primary-foreground font-bold text-3xl flex items-center justify-center rounded-full mb-4 shadow-sm select-none">
            {userInitial}
          </div>
          <h2 className="text-xl font-semibold tracking-tight truncate max-w-full">{displayName}</h2>
          <p className="text-xs text-muted-foreground mt-1 capitalize px-2.5 py-0.5 bg-accent rounded-full font-medium">
            {session.user.role || "User"}
          </p>

          <div className="w-full border-t border-border/60 my-6"></div>

          <div className="w-full flex flex-col gap-4 text-left text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail size={16} className="shrink-0 text-foreground/70" />
              <span className="truncate text-foreground" title={session.user.email}>
                {session.user.email}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar size={16} className="shrink-0 text-foreground/70" />
              <span>Joined <strong className="text-foreground font-medium">{joinedDate}</strong></span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <h3 className="text-lg font-medium tracking-tight text-muted-foreground uppercase text-xs tracking-wider">
            Backlog Analytics
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Tracked</span>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold tracking-tight">{stats.total}</span>
                <span className="text-xs text-muted-foreground font-medium">games</span>
              </div>
            </div>

            <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">In Backlog</span>
                <Gamepad2 size={16} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold tracking-tight">{stats.backlog}</span>
                <span className="text-xs text-muted-foreground font-medium">planning</span>
              </div>
            </div>

            <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
                <CheckCircle2 size={16} className="text-green-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold tracking-tight">{stats.played}</span>
                <span className="text-xs text-muted-foreground font-medium">finished</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-border/60 rounded-xl mt-2">
            <h4 className="font-medium text-sm mb-2">Quick Navigation</h4>
            <p className="text-muted-foreground text-xs mb-4">
              Jump straight back to managing your lists or exploring new titles to add to your collection.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/library"
                className="h-9 px-4 inline-flex items-center bg-card hover:bg-accent border border-border text-xs font-medium rounded-md transition-colors"
              >
                Go to Library
              </Link>
              <Link
                to="/explore"
                className="h-9 px-4 inline-flex items-center bg-card hover:bg-accent border border-border text-xs font-medium rounded-md transition-colors"
              >
                Explore Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;