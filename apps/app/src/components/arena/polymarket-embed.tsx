import { useState } from "react"
import { Skeleton } from "../ui/skeleton"

const EMBED_BASE = "https://polymarket.com/event"

export function PolymarketEmbed({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full overflow-hidden rounded-pixel border-2 border-border-subtle">
      {!loaded && <Skeleton className="h-[400px] w-full" />}
      <iframe
        src={`${EMBED_BASE}/${slug}?embed=true`}
        title={`Polymarket: ${slug}`}
        className={`h-[400px] w-full border-0 bg-surface-deep ${loaded ? "" : "hidden"}`}
        onLoad={() => setLoaded(true)}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}
