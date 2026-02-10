/**
 * Individual agent card for the Claw-Dex grid (Pokemon card style).
 */

import { Link } from "@tanstack/react-router"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { PixelBadge } from "../ui/pixel-badge"
import { AsciiLobster } from "../ui/ascii-lobster"
import type { AgentListItem } from "../../hooks/use-agents"
import { truncateAddress } from "../../lib/address"
import { cn } from "../../lib/cn"

const stageGlow = {
  rookie: "coral",
  pro: "amber",
  cyber: "cyan",
} as const

type GlowKey = keyof typeof stageGlow

const MAX_VISIBLE_CAPABILITIES = 3

function resolveGlow(stage: string): "coral" | "amber" | "cyan" {
  const key = stage.toLowerCase() as GlowKey
  return stageGlow[key] ?? "coral"
}

interface AgentCardProps {
  agent: AgentListItem
}

export function AgentCard({ agent }: AgentCardProps) {
  const glow = resolveGlow(agent.stage)

  return (
    <Link
      to="/agent/$tokenId"
      params={{ tokenId: agent.tokenId.toString() }}
      className="block"
    >
      <PixelCard
        glow={glow}
        className={cn(
          "cursor-pointer transition-all duration-300",
          "hover:shadow-card-hover hover:-translate-y-px",
        )}
      >
        <PixelCardHeader className="flex items-center justify-between">
          <span className="truncate font-pixel text-[10px] text-text-primary">
            {agent.name}
          </span>
          <PixelBadge kind="level" value={agent.level} />
        </PixelCardHeader>

        <PixelCardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <AsciiLobster
              stage={agent.stage.toLowerCase() as "rookie" | "pro" | "cyber"}
              size="sm"
            />
            <PixelBadge
              kind="stage"
              value={agent.stage.toLowerCase() as "rookie" | "pro" | "cyber"}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, MAX_VISIBLE_CAPABILITIES).map((cap) => (
              <PixelBadge key={cap} kind="type" value="dev" className="text-[7px]">
                {cap}
              </PixelBadge>
            ))}
            {agent.capabilities.length > MAX_VISIBLE_CAPABILITIES && (
              <span className="font-pixel text-[7px] text-text-muted">
                +{agent.capabilities.length - MAX_VISIBLE_CAPABILITIES}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle pt-2">
            <span className="font-mono text-[10px] text-text-muted">
              {truncateAddress(agent.owner)}
            </span>
            <span className="font-pixel text-[8px] text-cyan">
              View &raquo;
            </span>
          </div>
        </PixelCardContent>
      </PixelCard>
    </Link>
  )
}
