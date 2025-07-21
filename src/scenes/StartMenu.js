const styleDefault = {
    fontSize: '30px',
    color: '#1e1e1b',
    fontStyle: 'bold',
    fontFamily: "verdana"

}


export class StartMenu extends Phaser.Scene {

    constructor() {
        super("startmenu");
    }

    title = "Bomb burner"
    canvasMenu = null;
    canvasWidth = null;
    canvasHeight = null;
    startGameRef = null;


    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
    };

    preload() {

        this.load.image("menuCanvas", "assets/canvasMenu.png")
    };

    create() {
        this.canvasMenu = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "menuCanvas")
            .setScale(1.3, 1.3)
            .setDepth(1)

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 5, this.title.toUpperCase(), {
            fontSize: '50px',
            color: '#1e1e1b',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setDepth(2)
            .setOrigin(0.5, 0.5)

        this.startGameRef = this.add.text(this.canvasWidth / 2, this.canvasHeight / 3, "Start Game", styleDefault)
            .setDepth(2)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.scene.stop("startmenu");
                this.scene.start("gameplay", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 2.5, "Classifica Punteggi", {
            fontSize: '30px',
            color: '#1e1e1b',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setDepth(2)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
    };

    update(time, delta) {
        super.update(time, delta);
    }

}