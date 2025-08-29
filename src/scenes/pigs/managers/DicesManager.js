export class DicesManager {

    canvasW = null
    canvasH = null
    d1 = 0
    d2 = 0

    d1Ref = null
    d2Ref = null
    iconDiceLaunch = null

    constructor(scene) {
        this.scene = scene
    }

    //getter
    getD1Value() {
        return this.d1
    }

    getD2Value() {
        return this.d2
    }

    create(w, h) {
        this.canvasW = w
        this.canvasH = h
        this.d1Ref = this.createDiceRef(this.canvasW / 4, this.canvasH / 4, this.d1)
        this.d2Ref = this.createDiceRef(this.canvasW / 4, this.canvasH / 2, this.d2)
        this.createIconLaunchDices()
        this.setIconLaunchDicesInteractive()
    }

    createDiceRef(x, y, text) {
        return this.scene.add.text(x, y, text)
            .setDepth(4)
            .setScale(10)
    }

    createIconLaunchDices() {
        this.iconDiceLaunch = this.scene.add.image(this.canvasW / 2, this.canvasH - 100, "launchDices")
            .setScale(0.2)

    }

    updateDiceRef(num, prop) {
        prop.setText(num.toString())
    }

    setIconLaunchDicesInteractive() {
        this.iconDiceLaunch.setInteractive({cursor: "pointer"})
            .on("pointerdown", () => {
                this.rollsDice()
                this.updateDiceRef(this.d1, this.d1Ref)
                this.updateDiceRef(this.d2, this.d2Ref)

            })
    }

    rollsDice() {
        console.log("dati tirati")
        this.d1 = Math.floor(Math.random() * 6) + 1
        this.d2 = Math.floor(Math.random() * 6) + 1
        console.log("d1:", this.d1)
        console.log("d2:", this.d2)

    }
}