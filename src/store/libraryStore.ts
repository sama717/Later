import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { RawgGame, RawgGameDetails } from "../lib/rawg";

export interface LibraryEntry {
  user_id: string; 
  status: "backlog" | "played";
  game_id: number; 
  game: RawgGame & Partial<RawgGameDetails>;
}

interface LibraryState {
  entries: LibraryEntry[];
  isLoading: boolean;
  fetchLibrary: (userId: string) => Promise<void>;
  addToLibrary: (userId: string, game: RawgGame & Partial<RawgGameDetails>) => Promise<void>;
  removeFromLibrary: (userId: string, gameId: number) => Promise<void>;
  markAsPlayed: (userId: string, gameId: number) => Promise<void>;
  markAsBacklog: (userId: string, gameId: number) => Promise<void>;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  entries: [],
  isLoading: false,

  fetchLibrary: async (userId: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("library")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Fetch Error:", error);
    } else {
      const mappedEntries = (data || []).map((item) => ({
        user_id: item.user_id,
        status: item.status,
        game_id: item.game_id,
        game: item.game_data,
      }));
      set({ entries: mappedEntries });
    }
    set({ isLoading: false });
  },

addToLibrary: async (userId, game) => {
  const { error } = await supabase
    .from("library")
    .upsert(
      {
        user_id: userId,
        game_id: game.id,
        status: "backlog",
        game_data: game,
      },
      { onConflict: 'user_id, game_id' }
    );

  if (!error) {
    set((state) => ({
      entries: [...state.entries.filter((e) => e.game_id !== game.id), 
                { user_id: userId, status: "backlog", game_id: game.id, game }],
    }));
  } else {
    console.error("Error adding to library:", error.message);
  }
},

  removeFromLibrary: async (userId, gameId) => {
    const { error } = await supabase
      .from("library")
      .delete()
      .eq("user_id", userId)
      .eq("game_id", gameId);

    if (!error) {
      set((state) => ({
        entries: state.entries.filter((e) => !(e.user_id === userId && e.game_id === gameId)),
      }));
    }
  },

  markAsPlayed: async (userId, gameId) => {
    const { error } = await supabase
      .from("library")
      .update({ status: "played" })
      .eq("user_id", userId)
      .eq("game_id", gameId);

    if (!error) {
      set((state) => ({
        entries: state.entries.map((e) =>
          e.user_id === userId && e.game_id === gameId ? { ...e, status: "played" } : e
        ),
      }));
    }
  },

  markAsBacklog: async (userId, gameId) => {
    const { error } = await supabase
      .from("library")
      .update({ status: "backlog" })
      .eq("user_id", userId)
      .eq("game_id", gameId);

    if (!error) {
      set((state) => ({
        entries: state.entries.map((e) =>
          e.user_id === userId && e.game_id === gameId ? { ...e, status: "backlog" } : e
        ),
      }));
    }
  },

  clearLibrary: () => set({ entries: [] }),
}));