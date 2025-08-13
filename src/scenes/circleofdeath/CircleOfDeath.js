export class CircleOfDeath  extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;

    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight;
    }

    preload() {
        this.load.spritesheet('dude', 'assets/bombburner/images/dude.png', {
            frameHeight: 45,
            frameWidth: 32
        })
    }


    create() {

    }

    update(time, delta) {

    }
}