import Phaser from "phaser";
import {Gameplay} from "./scenes/bombburner/Gameplay";
import {StartMenu} from "./scenes/common/StartMenu";
import {SaveScore} from "./scenes/common/SaveScore";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import {DisplayAllScores} from "./scenes/common/DisplayAllScores";
import {PingPong} from "./scenes/pingpong/PingPong";
import {ChoosePongDifficulty} from "./scenes/pingpong/ChoosePongDifficulty";
import {CircleOfDeath} from "./scenes/circleofdeath/CircleOfDeath";
import {GameOver} from "./scenes/common/gameover/GameOver";
import {Pigs} from "./scenes/pigs/Pigs";
import {GeneralGameRules} from "./scenes/pigs/GeneralGameRules";

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
        DisplayAllScores,
        PingPong,
        ChoosePongDifficulty,
        CircleOfDeath,
        Pigs,
        GeneralGameRules
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