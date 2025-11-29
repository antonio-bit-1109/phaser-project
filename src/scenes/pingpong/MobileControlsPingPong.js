export class MobileControlsPingPong {

    movingUp = false;
    movingDown = false;
    canvasH = null;
    scene = null;
    dudeShipBody = null;

    constructor(scene, canvasHeight) {

        if (scene === null || scene === undefined) {
            console.error("la scene passata è null o undefined.")
        }

        if (canvasHeight === null || canvasHeight === undefined) {
            console.error("la height passata è null o undefined.")
        }

        this.scene = scene;
        this.canvasH = canvasHeight;

    }

    addEventClick() {

        this.scene.input.on('pointerdown', (pointer) => {

            console.log(pointer);
            console.log(this.dudeShipBody)

            if (pointer.y < this.dudeShipBody.y) {
                this.movingDown = false;
                this.movingUp = true;

            }

            if (pointer.y > this.dudeShipBody.y) {
                this.movingDown = true;
                this.movingUp = false;

            }

            console.log("valore moving down = ", this.movingDown);
            console.log("valore moving up", this.movingUp);
        })

    }
    

    getMovingUp() {
        return this.movingUp;
    }

    getMovingDown() {
        return this.movingDown;
    }

    getDudePosition(dudeShipBody) {
        this.dudeShipBody = dudeShipBody;
    }
}