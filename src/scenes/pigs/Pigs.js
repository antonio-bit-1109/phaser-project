import {AmbientManager} from "./managers/AmbientManager";
import {DicesManager} from "./managers/DicesManager";

export class Pigs extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;

    // dudeContainer = null
    // dudeContainerVolume = null
    // dudeVolumeValue = 0
    //
    // bossContainer = null
    // bossContainerVolume = null
    // bossVolumeValue = 0

    constructor() {
        super("pigs");
        this.ambientManager = new AmbientManager(this)
        this.dicesmanager = new DicesManager(this)
    }

    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
        this.gameName = data.gameName
    }

    preload() {

        this.load.image("table_poker_bg", "assets/pigs/images/poker_table_green_fabric.png")
        this.load.image("dudePoker", "assets/bombburner/images/mezzoBustoDude.png")
        this.load.image("bossPoker", "assets/bombburner/images/boss_silly.png")
        this.load.image("launchDices", "assets/pigs/images/lancia_dadi.jpg")
    }

    create() {

        this.ambientManager.create(this.canvasWidth, this.canvasHeight)
        this.dicesmanager.create(this.canvasWidth, this.canvasHeight)
    }

    update() {
    }
}