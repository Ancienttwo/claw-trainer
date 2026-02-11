export interface NpcDef {
  name: string
  spriteKey: string
  startX: number
  startY: number
  waypoints: Array<{ x: number; y: number }>
  dialogueLines: string[]
}

export const NPC_DEFS: NpcDef[] = [
  {
    name: 'Guide',
    spriteKey: 'Alex',
    startX: 870,
    startY: 450,
    waypoints: [
      { x: 780, y: 420 },
      { x: 900, y: 480 },
      { x: 840, y: 390 },
      { x: 960, y: 450 },
    ],
    dialogueLines: [
      'Welcome to Clawvili!',
      'Click buildings to explore.',
      'Train your Claw here!',
    ],
  },
  {
    name: 'Scientist',
    spriteKey: 'Adam',
    startX: 345,
    startY: 840,
    waypoints: [
      { x: 300, y: 810 },
      { x: 390, y: 870 },
      { x: 270, y: 840 },
    ],
    dialogueLines: [
      'The lab is operational!',
      'NFA research in progress...',
      'ERC-8004 identity verified.',
    ],
  },
  {
    name: 'Shopkeeper',
    spriteKey: 'Amelia',
    startX: 1542,
    startY: 408,
    waypoints: [
      { x: 1512, y: 378 },
      { x: 1572, y: 438 },
      { x: 1482, y: 408 },
    ],
    dialogueLines: [
      'Browse the Tech Shop!',
      'Finest agent tools here.',
      'New stock arriving soon.',
    ],
  },
  {
    name: 'Trainer',
    spriteKey: 'Bob',
    startX: 1590,
    startY: 840,
    waypoints: [
      { x: 1530, y: 810 },
      { x: 1650, y: 870 },
      { x: 1590, y: 780 },
    ],
    dialogueLines: [
      'Ready to train?',
      'Your Claw grows stronger!',
      'Show me what you got!',
    ],
  },
  {
    name: 'Worker',
    spriteKey: 'Alex',
    startX: 330,
    startY: 330,
    waypoints: [
      { x: 270, y: 300 },
      { x: 360, y: 360 },
      { x: 300, y: 270 },
    ],
    dialogueLines: [
      'Tech storage is secure.',
      'All systems operational.',
      'Need something stored?',
    ],
  },
]
