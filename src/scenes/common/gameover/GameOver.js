export class GameOver extends Phaser.Scene {

    // always presents data
    canvasWidth = null;
    canvasHeight = null
    isGameVictory = null;
    gameName = null
    sceneName = null

    // nulllable data
    punteggioFinale = null;
    livello = null;
    happyDude = null;
    sadDude = null;
    dudeIsPompato = null
    image = null;
    finalTime = null
    gameDifficult = null;
    fogMode = null

    constructor() {
        super('gameover');
    }

    init(data) {
        // Applichiamo il controllo a ogni singola proprietà
        this.canvasWidth = this.checkValue(data.canvasWidth);
        this.canvasHeight = this.checkValue(data.canvasHeight);
        this.punteggioFinale = this.checkValue(data.punteggioFinale);
        this.livello = this.checkValue(data.livello);
        this.isGameVictory = this.checkValue(data.isGameVictory);
        this.dudeIsPompato = this.checkValue(data.dudeIsPompato);
        this.finalTime = this.checkValue(data.gameTime);
        this.gameName = this.checkValue(data.gameName);
        this.sceneName = this.checkValue(data.sceneName);
        this.gameDifficult = this.checkValue(data.gameDifficult);
        this.fogMode = this.checkValue(data.fogMode);
    }

    checkValue(value) {
        return value ? value : null
    }

    preload() {
        this.load.image('sky', 'assets/bombburner/images/sky.png');
        this.load.image('sadDude', "assets/bombburner/images/sad_dude_no_bg.png")
        this.load.image('happyDude', "assets/bombburner/images/happyDude.png")
        this.load.image("happy_dude_corazzato", "assets/bombburner/images/happy_cavaliere.png")
        this.load.image("sad_dude_corazzato", "assets/bombburner/images/sad_cavaliere.png")
        this.load.image("btn_home", "assets/bombburner/images/btn_sfondo.png")
        this.load.image("dudeShip_triste", "assets/pingpong/images/dudeship_triste.png")
        this.load.image("dude_ship_happy", "assets/pingpong/images/happy_dude_ship.png")

        this.load.audio('gameOver_loser', "assets/bombburner/sounds/gameOver.mp3")
        this.load.audio('gameOver_winner', "assets/bombburner/sounds/gameOver_victory.mp3")

    }

    create() {
        console.log('canvasWidth:', this.canvasWidth);
        console.log('canvasHeight:', this.canvasHeight);
        console.log('punteggioFinale:', this.punteggioFinale);
        console.log('livello:', this.livello);
        console.log('happyDude:', this.happyDude);
        console.log('sadDude:', this.sadDude);
        console.log('isGameVictory:', this.isGameVictory);
        console.log('dudeIsPompato:', this.dudeIsPompato);
        console.log('image:', this.image);
        console.log('finalTime:', this.finalTime);
        console.log('gameName:', this.gameName);
        console.log('sceneName:', this.sceneName);


        this.addImage(this.canvasWidth - 200,
            100,
            "btn_home",
            null,
            5,
            0.7,
            {cursor: "pointer"},
            "pointerdown",
            () => {
                this.sound.removeAll();
                this.scene.stop("gameover")
                this.scene.start("startmenu", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight
                })
            })

        this.addImage(this.canvasWidth / 2, this.canvasHeight / 2, "sky", {x: 0.5, y: 0.5}, 0)

        !this.isGameVictory && this.sound.play('gameOver_loser')
        this.isGameVictory && this.sound.play('gameOver_winner')

        this.showGameOver();
        this.pressSpaceToRestart();

    }


    choseImageToShow() {

        if (this.isGameVictory && this.dudeIsPompato && this.gameName.toLowerCase().includes("bomb")) {
            return "happy_dude_corazzato";
        }

        if (this.isGameVictory && !this.dudeIsPompato && this.gameName.toLowerCase().includes("bomb")) {
            return "happyDude";
        }

        if (!this.isGameVictory && !this.dudeIsPompato && this.gameName.toLowerCase().includes("bomb")) {
            return "sadDude";
        }

        if (!this.isGameVictory && this.dudeIsPompato && this.gameName.toLowerCase().includes("bomb")) {
            return "sad_dude_corazzato";
        }

        if (
            !this.isGameVictory && this.gameName.replace(" ", "").toLowerCase().includes("pingpong") ||
            !this.isGameVictory && this.gameName.replace(" ", "").toLowerCase().includes("circle")
        ) {
            return "dudeShip_triste";
        }

        if (
            this.isGameVictory && this.gameName.replace(" ", "").toLowerCase().includes("pingpong") ||
            this.isGameVictory && this.gameName.replace(" ", "").toLowerCase().includes("circle")
        ) {
            return "dude_ship_happy";
        }


    }


    showGameOver() {

        this.image = this.add.image(this.canvasWidth / 2, this.canvasHeight / 4, this.choseImageToShow())
            .setOrigin(0.5, 0.5)
            .setDepth(0)
            .setScale(0.5)

        if (this.image.texture.key === "sad_dude_corazzato") {
            this.image.setScale(0.3)
        }


        this.addText(this.canvasWidth / 2,
            this.canvasHeight / 2,
            "Game Over",
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold',
            },
            {x: 0.5, y: 0.5}
        )

        this.gameName.toLowerCase().includes("bomb") &&
        this.addText(this.canvasWidth / 2,
            this.canvasHeight / 1.8,
            `Punteggio finale: ${this.punteggioFinale}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            },
            {x: 0.5, y: 0.5}
        )


        this.gameName.toLowerCase().includes("bomb") &&
        this.addText(
            this.canvasWidth / 2,
            this.canvasHeight / 1.6,
            `Livello raggiunto: ${this.livello}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            },
            {x: 0.5, y: 0.5}
        )

        this.gameName.toLowerCase().includes("bomb") &&
        this.addText(
            this.canvasWidth / 2,
            this.canvasHeight / 1.4,
            `Tempo di gioco: ${this.finalTime}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            },
            {x: 0.5, y: 0.5}
        )

        if (this.isGameVictory) {

            //
            this.pressEnterToSavePunteggio();
            this.addText(
                this.canvasWidth / 2,
                this.canvasHeight / 1.1,
                'premi Invio per salvare il tuo punteggio.',
                {
                    fontSize: '30px',
                    color: '#f1bb09',
                    fontStyle: 'bold'
                },
                {x: 0.5, y: 0.5}
            )

        } else {

            //

            this.addText(
                this.canvasWidth / 2,
                this.canvasHeight / 1.1,
                'PER SALVARE DEVI VINCERE LA PARTITA',
                {
                    fontSize: '30px',
                    color: '#e05e0f',
                    fontStyle: 'bold'
                },
                {x: 0.5, y: 0.5}
            )
        }

        this.addText(
            this.canvasWidth / 2,
            this.canvasHeight / 1.2,
            'premi spazio per ricominciare.',
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            },
            {x: 0.5, y: 0.5}
        )

    }

    pressSpaceToRestart() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.removeAll()

            if (
                this.sceneName.trim().toLowerCase().includes("pingpong")
                && this.gameDifficult === "HARD"
                && this.fogMode
            ) {
                this.scene.start(this.sceneName, {
                    gameDifficulty: "HARD-F"
                })
            }

            this.scene.start(this.sceneName)
        })
    }

    pressEnterToSavePunteggio() {
        this.input.keyboard.once('keydown-ENTER', () => {
            this.sound.stopAll()
            this.scene.stop("gameover");
            this.scene.start("savescore", {
                gameName: this.gameName,
                punteggioFinale: this.punteggioFinale,
                livello: this.livello,
                tempoGioco: this.finalTime,
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight
            })
        })
    }


    addImage(x, y, texture, origin, depth, scale, hitArea, event, fn) {
        const img = this.add.image(x, y, texture)
        origin && origin.x && origin.y && img.setOrigin(origin.x, origin.y)
        depth && img.setDepth(depth)
        scale && img.setScale(scale)
        hitArea && img.setInteractive(hitArea)
        event && fn && img.once(event, fn)
    }

    addText(x, y, text, style, origin) {
        const tx = this.add.text(x, y, text, style)
        origin && origin.x && origin.y && tx.setOrigin(origin.x, origin.y)
    }

    update() {
    }

}