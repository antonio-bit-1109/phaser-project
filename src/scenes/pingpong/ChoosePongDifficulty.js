export class ChoosePongDifficulty extends Phaser.Scene {


    constructor() {
        super("choosepongdifficulty");
    }

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    gameDifficulty = null

    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight;
        this.gameName = data.gameName
    }

    preload() {
    }

    create() {
        this.add.text(this.canvasWidth / 2, this.canvasHeight / 8, "Scegli la difficoltà di gioco:", {fontStyle: 'bold'})
            .setOrigin(0.5, 0.5)
            .setFontSize(40)


        this.add.text(this.canvasWidth / 2, (this.canvasHeight / 8) + 100, "FACILE", {fontStyle: 'bold'})
            .setOrigin(0.5, 0.5)
            .setFontSize(40)
            .setColor("green")
            .setInteractive({useHandCursor: true})
            .once("pointerdown", () => {
                this.chooseDifficulty("EASY")
                this.stopSceneAndStartPingPong()
            })


        this.add.text(this.canvasWidth / 2, (this.canvasHeight / 8) + 200, "MEDIO", {fontStyle: 'bold'})
            .setOrigin(0.5, 0.5)
            .setFontSize(40)
            .setColor("orange")
            .setInteractive({useHandCursor: true})
            .once("pointerdown", () => {
                this.chooseDifficulty("MEDIUM")
                this.stopSceneAndStartPingPong()
            })


        this.add.text(this.canvasWidth / 2, (this.canvasHeight / 8) + 300, "DIFFICILE", {fontStyle: 'bold'})
            .setOrigin(0.5, 0.5)
            .setFontSize(40)
            .setColor("red")
            .setInteractive({useHandCursor: true})
            .once("pointerdown", () => {
                this.chooseDifficulty("HARD")
                this.stopSceneAndStartPingPong()
            })

    }

    chooseDifficulty(difficulty) {
        this.gameDifficulty = difficulty
    }

    stopSceneAndStartPingPong() {
        this.scene.stop("choosepongdifficulty")
        this.scene.start("pingpong", {
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            gameName: this.gameName,
            gameDifficulty: this.gameDifficulty
        })
    }

    update() {
    }
}