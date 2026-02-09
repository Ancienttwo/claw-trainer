import type { Skill } from "../../hooks/use-skills"
import { useSkillPurchase, useMyPurchases } from "../../hooks/use-skills"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { Badge } from "../ui/badge"
import { useI18n } from "../../i18n"
import { useAccount } from "wagmi"

const API_BASE = import.meta.env.VITE_API_URL ?? ""

export function SkillDetail({ skill }: { skill: Skill }) {
  const { t } = useI18n()
  const { isConnected } = useAccount()
  const purchase = useSkillPurchase()
  const { data: purchased } = useMyPurchases()
  const alreadyOwned = purchased?.some((s) => s.id === skill.id) ?? false

  return (
    <PixelCard glow="amber">
      <PixelCardHeader>
        <div className="flex items-center justify-between">
          <span>{skill.name}</span>
          <Badge variant={skill.price === 0 ? "terminal" : "amber"}>
            {skill.price === 0 ? t.skills.free : `${skill.price} ${t.skills.pts}`}
          </Badge>
        </div>
      </PixelCardHeader>
      <PixelCardContent className="space-y-4">
        <p className="font-body text-sm text-text-secondary">
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>

        <div className="space-y-1 font-mono text-[10px] text-text-muted">
          <p>v{skill.version} · {skill.downloadCount} {t.skills.downloads}</p>
          <p>{t.skills.by} {skill.authorAddress.slice(0, 6)}...{skill.authorAddress.slice(-4)}</p>
        </div>

        {isConnected && (
          <div className="flex gap-2">
            {alreadyOwned ? (
              <a
                href={`${API_BASE}/skills/${skill.id}/download`}
                className="flex-1"
              >
                <PixelButton variant="terminal" size="md" className="w-full">
                  {t.skills.download}
                </PixelButton>
              </a>
            ) : (
              <PixelButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => purchase.mutate({ skillId: skill.id })}
                disabled={purchase.isPending}
              >
                {purchase.isPending ? t.skills.purchasing : skill.price === 0 ? t.skills.download : t.skills.purchase}
              </PixelButton>
            )}
          </div>
        )}

        {purchase.isSuccess && (
          <Badge variant="terminal" className="w-full justify-center">{t.skills.purchaseSuccess}</Badge>
        )}
      </PixelCardContent>
    </PixelCard>
  )
}
