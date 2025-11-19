import {calculatePointCircumference_X, calculatePointCircumference_Y, costanti} from "../constants/costanti";
import {MovingControlMobileManager} from "./MovingControlMobileManager";

export class AmbientManager {

    moonSurface = null;
    canvasW = null
    canvasH = null;
    cursor = null
    angolo = 0;
    keySpace = null
    m = 2
    d = 0
    u = 7
    timer = `${this.m}:${this.d}${this.u}`
    timerRef = null
    deltaSum = 0
    movingControlMobileManager = null;
    turboButton_ref = null;


    resetDefault() {
        this.moonSurface = null;
        this.canvasW = null
        this.canvasH = null;
        this.cursor = null
        this.angolo = 0;
        this.keySpace = null
        this.m = 2
        this.d = 0
        this.u = 7
        this.timer = `${this.m}:${this.d}${this.u}`
        this.timerRef = null
        this.deltaSum = 0
    }

    constructor(scene, dudeshipManager) {
        this.scene = scene
        this.dudeShipManager = dudeshipManager
    }

    getMoonSurface() {
        return this.moonSurface
    }

    getTimerMinutes() {
        return this.m
    }

    getTimerDecine() {
        return this.d
    }

    getTimerUnit() {
        return this.u
    }

    getTimerFormatted() {
        return this.timer
    }

    create(w, h) {
        this.canvasH = h
        this.canvasW = w
        this.movingControlMobileManager = new MovingControlMobileManager(this.scene, w);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.createTimer();
        // control check on input mobile
        this.createTurboButton();
        this.movingControlMobileManager.checkPointerClick(this.turboButton_ref);
    }

    createTurboButton() {
        this.turboButton_ref = this.scene.add.image(this.canvasW / 1.2, this.canvasH / 1.15, "turboBtn")
            .setScale(0.3)
            .setVisible(false)

    }

    update(delta) {
        this.checkCursorInput(delta)
        this.updateTimer(delta)
    }


    addImage(x, y, texture, depth, scale, prop) {
        prop = this.scene.add.image(x, y, texture)
            .setScale(scale)
            .setDepth(depth)
    }

    createTimer() {
        this.timerRef = this.scene.add.text(this.canvasW / 1.30, this.canvasH / 12, this.timer)
            .setDepth(4)
            .setScale(5)
    }


    updateTimer(delta) {
        this.deltaSum += delta;
        if (this.deltaSum >= 1000) {

            this.deltaSum -= 1000;

            //2:07
            if (this.d === 0 && this.m === 0 && this.u === 0) return

            if (this.u === 0) {


                if (this.d !== 0) {
                    this.d--;
                    this.u = 9
                }

                if (this.d === 0 && this.u === 0) {
                    this.m--
                    this.d = 5
                    this.u = 9
                }

            } else {

                this.u--
            }


            // final association
            this.updateTimerVisual()
        }
    }

    updateTimerVisual() {
        this.timer = `${this.m}:${this.d}${this.u}`
        this.timerRef.setText(this.timer)
    }

    checkCursorInput(delta) {

        let x;
        let y;

        if (this.cursor.right.isDown || this.movingControlMobileManager.getMovingRight()) {
            this.angolo += costanti.velAngolare * (this.dudeShipManager.getTurbo() ? 3 : 2) * (delta / 1000);
            x = calculatePointCircumference_X(this.canvasW, this.angolo)
            y = calculatePointCircumference_Y(this.canvasH, this.angolo)
            this.dudeShipManager.getDudeShip().setPosition(x, y);
        }

        if (this.cursor.left.isDown || this.movingControlMobileManager.getMovingLeft()) {
            this.angolo -= costanti.velAngolare * (this.dudeShipManager.getTurbo() ? 3 : 2) * (delta / 1000);
            x = calculatePointCircumference_X(this.canvasW, this.angolo)
            y = calculatePointCircumference_Y(this.canvasH, this.angolo)
            this.dudeShipManager.getDudeShip().setPosition(x, y);
        }

        if (
            this.dudeShipManager.getTurboUpperBar().width >= 1 && (
                this.keySpace.isDown || this.movingControlMobileManager.getClickingTurbo()
            )
        ) {

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