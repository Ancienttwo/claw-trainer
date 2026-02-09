import { createFileRoute, Link } from "@tanstack/react-router"
import { GridBackground } from "../components/ui/grid-background"
import { TerminalLoader } from "../components/ui/terminal-loader"
import { TerminalText } from "../components/ui/terminal-text"
import { PixelButton } from "../components/ui/pixel-button"
import { SkillDetail } from "../components/skills/skill-detail"
import { useSkillDetail } from "../hooks/use-skills"
import { useI18n } from "../i18n"

function SkillDetailPage() {
  const { slug } = Route.useParams()
  const { t } = useI18n()
  const { data: skill, isLoading, isError, refetch } = useSkillDetail(slug)

  return (
    <GridBackground>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4">
          <Link to="/skills">
            <PixelButton variant="terminal" size="sm">
              &larr; {t.common.back}
            </PixelButton>
          </Link>
        </div>

        {isLoading && <TerminalLoader text={t.skills.fetching} />}
        {isError && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <TerminalText color="amber">Failed to load skill.</TerminalText>
            <PixelButton variant="terminal" size="sm" onClick={() => refetch()}>
              {t.common.retry}
            </PixelButton>
          </div>
        )}
        {skill && <SkillDetail skill={skill} />}
      </div>
    </GridBackground>
  )
}

export const Route = createFileRoute("/skills/$slug")({
  component: SkillDetailPage,
})
