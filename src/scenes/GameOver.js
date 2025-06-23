export class GameOver extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null


    constructor() {
        super('gameover');
    }

    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeigth
    }

    preload() {
        this.load.image('nature', 'assets/nature.jpg');
    }

    create() {
        this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "nature").setOrigin(0.5, 0.5).setDepth(0)
        this.showGameOver()
        this.pressKeyToRestart()
    }

    showGameOver() {
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
            'premi spazio per ricominciare.',
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)
    }

    pressKeyToRestart() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('gameplay')
        })
    }

    update() {
    }

}