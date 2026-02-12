import { useOrderbook } from "../../hooks/use-orderbook"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { cn } from "../../lib/cn"

const MAX_LEVELS = 8

interface OrderbookProps {
  tokenId: string
}

export function Orderbook({ tokenId }: OrderbookProps) {
  const { bids, asks, isLoading } = useOrderbook(tokenId)

  const topAsks = asks.slice(0, MAX_LEVELS).reverse()
  const topBids = bids.slice(0, MAX_LEVELS)

  const maxSize = Math.max(
    ...topAsks.map((l) => Number(l.size)),
    ...topBids.map((l) => Number(l.size)),
    1,
  )

  const bestBid = topBids[0] ? Number(topBids[0].price) : 0
  const bestAsk = topAsks[topAsks.length - 1] ? Number(topAsks[topAsks.length - 1].price) : 0
  const spread = bestAsk > 0 && bestBid > 0 ? ((bestAsk - bestBid) * 100).toFixed(2) : "—"

  return (
    <PixelCard>
      <PixelCardHeader>ORDERBOOK</PixelCardHeader>
      <PixelCardContent className="space-y-0 p-2">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="font-mono text-xs text-text-muted animate-pulse">Loading...</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-1 flex justify-between px-1 font-pixel text-[7px] text-text-muted">
              <span>PRICE</span>
              <span>SIZE</span>
            </div>

            {/* Asks (sell side) — coral */}
            <div className="space-y-px">
              {topAsks.map((level) => (
                <OrderRow
                  key={`a-${level.price}`}
                  price={level.price}
                  size={level.size}
                  pct={Number(level.size) / maxSize}
                  side="ask"
                />
              ))}
            </div>

            {/* Spread */}
            <div className="flex items-center justify-center gap-2 py-1.5">
              <span className="font-mono text-xs text-text-primary">
                {bestBid > 0 ? Number(bestBid).toFixed(4) : "—"}
              </span>
              <span className="font-pixel text-[7px] text-text-muted">
                SPREAD {spread}%
              </span>
              <span className="font-mono text-xs text-text-primary">
                {bestAsk > 0 ? Number(bestAsk).toFixed(4) : "—"}
              </span>
            </div>

            {/* Bids (buy side) — terminal-green */}
            <div className="space-y-px">
              {topBids.map((level) => (
                <OrderRow
                  key={`b-${level.price}`}
                  price={level.price}
                  size={level.size}
                  pct={Number(level.size) / maxSize}
                  side="bid"
                />
              ))}
            </div>
          </>
        )}
      </PixelCardContent>
    </PixelCard>
  )
}

function OrderRow({
  price,
  size,
  pct,
  side,
}: {
  price: string
  size: string
  pct: number
  side: "bid" | "ask"
}) {
  const isBid = side === "bid"
  const barColor = isBid ? "bg-terminal-green/15" : "bg-coral/15"
  const textColor = isBid ? "text-terminal-green" : "text-coral"

  return (
    <div className="relative flex justify-between px-1 py-0.5 font-mono text-[11px]">
      <div
        className={cn("absolute inset-y-0 right-0 rounded-sm", barColor)}
        style={{ width: `${Math.max(pct * 100, 2)}%` }}
      />
      <span className={cn("relative z-10", textColor)}>{Number(price).toFixed(4)}</span>
      <span className="relative z-10 text-text-secondary">{Number(size).toFixed(2)}</span>
    </div>
  )
}
