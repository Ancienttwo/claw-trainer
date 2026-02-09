import { Link } from "@tanstack/react-router"
import type { Skill } from "../../hooks/use-skills"
import { PixelCard, PixelCardContent, PixelCardHeader } from "../ui/pixel-card"
import { Badge } from "../ui/badge"
import { useI18n } from "../../i18n"

function formatSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(0)} KB`
  return `${bytes} B`
}

export function SkillCard({ skill }: { skill: Skill }) {
  const { t } = useI18n()

  return (
    <Link to="/skills/$slug" params={{ slug: skill.slug }}>
      <PixelCard glow="amber" className="cursor-pointer">
        <PixelCardHeader>
          <div className="flex items-center justify-between">
            <span className="truncate">{skill.name}</span>
            <Badge variant={skill.price === 0 ? "terminal" : "amber"}>
              {skill.price === 0 ? t.skills.free : `${skill.price} ${t.skills.pts}`}
            </Badge>
          </div>
        </PixelCardHeader>
        <PixelCardContent className="space-y-2">
          <p className="line-clamp-2 font-body text-xs text-text-secondary">
            {skill.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {skill.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
            <span>{skill.downloadCount} {t.skills.downloads}</span>
            <span>v{skill.version} · {formatSize(skill.fileSize)}</span>
          </div>
          <p className="font-mono text-[10px] text-text-muted">
            {t.skills.by} {skill.authorAddress.slice(0, 6)}...{skill.authorAddress.slice(-4)}
          </p>
        </PixelCardContent>
      </PixelCard>
    </Link>
  )
}
