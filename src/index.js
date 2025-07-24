import Phaser from "phaser";
import {Gameplay} from "./scenes/Gameplay";
import {GameOver} from "./scenes/GameOver";
import {StartMenu} from "./scenes/StartMenu";


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
        StartMenu,
        Gameplay,
        GameOver

    ]
};

const game = new Phaser.Game(config);

game.scene.start('startmenu', {
    canvasWidth: config.width,
    canvasHeight: config.height
})