import "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainMenuScene } from "./scenes/MainMenuScene";

const _globalConfig = {
  fallBackBackground: '091622',
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 4
  },
  tweenSpeed: 50,
  swipeMaxTime: 1000,
  swipeMinDistance: 20,
  swipeMinNormal: 0.85,
  aspectRatio: 16/9,
  localStorageName: "topscore2048"
};

let tileAndSpacing = _globalConfig.tileSize + _globalConfig.tileSpacing;
let width = _globalConfig.boardSize.cols * tileAndSpacing;
width += _globalConfig.tileSpacing;

const config: Phaser.Types.Core.GameConfig = {
  title: "2048 TypeScript",
  version: "0.1 dev",
  url: "2048.kraken-soft.cloud",
  width: 390,
  height: 600,
  type: Phaser.AUTO,
  scene: [BootScene, MainMenuScene],
  // plugins: {
  //   global: [
  //     { key: 'DebugDrawPlugin', plugin: DebugDrawPlugin, mapping: 'debugDraw' }
  //   ]
  // },
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: width * _globalConfig.aspectRatio
  },
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
  let game = new Game(config);
  game.instance = {};
  game.instance.config = _globalConfig;
  window.focus();
});