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


        // in base a chi sta effettuando il turno
        // cambiano la posizione dei dadi e del testo sullo schermo
        if (this.turnManager.getIsDudeTurn()) {
            this.ambientManager.updateNotificationPosition(this.canvasWidth / 7.5, this.canvasHeight / 10)
            this.dicesmanager.updateD1Position(this.canvasWidth / 4, this.canvasHeight / 4)
            this.dicesmanager.updateD2Position(this.canvasWidth / 4, this.canvasHeight / 2)
        }

        if (!this.turnManager.getIsDudeTurn()) {
            this.ambientManager.updateNotificationPosition(this.canvasWidth / 1.9, this.canvasHeight / 10)
            this.dicesmanager.updateD1Position(this.canvasWidth / 1.5, this.canvasHeight / 4)
            this.dicesmanager.updateD2Position(this.canvasWidth / 1.5, this.canvasHeight / 2)
        }


        // se il valore dei dadi nella classe principale è uguale al valore dei dati in diceManager,
        // non c'è stato alcun nuovo lancio.
        // tutto fermo.
        if (this.d1_currVal === this.dicesmanager.getD1Value() && this.d2_currVal === this.dicesmanager.getD2Value()) return

        // vicevera se i dadi sono stati lanciati
        // e c'è una variazione tra i valori dentro dicemangaer e pigs allora ce stato un nuovo lancio
        this.d1_currVal = this.dicesmanager.getD1Value()
        this.d2_currVal = this.dicesmanager.getD2Value()

        console.log("registrato variazione del valore dei dadi")

        // se entrambi i dadi sono lo stesso numero ill numero uscito viene raddoppiato


        // se uno dei valori lanciati dal dado è 1 il turno del player attuale finisce e resetta a zero la propria barra del punteggio
        if (this.IsAnyDiceValueOne(this.d1_currVal, this.d2_currVal)) {

            if (this.turnManager.getIsDudeTurn()) {
                this.ambientManager.updateVolume(this.ambientManager.getDudeContainerVolume(), 0)
                this.dicesmanager.setCurrentCountDude(0)
                this.dicesmanager.getCurrentCountDudeRef().setText("0")
            }

            if (!this.turnManager.getIsDudeTurn()) {
                this.ambientManager.updateVolume(this.ambientManager.getBossContainerVolume(), 0)
                this.dicesmanager.setCurrentCountBoss(0)
                this.dicesmanager.getCurrentCountBossRef().setText("0")
            }


            // this.isDudeTurn = !this.isDudeTurn
            // this.turnManager.setIsDudeTurn(!this.dude)
            this.turnManager.invertTurn()
            return

            // se i dadi sono lo stesso valore raddoppio il loro valore sommato
        } else if (this.d1_currVal === this.d2_currVal) {

            let doubled = (this.d1_currVal + this.d2_currVal) * 2

            // se i due dati sono 1 e 1 allora il valore applicato al lancio è 25
            if (this.d1_currVal === 1 && this.d2_currVal === 1) {
                doubled = this.ambientManager.getDoubleOneThrow();
            }

            if (this.turnManager.getIsDudeTurn()) {
                this.ambientManager.updateVolume(
                    this.ambientManager.getDudeContainerVolume(),
                    this.proportionateValues(doubled)
                )
                this.dicesmanager.setCurrentCountDude(this.dicesmanager.updateValue(this.dicesmanager.getCurrentCountDude(), doubled))
                this.dicesmanager.getCurrentCountDudeRef().setText(this.dicesmanager.getCurrentCountDude().toString())
            }

            if (!this.turnManager.getIsDudeTurn()) {
                this.ambientManager.updateVolume(
                    this.ambientManager.getBossContainerVolume(),
                    this.proportionateValues(doubled)
                )
                this.dicesmanager.setCurrentCountBoss(this.dicesmanager.updateValue(this.dicesmanager.getCurrentCountBoss(), doubled))
                this.dicesmanager.getCurrentCountBossRef().setText(this.dicesmanager.getCurrentCountBoss().toString())
            }
            return
        }

        let sumDices = this.d1_currVal + this.d2_currVal

        if (this.turnManager.getIsDudeTurn()) {
            this.ambientManager.updateVolume(this.ambientManager.getDudeContainerVolume(), this.proportionateValues(sumDices))
            this.dicesmanager.setCurrentCountDude(this.dicesmanager.updateValue(this.dicesmanager.getCurrentCountDude(), sumDices))
            this.dicesmanager.getCurrentCountDudeRef().setText(this.dicesmanager.getCurrentCountDude().toString())
        }

        if (!this.turnManager.getIsDudeTurn()) {
            this.ambientManager.updateVolume(this.ambientManager.getBossContainerVolume(), this.proportionateValues(sumDices))
            this.dicesmanager.setCurrentCountBoss(this.dicesmanager.updateValue(this.dicesmanager.getCurrentCountBoss(), sumDices))
            this.dicesmanager.getCurrentCountBossRef().setText(this.dicesmanager.getCurrentCountBoss().toString())
        }
        
    }

    proportionateValues(sumDices) {
        console.log(sumDices, "somma dei dati al lancio, prima di essere proporzionati ai 300px della barra. ")
        // sumDices : 100 = x : 300 proporzione per trovare a quanto corrisponde, su una scala di 300px, che è l'altezza del container
        // il valore dei dati:
        // DETTO SEMPLICE: SE LA MIA SCALA GRADUATA VOGLIO CHE SIA DA 0 A 60 MA IN REALTÀ IN PIXEL QUELLA SCALA CORRISPONDE A 300PX,
        // TIRANDO I DATI E AVENDO COME RISULTATO AD ESEMPIO 9 COME FACCIO A PROPORZIONARE QUESTO 9 SU UNA SCALA CHE IN REALTÀ HA LUNGHEZZA 300PX ??
        // APPUNTO CON UNA PROPORZIONE!

        // sumDices : 100 = x : 300

        // noinspection UnnecessaryLocalVariableJS
        let proportionatedValue = sumDices * this.ambientManager.getTotalContainerHeight() / this.ambientManager.getPointsGoal()
        return proportionatedValue
    }

    IsAnyDiceValueOne(d1Val, d2Val) {
        return d1Val === 1 || d2Val === 1
    }
}