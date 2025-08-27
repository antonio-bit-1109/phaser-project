export class Pigs extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;

    dudeContainer = null
    dudeContainerVolume = null
    dudeVolumeValue = 0

    bossContainer = null
    bossContainerVolume = null
    bossVolumeValue = 0

    constructor() {
        super("pigs");
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
    }

    create() {

        this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "table_poker_bg")
            .setDepth(-1)
            .setScale(1.0)

        this.add.image(this.canvasWidth / 9.7, this.canvasHeight / 1.2, "dudePoker")
            .setDepth(0)
            .setScale(0.4)

        this.add.image(this.canvasWidth / 1.15, this.canvasHeight / 1.2, "bossPoker")
            .setDepth(0)
            .setScale(0.5)

        // middle line separation canvas dx e sn
        const middleLine = this.add.graphics()
            .fillStyle(0xFFFFFF)
            .fillRect(this.canvasWidth / 2, 0 / 2, 2, this.canvasHeight)
        middleLine.strokePath()

        // container lato dude, background
        this.dudeContainer = this.add.graphics()
        this.dudeContainer
            .fillStyle(0xd2d2d2)
            .fillRect(this.canvasWidth / 20, this.canvasHeight / 18, 35, 300)

        // volume del container che si riempie
        this.dudeContainerVolume = this.add.graphics()
        this.dudeContainerVolume
            .fillStyle(0x008000)
            .fillRect(this.canvasWidth / 20, this.canvasHeight / 18, 35, 60)
        //.setRotation(Phaser.Math.DegToRad(180))

        // container lato boss
        this.bossContainer = this.add.graphics()
        this.bossContainer
            .fillStyle(0xd2d2d2)
            .fillRect(this.canvasWidth / 1.1, this.canvasHeight / 18, 35, 300)

    }

    update() {
    }
}