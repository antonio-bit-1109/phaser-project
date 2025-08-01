export class GameOver extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null
    punteggioFinale = null;
    livello = null;
    happyDude = null;
    sadDude = null;
    isGameVictory = null;
    dudeIsPompato = null
    image = null;
    finalTime = null
    gameName = null


    constructor() {
        super('gameover');
    }

    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeigth;
        this.punteggioFinale = data.punteggioFinale;
        this.livello = data.livello;
        this.isGameVictory = data.isGameVictory
        this.dudeIsPompato = data.isDudePompato
        this.finalTime = data.gameTime
        this.gameName = data.gameName

    }

    preload() {
        this.load.image('sky', 'assets/bombburner/images/sky.png');
        this.load.image('sadDude', "assets/bombburner/images/sad_dude_no_bg.png")
        this.load.image('happyDude', "assets/bombburner/images/happyDude.png")
        this.load.image("happy_dude_corazzato", "assets/bombburner/images/happy_cavaliere.png")
        this.load.image("sad_dude_corazzato", "assets/bombburner/images/sad_cavaliere.png")
        this.load.image("btn_home", "assets/bombburner/images/btn_sfondo.png")

        this.load.audio('gameOver_loser', "assets/bombburner/sounds/gameOver.mp3")
        this.load.audio('gameOver_winner', "assets/bombburner/sounds/gameOver_victory.mp3")

    }

    create() {

        this.add.image(this.canvasWidth - 200, 100, "btn_home")
            .setDepth(5)
            .setScale(0.7)
            .setInteractive({cursor: "pointer"}) // cursore manina
            .once("pointerdown", () => {
                this.sound.removeAll();
                this.scene.stop("gameover")
                this.scene.start("startmenu", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight
                })
            })

        this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "sky").setOrigin(0.5, 0.5).setDepth(0)
        !this.isGameVictory && this.sound.play('gameOver_loser')
        this.isGameVictory && this.sound.play('gameOver_winner')
        this.showGameOver();
        this.pressSpaceToRestart();

    }


    choseImageToShow() {

        if (this.isGameVictory && this.dudeIsPompato) {
            return "happy_dude_corazzato"
        }

        if (this.isGameVictory && !this.dudeIsPompato) {
            return "happyDude"
        }

        if (!this.isGameVictory && !this.dudeIsPompato) {
            return "sadDude"
        }

        if (!this.isGameVictory && this.dudeIsPompato) {
            return "sad_dude_corazzato"
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

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 2,
            'Game Over.',
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0.5)

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.8,
            `Punteggio finale: ${this.punteggioFinale}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.6,
            `Livello raggiunto: ${this.livello}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.4,
            `Tempo di gioco: ${this.finalTime}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)


        if (this.isGameVictory) {

            //
            this.pressEnterToSavePunteggio();
            this.add.text(
                this.canvasWidth / 2,
                this.canvasHeight / 1.1,
                'premi Invio per salvare il tuo punteggio.',
                {
                    fontSize: '30px',
                    color: '#f1bb09',
                    fontStyle: 'bold'
                }).setOrigin(0.5, 0.5)
            //
        } else {

            //
            this.add.text(
                this.canvasWidth / 2,
                this.canvasHeight / 1.1,
                'Puoi salvare il tuo punteggio solo battendo il boss.',
                {
                    fontSize: '30px',
                    color: '#e05e0f',
                    fontStyle: 'bold'
                }).setOrigin(0.5, 0.5)
        }

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.2,
            'premi spazio per ricominciare.',
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

    }

    pressSpaceToRestart() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.removeAll()
            this.scene.start('gameplay')
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

    update() {
    }

}