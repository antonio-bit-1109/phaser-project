import Phaser from "phaser";
import {Gameplay} from "./scenes/Gameplay";
import {GameOver} from "./scenes/GameOver";
import {StartMenu} from "./scenes/StartMenu";
import {SaveScore} from "./scenes/SaveScore";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import {DisplayAllScores} from "./scenes/DisplayAllScores";


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
        SaveScore,
        DisplayAllScores
    ],
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
    }
};

const game = new Phaser.Game(config);

game.scene.start('startmenu', {
    canvasWidth: config.width,
    canvasHeight: config.height
})