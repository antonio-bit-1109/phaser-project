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
    mezzoBusto1 = null;
    mezzoBusto2 = null;
    mezzoBusto3 = null;
    mezzoBusto4 = null;


    convertToRadiant(gradi) {
        return Phaser.Math.DegToRad(gradi)
    }

    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
    };

    preload() {

        this.load.image("menuCanvas", "assets/canvasMenu.png")
        this.load.audio("bg_music", "assets/sounds/bg_music.mp3")
        this.load.image("mezzoBustoDude", "assets/mezzoBustoDude.png")
    };

    create() {

        this.sound.play("bg_music", {
            volume: 1,
            loop: true
        })

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
                this.sound.stopAll()
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


// i quattro mezzi busti che dovranno fare su e giu!!! x.x
        this.mezzoBusto1 = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "mezzoBustoDude")
            .setDepth(10)
            .setScale(0.5)
            .setRotation(this.convertToRadiant(90))

        this.mezzoBusto2 = this.add.image(this.canvasWidth / 4, this.canvasHeight / 2, "mezzoBustoDude")
            .setDepth(10)
            .setScale(0.5)
            .setRotation(this.convertToRadiant(90))

        this.mezzoBusto3 = this.add.image(this.canvasWidth / 4, this.canvasHeight / 2, "mezzoBustoDude")
            .setDepth(10)
            .setScale(0.5)
            .setRotation(this.convertToRadiant(270))

        this.mezzoBusto4 = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "mezzoBustoDude")
            .setDepth(10)
            .setScale(0.5)
            .setRotation(this.convertToRadiant(270))


    };

    update(time, delta) {


    }

}