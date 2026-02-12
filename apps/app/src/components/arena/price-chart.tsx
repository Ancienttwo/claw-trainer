import { useEffect, useRef, useState } from "react"
import { createChart, type IChartApi, type ISeriesApi, type AreaSeriesOptions, ColorType } from "lightweight-charts"
import { usePriceHistory } from "../../hooks/use-price-history"
import { PixelCard, PixelCardHeader, PixelCardContent } from "../ui/pixel-card"
import { cn } from "../../lib/cn"
import { colors } from "../../styles/design-tokens"

const INTERVALS = [
  { label: "1H", interval: "1h", fidelity: 1 },
  { label: "6H", interval: "6h", fidelity: 5 },
  { label: "1D", interval: "1d", fidelity: 15 },
  { label: "1W", interval: "1w", fidelity: 60 },
  { label: "1M", interval: "1m", fidelity: 60 },
  { label: "MAX", interval: "max", fidelity: 60 },
] as const

interface PriceChartProps {
  tokenId: string
}

export function PriceChart({ tokenId }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null)
  const [activeIdx, setActiveIdx] = useState(2) // default 1D

  const { interval, fidelity } = INTERVALS[activeIdx]
  const { history, isLoading } = usePriceHistory(tokenId, interval, fidelity)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { type: ColorType.Solid, color: colors.surfaceDeep },
        textColor: colors.textSecondary,
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "rgba(90,100,128,0.15)" },
        horzLines: { color: "rgba(90,100,128,0.15)" },
      },
      crosshair: {
        vertLine: { color: colors.cyan, width: 1, style: 2 },
        horzLine: { color: colors.cyan, width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: "rgba(90,100,128,0.3)",
      },
      timeScale: {
        borderColor: "rgba(90,100,128,0.3)",
        timeVisible: true,
      },
    })

    const series = chart.addAreaSeries({
      lineColor: colors.cyan,
      topColor: `${colors.cyan}40`,
      bottomColor: `${colors.cyan}05`,
      lineWidth: 2,
      priceFormat: { type: "price", precision: 4, minMove: 0.0001 },
    } as AreaSeriesOptions)

    chartRef.current = chart
    seriesRef.current = series

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      chart.applyOptions({ width })
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!seriesRef.current || history.length === 0) return
    seriesRef.current.setData(history)
    chartRef.current?.timeScale().fitContent()
  }, [history])

  return (
    <PixelCard>
      <PixelCardHeader>
        <div className="flex items-center justify-between">
          <span>PRICE</span>
          <div className="flex gap-1">
            {INTERVALS.map((iv, idx) => (
              <button
                key={iv.label}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "rounded-sm px-2 py-0.5 font-pixel text-[7px] transition-colors",
                  idx === activeIdx
                    ? "bg-cyan/20 text-cyan border border-cyan/40"
                    : "text-text-muted hover:text-text-secondary border border-transparent",
                )}
              >
                {iv.label}
              </button>
            ))}
          </div>
        </div>
      </PixelCardHeader>
      <PixelCardContent className="p-0">
        {isLoading && history.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center">
            <span className="font-mono text-xs text-text-muted animate-pulse">Loading chart...</span>
          </div>
        ) : (
          <div ref={containerRef} className="h-[320px] w-full" />
        )}
      </PixelCardContent>
    </PixelCard>
  )
}
