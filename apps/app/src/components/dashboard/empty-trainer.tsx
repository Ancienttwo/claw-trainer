import { Link } from "@tanstack/react-router"
import { AsciiLobster } from "../ui/ascii-lobster"
import { PixelButton } from "../ui/pixel-button"
import { PixelCard, PixelCardContent } from "../ui/pixel-card"
import { useI18n } from "../../i18n"

export function EmptyTrainer() {
  const { t } = useI18n()

  return (
    <PixelCard glow="coral" className="w-full">
      <PixelCardContent>
        <div className="flex flex-col items-center text-center gap-4">
          <AsciiLobster stage="rookie" size="lg" />
          <h3 className="font-pixel text-sm text-text-primary">{t.dashboard.noAgents}</h3>
          <p className="font-mono text-[12px] text-text-muted">
            {t.dashboard.claimFirst}
          </p>
          <Link to="/mint">
            <PixelButton variant="primary">{t.dashboard.claimFirstButton}</PixelButton>
          </Link>
        </div>
      </PixelCardContent>
    </PixelCard>
  )
}
