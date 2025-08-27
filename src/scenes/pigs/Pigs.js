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
    }

    create() {
        console.log(this.canvasWidth)
        console.log(this.canvasHeight)
        console.log(this.gameName)

    }

    update() {
    }
}