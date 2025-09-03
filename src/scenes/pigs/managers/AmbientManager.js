export class AmbientManager {

    COLOR_RIEMPIMENTO = 0x008000
    COLOR_OUTERCONTAINER = 0xd2d2d2
    POINTSGOAL = 100
    DOUBLEONETHROW = 25
    TOTAL_OUTERCONTAINERHEIGTH = 300

    canvasW = null
    canvasH = null

    dudeOuterContainer = null
    dudeContainerVolume = null
    dudeVolumeValue = 0

    bossOuterContainer = null
    bossContainerVolume = null
    bossVolumeValue = 0


    notificationRef = null


    constructor(scene) {
        this.scene = scene
    }

    // getter

    getDoubleOneThrow() {
        return this.DOUBLEONETHROW
    }

    getTotalContainerHeight() {
        return this.TOTAL_OUTERCONTAINERHEIGTH
    }

    getPointsGoal() {
        return this.POINTSGOAL
    }

    getDudeContainerVolume() {
        return this.dudeContainerVolume
    }

    getBossContainerVolume() {
        return this.bossContainerVolume
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
        this.addNumerationDent(this.canvasW / 1.175, this.canvasH / 18 + 130, "50-")
        this.addNumerationDent(this.canvasW / 1.175, this.canvasH / 18 - 20, "100-")

        // numeration dents for dudeContainer

        // this.addNumerationDent(this.canvasW / 1, this.canvasH / 18 + 280, "0-")
        // this.addNumerationDent(this.canvasW / 1.175, this.canvasH / 18 + 130, "30-")
        this.addNumerationDent(this.canvasW / 11, this.canvasH / 18 - 20, "-100")
        this.addNumerationDent(this.canvasW / 11, this.canvasH / 18 + 130, "-50")
        this.addNumerationDent(this.canvasW / 11, this.canvasH / 18 + 280, "-0")

        this.createNotificationWhoIsTurn()

    }


    update(time, delta) {

    }

    //METHODS

    createNotificationWhoIsTurn() {
        this.notificationRef = this.scene.add.text(this.canvasW / 7.5, this.canvasH / 10, "È il tuo turno...", {
            fontSize: '15px',
            fill: '#ffffff', // <-- Colore bianco, il più importante!
            stroke: '#000000', // Aggiunge un bordo nero per maggiore leggibilità
            strokeThickness: 4
        })
            .setDepth(2)
            .setScale(2.2)
    }

    updateNotificationPosition(x, y) {
        this.notificationRef
            .setPosition(x, y)
    }


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
                height: height,
                prevVal: 0
            })
    }

    // aggiungere riempimento al contenitore interno partendo dal basso (effetto riempimento)
    updateVolume(containerVolumeObj, newValue) {


        // prendo i dati dal data impostato sull oggetto
        const data = containerVolumeObj.data.values

        if (newValue !== 0) {
            data.prevVal += newValue

        } else {
            data.prevVal = 0
        }

        console.log(data.prevVal, "prevval della grafica ")

        // // pulisco la canvas eliminando l elem grafico
        containerVolumeObj
            .clear()

        // contiene i valori di base x,y,width,heigth dell elemento grafico
        console.log(data)

        // 3. Calcola la posizione della base (non cambia mai).
        const baseY = this.canvasH / 18 + this.TOTAL_OUTERCONTAINERHEIGTH;

        // 4. Calcola la Y di partenza per il nuovo rettangolo. QUESTA È LA FORMULA CHIAVE.
        const fillY = baseY - (data.prevVal === 0 ? newValue : data.prevVal);

        // ricalcolo la posizione del nuovo elemento grafico sulla base dei dati salvati sull elemento grafico stesso
        // grazie al setData scritto in precedenza
        containerVolumeObj
            .fillStyle(this.COLOR_RIEMPIMENTO)
            .fillRect(data.x, fillY, data.width, data.prevVal === 0 ? newValue : data.prevVal)
        containerVolumeObj.strokePath()

        console.log("valore passato al container volume", newValue)
    }
}