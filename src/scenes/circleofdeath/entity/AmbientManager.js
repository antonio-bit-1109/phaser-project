import {calculatePointCircumference_X, calculatePointCircumference_Y, costanti} from "../constants/costanti";

export class AmbientManager {

    moonSurface = null;
    canvasW = null
    canvasH = null;
    cursor = null
    angolo = 0;
    keySpace = null

    // velAngolare = Math.PI / 3; // 90° al secondo

    constructor(scene, dudeshipManager) {
        this.scene = scene
        this.dudeShipManager = dudeshipManager
    }

    getMoonSurface() {
        return this.moonSurface
    }

    setMoonSurface(val) {
        this.moonSurface = val
    }


    create(w, h) {
        this.canvasH = h
        this.canvasW = w
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(delta) {
        this.checkCursorInput(delta)
    }


    addImage(x, y, texture, depth, scale, prop) {
        prop = this.scene.add.image(x, y, texture)
            .setScale(scale)
            .setDepth(depth)
    }

    checkCursorInput(delta) {

        let x;
        let y;

        if (this.cursor.right.isDown) {
            this.angolo += costanti.velAngolare * (this.dudeShipManager.getTurbo() ? 3 : 1) * (delta / 1000);
            x = calculatePointCircumference_X(this.canvasW, this.angolo)
            y = calculatePointCircumference_Y(this.canvasH, this.angolo)
            this.dudeShipManager.getDudeShip().setPosition(x, y);
        }

        if (this.cursor.left.isDown) {
            this.angolo -= costanti.velAngolare * (this.dudeShipManager.getTurbo() ? 3 : 1) * (delta / 1000);
            x = calculatePointCircumference_X(this.canvasW, this.angolo)
            y = calculatePointCircumference_Y(this.canvasH, this.angolo)
            this.dudeShipManager.getDudeShip().setPosition(x, y);
        }

        if (this.keySpace.isDown && this.dudeShipManager.getTurboUpperBar().width >= 1) {

            this.dudeShipManager.setTurbo(true)
            this.dudeShipManager.getTurboUpperBar().width -= 0.58
            this.dudeShipManager.setHasTurboNeedRecharge(true)

            let cloud = this.scene.add.sprite(x, y, "boost_cloud").play("accelerationBoost")

            this.dudeShipManager.getBoostCloudGroup().add(cloud, true)

            this.dudeShipManager.getBoostCloudGroup().children.iterate(boost => {
                boost.on('animationcomplete', () => {
                    boost.destroy();
                });
            })

        } else {
            this.dudeShipManager.setTurbo(false)
        }

    }
}