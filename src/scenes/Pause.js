export class Pause extends Phaser.Scene {

    skyString = null;
    terrainString = null;
    CANVASWIDTH = null;
    CANVASHEIGHT = null;

    // il constructor serve per dare un nome a questa classe, se la devo richiamare da qualche parte questo sarà il nome
    constructor() {
        super('pause');
    }


    init(data) {
        this.skyString = data.skyString
        this.terrainString = data.terrainString
        this.CANVASWIDTH = data.canvasWidth
        this.CANVASHEIGHT = data.canvasHeight
    }

    preload() {

        this.load.image("sky", this.skyString)
        this.load.image("terrain", this.terrainString)

        this.load.image("buttonResume", "assets/buttonResume.png")
        this.load.image("canvasPause", "assets/canvasPause.png")
    }

    create() {


        this.add.image(this.CANVASWIDTH / 2, this.CANVASHEIGHT / 2, "sky")
            .setOrigin(0.5, 0.5)
            .setAlpha(0.6)
        this.grassTerrain = this.physics.add
            .staticSprite(0, this.CANVASHEIGHT - 80, 'terrain')
            .setOrigin(0, 0)
            .setDepth(2)
            .setAlpha(0.4)

        this.physics.add.staticSprite(this.CANVASWIDTH / 2, this.CANVASHEIGHT / 2, "canvasPause")
            .setDepth(20)


        this.physics.add.staticSprite(this.CANVASWIDTH / 2, this.CANVASHEIGHT / 2, "buttonResume")
            .setDepth(20)
            .setScale(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.pause("pause")
                this.scene.resume("gameplay")
            })

    }

    update(time, delta) {


    }
}