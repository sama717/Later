import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RawgGame } from "../lib/rawg";

export type LibraryStatus = "backlog" | "played";

export interface LibraryEntry {
  userId: string;
  game: RawgGame;
  status: LibraryStatus;
  addedAt: string;
}

interface LibraryState {
  entries: LibraryEntry[];
  addToLibrary: (userId: string, game: RawgGame) => void;
  markAsPlayed: (userId: string, gameId: number) => void;
  markAsBacklog: (userId: string, gameId: number) => void;
  removeFromLibrary: (userId: string, gameId: number) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addToLibrary: (userId, game) => {
        const exists = get().entries.some(
          (e) => e.userId === userId && e.game.id === game.id
        );
        if (exists) return;

        set((state) => ({
          entries: [
            ...state.entries,
            { userId, game, status: "backlog", addedAt: new Date().toISOString() },
          ],
        }));
      },

      markAsPlayed: (userId, gameId) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.userId === userId && e.game.id === gameId
              ? { ...e, status: "played" }
              : e
          ),
        }));
      },

      markAsBacklog: (userId, gameId) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.userId === userId && e.game.id === gameId
              ? { ...e, status: "backlog" }
              : e
          ),
        }));
      },

      removeFromLibrary: (userId, gameId) => {
        set((state) => ({
          entries: state.entries.filter(
            (e) => !(e.userId === userId && e.game.id === gameId)
          ),
        }));
      },
    }),
    { name: "later-library-storage" }
  )
);