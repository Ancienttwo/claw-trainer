import { Link } from "@tanstack/react-router"
import { AsciiLobster } from "../ui/ascii-lobster"
import { PixelButton } from "../ui/pixel-button"
import { PixelCard, PixelCardContent } from "../ui/pixel-card"

export function EmptyTrainer() {
  return (
    <PixelCard glow="coral" className="w-full">
      <PixelCardContent>
        <div className="flex flex-col items-center text-center gap-4">
          <AsciiLobster stage="rookie" size="lg" />
          <h3 className="font-pixel text-sm text-text-primary">No agents yet</h3>
          <p className="font-mono text-[12px] text-text-muted">
            Claim your first agent to start training
          </p>
          <Link to="/mint">
            <PixelButton variant="primary">Claim Your First Agent</PixelButton>
          </Link>
        </div>
      </PixelCardContent>
    </PixelCard>
  )
}
