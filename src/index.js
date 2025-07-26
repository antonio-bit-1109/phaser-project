import Phaser from "phaser";
import {Gameplay} from "./scenes/Gameplay";
import {GameOver} from "./scenes/GameOver";
import {StartMenu} from "./scenes/StartMenu";
import {SaveScore} from "./scenes/SaveScore";


const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [
        StartMenu,
        Gameplay,
        GameOver,
        SaveScore


    ],

};

const game = new Phaser.Game(config);

game.scene.start('startmenu', {
    canvasWidth: config.width,
    canvasHeight: config.height
})