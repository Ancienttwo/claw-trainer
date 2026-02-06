import { create } from "zustand"

export type ViewMode = "trainer" | "agent"

interface ViewModeStore {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

function getInitialMode(): ViewMode {
  if (typeof window === "undefined") return "trainer"
  const stored = localStorage.getItem("claw_view_mode")
  if (stored === "agent" || stored === "trainer") return stored
  return "trainer"
}

export const useViewModeStore = create<ViewModeStore>((set) => ({
  viewMode: getInitialMode(),
  setViewMode: (mode) => {
    localStorage.setItem("claw_view_mode", mode)
    set({ viewMode: mode })
  },
}))
