import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    this.load.image('village-bg', '/village/village-bg.png')
  }

  create(): void {
    this.scene.start('VillageScene')
  }
}
