export class TurnManager {

    turnSwitcher_ref = null
    canvasW = null
    canvasH = null

    isDudeTurn = true

    constructor(scene) {
        this.scene = scene
    }

    // getter

    getIsDudeTurn() {
        return this.isDudeTurn
    }

    // setIsDudeTurn(bool) {
    //     this.isDudeTurn = bool
    // }

    invertTurn() {
        this.isDudeTurn = !this.isDudeTurn
    }

    create(w, h) {
        this.canvasW = w
        this.canvasH = h
        this.createIconSwitchTurn()
        this.addInteractiveToSwitchTurn()
    }

    createIconSwitchTurn() {
        this.turnSwitcher_ref = this.scene.add.image(this.canvasW / 2, this.canvasH - 300, "switchTurn")
            .setScale(0.3)

    }

    addInteractiveToSwitchTurn() {
        this.turnSwitcher_ref.setInteractive({cursor: "pointer"})
            .on("pointerdown", () => {

                this.invertTurn()
            })
    }
}