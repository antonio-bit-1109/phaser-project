import Phaser from "phaser";
import {Gameplay} from "./scenes/Gameplay";

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: [Gameplay]
};

const game = new Phaser.Game(config);

game.scene.start('gameplay', {
    canvasWidth: config.width,
    canvasHeight: config.height
})