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
    circleOfDeathName = "Circle of Death"
    pigsName = "Maiale (pig)"

    // rules for pigs game
    r0 = "In this game your aim is to reach 100pts rolling 2 dices at a time. \n " +
        "You can roll dices as many times as you want. \n" +
        " You keep store points for each throw you make as long as you DONT roll a 1," +
        "if so you are going to lose all the points \n you have accumulated and is it now turn for your opponent to play. \n " +
        "During your turn you can decide to roll dices or pass the hand to your opponent. \n " +
        "first one reach 100pts wins the game. \n" +
        " use the mouse to click around. \n" +
        "\n" +
        "\n" +
        " 'Grazie al Fabione per lo spunto su questo giochino!' ;) \n "


    // rules for bombburner game
    r1 = "In this game you have to survive to all bombs. \n" +
        "You can avoid them or destroy them, but be sure to reach the final boss. \n" +
        "Than you have to defeat him of course. \n " +
        "Will you be strong enough to survive? \n" +
        "be careful, you can only fire one bullet at a time. \n " +
        "Arrows LEFT and RIGHT to move, UP to shoot.";

    r2 = "You can only move in circle, you can't fire, \n just survive until the timer runs out. \n" +
        "Arrows LEFT and RIGHT to move your dude \n SPACE to accelerate (keep an eye on your tank on the left while sprinting) ."

    r3 = "Just like pong. \n " +
        "Move using UP and DOWN arrow keys.";

    convertToRadiant(gradi) {
        return Phaser.Math.DegToRad(gradi)
    }

    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
    };

    preload() {

        this.load.image("menuCanvas", "assets/bombburner/images/canvasMenu.png")
        this.load.audio("bg_music", "assets/bombburner/sounds/bg_music.mp3")
        this.load.image("mezzoBustoDude", "assets/bombburner/images/mezzoBustoDude.png")
        this.load.image("boss_silly", "assets/bombburner/images/boss_silly.png")
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
                this.scene.start("generalgamerules", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.bombBurnerGameName,
                    r0: this.r1,
                    gameToStart: "gameplay"
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 2.5, this.pingPongGameName, styleDefault)
            .setDepth(6)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("startmenu");
                this.scene.start("generalgamerules", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.pingPongGameName,
                    r0: this.r3,
                    gameToStart: "choosepongdifficulty"
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 2.1, this.circleOfDeathName, styleDefault)
            .setDepth(6)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("startmenu");
                this.scene.start("generalgamerules", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.circleOfDeathName,
                    r0: this.r2,
                    gameToStart: "circleofdeath"
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 1.8, this.pigsName, styleDefault)
            .setDepth(6)
            .setOrigin(0.5, 0.5)
            .setInteractive({cursor: 'pointer'})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("startmenu");
                this.scene.start("generalgamerules", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight,
                    gameName: this.pigsName,
                    r0: this.r0,
                    gameToStart: "pigs"
                })
            })

        this.add.text(this.canvasWidth / 2, this.canvasHeight / 1.6, "Classifica Punteggi", {
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