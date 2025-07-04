import Phaser from "phaser";
import {Gameplay} from "./scenes/Gameplay";
import {GameOver} from "./scenes/GameOver";

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: [
        Gameplay,
        GameOver
    ]
};

const game = new Phaser.Game(config);

game.scene.start('gameplay', {
    canvasWidth: config.width,
    canvasHeight: config.height
})