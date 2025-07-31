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
    mezzoBusto_boss = null
    introMusicAuthor = `Menù music made by Fassounds - play time`
    bombBurnerGameName = "Bomb Burner"
    pingPongGameName = "Ping pong dude"

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
        this.load.image("boss_silly", "assets/boss_silly.png")
    };

    create() {

        this.add.text(this.canvasWidth / 2, this.canvasHeight - 100, this.introMusicAuthor)
            .setDepth(6)
            .setOrigin(0.5, 0.5)

        this.sound.play("bg_music", {
            volume: 1,
            loop: true
        })

        this.canvasMenu = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "menuCanvas")
            .setScale(1.3, 1.3)
            .setDepth(5)

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 5, this.title.toUpperCase(), {
            fontSize: '50px',
            color: '#1e1e1b',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setDepth(6)
            .setOrigin(0.5, 0.5)

        this.startGameRef = this.add.text(this.canvasWidth / 2, this.canvasHeight / 3, this.bombBurnerGameName, styleDefault)
            .setDepth(6)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("startmenu");
                this.scene.start("gameplay", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.bombBurnerGameName
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 2.5, this.pingPongGameName, styleDefault)
            .setDepth(6)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("startmenu");
                this.scene.start("pingpong", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.pingPongGameName
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 2.1, "Classifica Punteggi", {
            fontSize: '30px',
            color: '#1e1e1b',
            fontStyle: 'bold',
            fontFamily: "verdana"
        })
            .setDepth(6)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("startmenu");
                this.scene.start("displayallscores", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight
                })
            })

        this.mezzoBusto1 = this.physics.add.image(
            this.canvasMenu.x + this.canvasMenu.displayWidth / 4,
            this.canvasHeight / 3.5,
            "mezzoBustoDude")
            .setDepth(4)
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setRotation(this.convertToRadiant(90))

        this.mezzoBusto_boss = this.physics.add.image(
            100,
            this.canvasHeight + 100,
            "boss_silly")
            .setDepth(10)
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
        // .setRotation(this.convertToRadiant(90))


        this.moveMezzoBusto(this.mezzoBusto1)
        this.moveMezzoBustoStraigth(this.mezzoBusto_boss)
    };

    update(time, delta) {
    }

    moveMezzoBustoStraigth(mezzobusto) {


        this.tweens.chain({
            targets: mezzobusto,
            loop: -1,
            tweens: [
                {
                    duration: 1500,
                    y: this.canvasHeight - 100
                },
                {
                    duration: 1500,
                    y: this.canvasHeight + 100
                },
                {
                    x: this.canvasWidth / 2
                },
                {
                    duration: 1500,
                    y: this.canvasHeight - 100
                },
                {
                    duration: 1500,
                    y: this.canvasHeight + 100
                },
                {
                    x: this.canvasWidth - 100
                },
                {
                    duration: 1500,
                    y: this.canvasHeight - 100
                },
                {
                    y: this.canvasHeight + 100
                },
                {
                    duration: 5000,
                    x: this.canvasWidth / 2,
                    y: this.canvasHeight - 100
                },
                {
                    duration: 5000,
                    x: 100,
                    y: this.canvasHeight + 100
                }
            ]
        })
    }

    moveMezzoBusto(mezzobusto) {

        this.tweens.chain({
            targets: mezzobusto,
            loop: -1,
            tweens: [
                {
                    angle: 90,
                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x + 250,
                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x - 200,
                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    y: mezzobusto.y + 230,
                    angle: 0
                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x - 600,

                },
                {

                    duration: 2000,
                    ease: 'Linear',
                    x: mezzobusto.x + 250,

                },
                {

                    duration: 1000,
                    ease: 'Linear',
                    x: mezzobusto.x - 250,

                },
                {
                    angle: -90,
                    y: mezzobusto.y
                },
                {
                    duration: 1000,
                    x: 100
                },
                {
                    duration: 3000,
                    x: 200
                },
                {
                    duration: 1000,
                    x: 400
                },
                {
                    duration: 10,
                    angle: 90
                }
            ]
        });

    }
}