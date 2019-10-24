import "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainMenuScene } from "./scenes/MainMenuScene";

const _globalConfig = {
  fallBackBackground: '091622',
};

const config: Phaser.Types.Core.GameConfig = {
  title: "2048",
  version: "0.0.1",
  url: "someurl.com",
  width: 390,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, MainMenuScene],
  // plugins: {
  //   global: [
  //     { key: 'DebugDrawPlugin', plugin: DebugDrawPlugin, mapping: 'debugDraw' }
  //   ]
  // },
  input: {
    keyboard: true,
    mouse: true,
    touch: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 300 }
    }
  },
  backgroundColor: "#" + _globalConfig.fallBackBackground,
  render: { pixelArt: true, antialias: false }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
  game.instance = {};
  game.instance.config = _globalConfig;
});