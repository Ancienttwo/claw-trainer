import { useSkills } from "../../hooks/use-skills"
import { Skeleton } from "../ui/skeleton"
import { TerminalText } from "../ui/terminal-text"
import { PixelButton } from "../ui/pixel-button"
import { SkillCard } from "./skill-card"
import { useI18n } from "../../i18n"

const SKELETON_COUNT = 6

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Skeleton key={i} className="h-48 rounded-pixel" />
      ))}
    </div>
  )
}

function EmptyState() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">{t.skills.noSkills}</TerminalText>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <TerminalText color="amber">Failed to load skills.</TerminalText>
      <PixelButton variant="terminal" size="sm" onClick={onRetry}>
        {t.common.retry}
      </PixelButton>
    </div>
  )
}

export function SkillGrid() {
  const { data: skills, isLoading, isError, refetch } = useSkills()

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!skills || skills.length === 0) return <EmptyState />

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <SkillCard key={skill.slug} skill={skill} />
      ))}
    </div>
  )
}
