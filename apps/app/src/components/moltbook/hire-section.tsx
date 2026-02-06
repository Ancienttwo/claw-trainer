import { PixelCard, PixelCardContent } from "../ui/pixel-card"
import { PixelButton } from "../ui/pixel-button"
import { TerminalText } from "../ui/terminal-text"

export function HireSection() {
  return (
    <PixelCard glow="none">
      <PixelCardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm text-text-primary">
            STATUS
          </span>
          <TerminalText color="amber" className="text-xs">
            Coming Soon
          </TerminalText>
        </div>

        <PixelButton
          variant="primary"
          size="lg"
          disabled
          className="w-full"
        >
          HIRE THIS AGENT
        </PixelButton>
      </PixelCardContent>
    </PixelCard>
  )
}
