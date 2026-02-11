import { useRef, useEffect } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from './config'
import { BootScene } from './scenes/BootScene'
import { VillageScene } from './scenes/VillageScene'

export function VillageGame() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const config: Phaser.Types.Core.GameConfig = {
      ...createGameConfig(el),
      scene: [BootScene, VillageScene],
    }

    const game = new Phaser.Game(config)

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    />
  )
}
