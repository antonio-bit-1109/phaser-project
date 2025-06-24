export class GameOver extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null
    punteggioFinale = null;
    livello = null;


    constructor() {
        super('gameover');
    }

    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeigth;
        this.punteggioFinale = data.punteggioFinale;
        this.livello = data.livello;
    }

    preload() {
        this.load.image('nature', 'assets/nature.jpg');
        this.load.image('sadDude', "assets/sad_dude_no_bg.png")
        this.load.audio('gameOver', "assets/sounds/gameOver.mp3")
    }

    create() {
        this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "nature").setOrigin(0.5, 0.5).setDepth(0)
        this.sound.play('gameOver')
        this.showGameOver()
        this.pressKeyToRestart()
    }

    showGameOver() {

        this.add.image(this.canvasWidth / 2, this.canvasHeight / 3, 'sadDude')
            .setOrigin(0.5, 0.5)
            .setDepth(0)
            .setScale(0.5)

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.8,
            'Game Over.',
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0.5)

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.6,
            `Punteggio finale: ${this.punteggioFinale}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

        this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 1.4,
            `Livello raggiunto: ${this.livello}`,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

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

    pressKeyToRestart() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.get('gameOver').destroy()
            this.scene.start('gameplay')
        })
    }

    update() {
    }

}