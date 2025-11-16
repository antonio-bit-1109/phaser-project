export class MovingControlMobileManager {

    scene = null;
    canvasW = null;
    movingRight = false;
    movingLeft = false;

    constructor(scene, canvasW) {
        this.scene = scene;
        this.canvasW = canvasW;
    }

    // add event to check if clicked on the right side of the screen
    checkPointerClick() {
        this.scene.input.on('pointerdown', (pointer) => {
            console.log(pointer.x, "VALOR POINTER X")

            if (pointer.x > this.canvasW / 2) {
                this.movingRight = true
                this.movingLeft = false
                console.log("il click sta nella parte destra dello schermo ??", pointer.x > this.canvasW / 2)

            }

            if (pointer.x < this.canvasW / 2) {
                this.movingRight = false
                this.movingLeft = true
                console.log("il click sta nella parte sinistra dello schermo ??", pointer.x < this.canvasW / 2)

            }

        })


        this.scene.input.on('pointerup', () => {
            this.movingRight = false
            this.movingLeft = false
        })


        console.log("moving right: ", this.movingRight);
    }

    getMovingRight() {
        return this.movingRight
    }

    getMovingLeft() {
        return this.movingLeft;
    }
}