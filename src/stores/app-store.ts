// =============================================================================
// Zustand Client State Store
// Manages UI state: sidebar toggle, balance visibility, user session, etc.
// =============================================================================

import { create } from "zustand";
import { type Profile } from "@/types";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Balance visibility (eye icon toggle)
  balanceVisible: boolean;
  toggleBalanceVisibility: () => void;

  // User session (client-side mirror)
  user: Profile | null;
  setUser: (user: Profile | null) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Balance visibility
  balanceVisible: true,
  toggleBalanceVisibility: () =>
    set((s) => ({ balanceVisible: !s.balanceVisible })),

  // User session
  user: MOCK_CURRENT_USER,
  setUser: (user) => set({ user }),

  // Theme — default light mode
  isDarkMode: false,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}));
