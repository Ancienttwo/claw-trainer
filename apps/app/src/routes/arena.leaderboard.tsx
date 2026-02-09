import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { PixelButton } from "../components/ui/pixel-button"
import { LeaderboardTable } from "../components/arena/leaderboard-table"
import { useI18n } from "../i18n"

function LeaderboardPage() {
  const { t } = useI18n()

  return (
    <GridBackground>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-pixel text-xl text-coral">{t.arena.leaderboard}</h1>
          <Link to="/arena">
            <PixelButton variant="terminal" size="sm">
              &larr; {t.common.back}
            </PixelButton>
          </Link>
        </div>
        <LeaderboardTable />
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/arena/leaderboard")({
  component: LeaderboardPage,
})
