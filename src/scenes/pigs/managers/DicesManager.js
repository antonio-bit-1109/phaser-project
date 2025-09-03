export class DicesManager {

    canvasW = null
    canvasH = null
    d1 = 0
    d2 = 0
    currentCountDude = 0;
    currentCountBoss = 0;
    currentCountDudeRef = null
    currentCountBossRef = null;

    d1Ref = null
    d2Ref = null
    iconDiceLaunch = null

    constructor(scene) {
        this.scene = scene
    }

    //getter
    getCurrentCountDude() {
        return this.currentCountDude
    }

    getCurrentCountBoss() {
        return this.currentCountBoss
    }

    updateValue(v1, v2) {
        return v1 + v2;
    }

    setCurrentCountDude(intVal) {
        this.currentCountDude = intVal;
    }

    setCurrentCountBoss(intVal) {
        this.currentCountBoss = intVal;
    }

    getCurrentCountDudeRef() {
        return this.currentCountDudeRef
    }

    getCurrentCountBossRef() {
        return this.currentCountBossRef
    }

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
        this.currentCountDudeRef = this.scene.add.text(this.canvasW / 3.5, this.canvasH / 1.25, "0", {
            fontSize: '12px',
            fill: '#ff0000', // <-- Colore bianco, il più importante!
            stroke: '#000000', // Aggiunge un bordo nero per maggiore leggibilità
            strokeThickness: 2
        })
            .setDepth(3)
            .setScale(6)

        this.currentCountBossRef = this.scene.add.text(this.canvasW / 1.5, this.canvasH / 1.25, "0", {
            fontSize: '12px',
            fill: '#ff0000', // <-- Colore bianco, il più importante!
            stroke: '#000000', // Aggiunge un bordo nero per maggiore leggibilità
            strokeThickness: 2
        })
            .setDepth(3)
            .setScale(6)
    }

    createDiceRef(x, y, text) {
        return this.scene.add.text(x, y, text, {
            fontSize: '16px',
            fill: '#ffffff', // <-- Colore bianco, il più importante!
            stroke: '#000000', // Aggiunge un bordo nero per maggiore leggibilità
            strokeThickness: 2
        })
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

    updateD1Position(x, y) {
        this.d1Ref.setPosition(x, y)
    }

    updateD2Position(x, y) {
        this.d2Ref.setPosition(x, y)

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