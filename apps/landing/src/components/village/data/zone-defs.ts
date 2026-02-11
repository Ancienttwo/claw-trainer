export interface ZoneDef {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  buildingKey: string
  buildingScale: number
  npcAnchor: { x: number; y: number }
}

export const ZONES: ZoneDef[] = [
  {
    id: 'tavern',
    label: 'Tech Tavern',
    x: 270,
    y: 270,
    w: 300,
    h: 300,
    buildingKey: 'building-tavern',
    buildingScale: 0.42,
    npcAnchor: { x: 330, y: 390 },
  },
  {
    id: 'plaza',
    label: 'Village Center',
    x: 810,
    y: 300,
    w: 360,
    h: 330,
    buildingKey: 'building-tech',
    buildingScale: 0.3,
    npcAnchor: { x: 870, y: 450 },
  },
  {
    id: 'lab',
    label: 'Lobster Lab',
    x: 270,
    y: 750,
    w: 330,
    h: 300,
    buildingKey: 'building-lab',
    buildingScale: 0.42,
    npcAnchor: { x: 345, y: 870 },
  },
  {
    id: 'districts',
    label: 'Tech Shop',
    x: 1482,
    y: 318,
    w: 300,
    h: 300,
    buildingKey: 'building-shop',
    buildingScale: 0.52,
    npcAnchor: { x: 1542, y: 438 },
  },
  {
    id: 'training',
    label: 'Training Grounds',
    x: 1530,
    y: 750,
    w: 360,
    h: 330,
    buildingKey: 'building-arena',
    buildingScale: 0.42,
    npcAnchor: { x: 1590, y: 870 },
  },
]
