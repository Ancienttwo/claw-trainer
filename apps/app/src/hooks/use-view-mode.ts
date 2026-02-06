import { useEffect } from "react"
import { useViewModeStore, type ViewMode } from "../stores/view-mode-store"

export function useViewMode() {
  const { viewMode, setViewMode } = useViewModeStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlView = params.get("view")
    if (urlView === "agent" || urlView === "trainer") {
      setViewMode(urlView)
    }
  }, [setViewMode])

  return { viewMode, setViewMode }
}

export type { ViewMode }
