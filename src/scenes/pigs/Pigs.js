import {AmbientManager} from "./managers/AmbientManager";
import {DicesManager} from "./managers/DicesManager";
import {TurnManager} from "./managers/TurnManager";
import {SoundsManager} from "../circleofdeath/managers/SoundsManager";

export class Pigs extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;

    d1_currVal = 0
    d2_currVal = 0

    // isDudeTurn = true

    constructor() {
        super("pigs");
        this.dicesmanager = new DicesManager(this)
        this.ambientManager = new AmbientManager(this)
        this.turnManager = new TurnManager(this)
        this.soundsManager = new SoundsManager(this)
    }

    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
        this.gameName = data.gameName
    }

    preload() {

        this.load.image("table_poker_bg", "assets/pigs/images/poker_table_green_fabric.png")
        this.load.image("dudePoker", "assets/bombburner/images/mezzoBustoDude.png")
        this.load.image("bossPoker", "assets/bombburner/images/boss_silly.png")
        this.load.image("launchDices", "assets/pigs/images/lancia_dadi.jpg")
        this.load.image("switchTurn", "assets/pigs/images/swipePlayer.png")

        this.load.audio("lounge_jazz_1", "assets/pigs/sounds/lounge_jazz1.mp3")
        this.load.audio("lounge_jazz_2", "assets/pigs/sounds/lounge_jazz2.mp3")

    }

    create() {

        this.ambientManager.create(this.canvasWidth, this.canvasHeight)
        this.dicesmanager.create(this.canvasWidth, this.canvasHeight)
        this.turnManager.create(this.canvasWidth, this.canvasHeight)

        this.soundsManager.addAudio("lounge_jazz_1", {
            volume: 1
        })

        this.soundsManager.addAudio("lounge_jazz_2", {
            volume: 1
        })

        this.soundsManager.loopSounds(["lounge_jazz_1", "lounge_jazz_2"])

    }

    update(time, delta) {

        // se il valore dei dadi nella classe principale è uguale al valore dei dati in diceManager,
        // non c'è stato alcun nuovo lancio.
        // tutto fermo
        if (this.d1_currVal === this.dicesmanager.getD1Value() && this.d2_currVal === this.dicesmanager.getD2Value()) return

        // vicevera se i dadi sono stati lanciati
        // e c'è una variazione tra i valori dentro dicemangaer e pigs allora ce stato un nuovo lancio
        this.d1_currVal = this.dicesmanager.getD1Value()
        this.d2_currVal = this.dicesmanager.getD2Value()

        console.log("registrato variazione del valore dei dadi")

        // se uno dei valori lanciati dal dado è 1 il turno del player attuale finisce e resetta a zero la propria barra del punteggio
        if (this.IsAnyDiceValueOne(this.d1_currVal, this.d2_currVal)) {

            this.turnManager.getIsDudeTurn() && this.ambientManager.updateVolume(this.ambientManager.getDudeContainerVolume(), 0)
            !this.turnManager.getIsDudeTurn() && this.ambientManager.updateVolume(this.ambientManager.getBossContainerVolume(), 0)

            // this.isDudeTurn = !this.isDudeTurn
            // this.turnManager.setIsDudeTurn(!this.dude)
            this.turnManager.invertTurn()
            return
        }

        let sumDices = this.d1_currVal + this.d2_currVal

        this.turnManager.getIsDudeTurn() && this.ambientManager.updateVolume(this.ambientManager.getDudeContainerVolume(), this.proportionateValues(sumDices))
        !this.turnManager.getIsDudeTurn() && this.ambientManager.updateVolume(this.ambientManager.getBossContainerVolume(), this.proportionateValues(sumDices))

    }

    proportionateValues(sumDices) {
        // sumDices : 60 = x : 300 proporzione per trovare a quanto corrisponde, su una scala di 300px, che è l'altezza del container
        // il valore dei dati:
        // DETTO SEMPLICE: SE LA MIA SCALA GRADUATA VOGLIO CHE SIA DA 0 A 60 MA IN REALTÀ IN PIXEL QUELLA SCALA CORRISPONDE A 300PX,
        // TIRANDO I DATI E AVENDO COME RISULTATO AD ESEMPIO 9 COME FACCIO A PROPORZIONARE QUESTO 9 SU UNA SCALA CHE IN REALTÀ HA LUNGHEZZA 300PX ??
        // APPUNTO CON UNA PROPORZIONE!

        // sumDices : 60 = x : 300

        // noinspection UnnecessaryLocalVariableJS
        let proportionatedValue = sumDices * this.ambientManager.getTotalContainerHeight() / this.ambientManager.getPointsGoal()
        return proportionatedValue
    }

    IsAnyDiceValueOne(d1Val, d2Val) {
        return d1Val === 1 || d2Val === 1
    }
}