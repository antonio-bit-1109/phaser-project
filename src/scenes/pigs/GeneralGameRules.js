import setInteractive from "phaser3-rex-plugins/plugins/board/board/input/SetInteractive";

export class GeneralGameRules extends Phaser.Scene {

    rulesTitle = "Rules of the game: ";
    r0 = null;
    canvasWidth = null;
    canvasHeight = null;
    gameName = null;

    gameToStart = null;

    constructor() {
        super("generalgamerules");
    }


    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight;
        this.gameName = data.gameName;
        this.gameToStart = data.gameToStart;
        this.r0 = data.r0;
    }

    preload() {

    }

    create() {
        this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 8, this.rulesTitle, {
            fontSize: '40px',
            color: '#f40707',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setOrigin(0.5, 0.5)

        this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 1.5, this.r0, {
            fontSize: '20px',
            color: '#f5f5ef',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setOrigin(0.5, 0.5)

        this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 1.1, "Click here to continue", {
            fontSize: '30px',
            color: '#ef0b0b',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.scene.stop("pigsrules");
                this.scene.start(this.gameToStart, {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.gameName
                })
            })
    }

    update(time, delta) {
        super.update(time, delta);
    }
}