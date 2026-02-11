export interface ZoneDef {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
}

export const ZONES: ZoneDef[] = [
  { id: 'tavern', label: 'Tech Tavern', x: 145, y: 175, w: 270, h: 310 },
  { id: 'plaza', label: 'Village Center', x: 510, y: 170, w: 300, h: 260 },
  { id: 'lab', label: 'Lobster Lab', x: 175, y: 530, w: 310, h: 280 },
  { id: 'districts', label: 'Tech Shop', x: 1020, y: 175, w: 460, h: 320 },
  { id: 'training', label: 'Training Grounds', x: 920, y: 530, w: 500, h: 280 },
]
