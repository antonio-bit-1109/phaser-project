export class Pigs extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;

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


    }

    update() {
    }
}