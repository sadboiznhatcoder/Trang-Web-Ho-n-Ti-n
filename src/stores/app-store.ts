// =============================================================================
// Zustand Client State Store
// Manages UI state: sidebar toggle, balance visibility, user session, etc.
// =============================================================================

import { create } from "zustand";
import { type User } from "@/types";
import { MOCK_USER } from "@/lib/mock-data";

interface AppState {
    // Sidebar
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Balance visibility (eye icon toggle)
    balanceVisible: boolean;
    toggleBalanceVisibility: () => void;

    // User session (client-side mirror)
    user: User | null;
    setUser: (user: User | null) => void;

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
    user: MOCK_USER,
    setUser: (user) => set({ user }),

    // Theme - defaults to dark for "Glassmorphism Fintech" vibe
    isDarkMode: true,
    toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}));
