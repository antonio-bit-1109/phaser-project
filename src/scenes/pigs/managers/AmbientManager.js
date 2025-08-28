export class AmbientManager {

    COLOR_RIEMPIMENTO = 0x008000
    COLOR_OUTERCONTAINER = 0xd2d2d2
    POINTSGOAL = 60
    TOTAL_OUTERCONTAINERHEIGTH = 300

    canvasW = null
    canvasH = null

    dudeOuterContainer = null
    dudeContainerVolume = null
    dudeVolumeValue = 0

    bossOuterContainer = null
    bossContainerVolume = null
    bossVolumeValue = 0

    constructor(scene) {
        this.scene = scene
    }

    create(canvasW, canvasH) {

        this.canvasW = canvasW
        this.canvasH = canvasH

        this.addImage(
            this.canvasW / 2,
            this.canvasH / 2,
            "table_poker_bg",
            -1,
            1.0
        )

        this.addImage(
            this.canvasW / 9.7,
            this.canvasH / 1.2,
            "dudePoker",
            0,
            0.4
        )

        this.addImage(
            this.canvasW / 1.15,
            this.canvasH / 1.2,
            "bossPoker",
            0,
            0.5
        )


        // middle line separation canvas dx e sn
        this.addRectangle(0xFFFFFF, this.canvasW / 2, 0 / 2, 2, this.canvasH)

        // container lato dude, background
        this.dudeOuterContainer = this.addRectangle(
            this.COLOR_OUTERCONTAINER,
            this.canvasW / 20,
            this.canvasH / 18,
            35,
            300
        )

        // volume del container che si riempie che al momento della create sarà zero
        this.dudeContainerVolume = this.addRectangle(
            this.COLOR_RIEMPIMENTO,
            this.canvasW / 20,
            this.canvasH / 18,
            35,
            this.dudeVolumeValue
        )


        // ALZARE LA Y DI PARTENZA E SPECIFICARE L'ALTEZZA DELL ELEMENTO GRAFICO

        // container lato boss, anche esso di base starà a zero
        this.bossOuterContainer = this.addRectangle(
            this.COLOR_OUTERCONTAINER,
            this.canvasW / 1.1,
            this.canvasH / 18,
            35,
            300
        )

        this.bossContainerVolume = this.addRectangle(
            this.COLOR_RIEMPIMENTO,
            this.canvasW / 1.1,
            this.canvasH / 18,
            35,
            this.bossVolumeValue
        )

        // numeration dents for bossContainer
        this.addNumerationDent(this.canvasW / 1.15, this.canvasH / 18 + 280, "0-")
        this.addNumerationDent(this.canvasW / 1.175, this.canvasH / 18 + 130, "30-")
        this.addNumerationDent(this.canvasW / 1.175, this.canvasH / 18 - 20, "60-")

        // numeration dents for dudeContainer

        // this.addNumerationDent(this.canvasW / 1, this.canvasH / 18 + 280, "0-")
        // this.addNumerationDent(this.canvasW / 1.175, this.canvasH / 18 + 130, "30-")
        this.addNumerationDent(this.canvasW / 11, this.canvasH / 18 - 20, "-60")
        this.addNumerationDent(this.canvasW / 11, this.canvasH / 18 + 130, "-30")
        this.addNumerationDent(this.canvasW / 11, this.canvasH / 18 + 280, "-0")


        // this.updateVolume(this.dudeContainerVolume, 200)
        // this.updateVolume(this.dudeContainerVolume, 50)
        // this.updateVolume(this.bossContainerVolume, 150)
        // this.updateVolume(this.dudeContainerVolume, 150)
    }

    //METHODS

    addNumerationDent(x, y, val) {
        this.scene.add.text(x, y, val)
            .setScale(2)
    }

    addImage(x, y, texture, depth, scale) {
        this.scene.add.image(x, y, texture)
            .setDepth(depth)
            .setScale(scale)
    }

    addRectangle(color, x, y, width, height) {
        return this.scene.add.graphics()
            .fillStyle(color)
            .fillRect(x, y, width, height)
            .setData({
                x: x,
                y: y,
                width: width,
                height: height
            })
    }

    // aggiungere riempimento al contenitore interno partendo dal basso (effetto riempimento)
    updateVolume(containerVolumeObj, newValue) {

        // prendo i dati dal data impostato sull oggetto
        const data = containerVolumeObj.data.values

        // // pulisco la canvas eliminando l elem grafico
        containerVolumeObj
            .clear()

        // contiene i valori di base x,y,width,heigth dell elemento grafico
        console.log(data)

        // 3. Calcola la posizione della base (non cambia mai).
        const baseY = this.canvasH / 18 + this.TOTAL_OUTERCONTAINERHEIGTH;

        // 4. Calcola la Y di partenza per il nuovo rettangolo. QUESTA È LA FORMULA CHIAVE.
        const fillY = baseY - newValue;

        // ricalcolo la posizione del nuovo elemento grafico sulla base dei dati salvati sull elemento grafico stesso
        // grazie al setData scritto in precedenza
        containerVolumeObj
            .fillStyle(this.COLOR_RIEMPIMENTO)
            .fillRect(data.x, fillY, data.width, newValue)
        containerVolumeObj.strokePath()
    }
}