import Phaser from "phaser";

const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class SaveScore extends Phaser.Scene {

    punteggioFinale = null;
    livelloRaggiunto = null;
    tempoDiGioco = null;
    canvasWidth = null;
    canvasHeight = null;
    uniqueVal = Math.floor(Math.random() * 9999999999);
    gameName = null

    constructor() {
        super("savescore");
    }

    init(data) {
        this.punteggioFinale = data.punteggioFinale;
        this.livelloRaggiunto = data.livello;
        this.tempoDiGioco = data.tempoGioco;
        this.canvasHeight = data.canvasHeight;
        this.canvasWidth = data.canvasWidth
        this.gameName = data.gameName
    }

    preload() {
        // Nessun plugin qui: RexUI è già configurato in index.js
    }

    checkIfNotNull(val) {
        return val ? val : "Non disponibile"
    }

    create() {

        console.log(this.canvasWidth, this.canvasHeight)

        var print = this.add.text(0, 0, '').setDepth(1);

        var style = {

            val: {
                punteggioFinale: this.checkIfNotNull(this.punteggioFinale),
                tempoDiGioco: this.checkIfNotNull(this.tempoDiGioco),
                livelloRaggiunto: this.checkIfNotNull(this.livelloRaggiunto),
                uniqueVal: this.checkIfNotNull(this.uniqueVal),
                gameName: this.checkIfNotNull(this.gameName)
            },

            x: this.canvasWidth / 2, y: this.canvasHeight / 2,
          
            space: {
                left: 20, right: 20, top: 20, bottom: 20,
                item: 20,
                firstName: 20,
            },

            background: {strokeColor: COLOR_LIGHT, strokeWidth: 4, radius: 10,},

            title: {
                text: {fontSize: 24}
            },


            nameInput: {
                width: 150,
                background: {
                    color: COLOR_DARK,
                    'focus.color': COLOR_MAIN,
                },
                style: {
                    backgroundBottomY: 4,
                    backgroundHeight: 18,
                    'cursor.color': 'black',
                    'cursor.backgroundColor': 'white',
                },
            },

            button: {
                space: {left: 5, right: 5, top: 5, bottom: 5},

                background: {
                    color: COLOR_DARK,
                    radius: 5,
                    'hover.strokeColor': 0xffffff,
                },

                text: {fontSize: 20},
            }
        }
        this.rexUI.add.nameInputDialog(style)
            .resetDisplayContent({
                title: 'My name is...',
                button: 'OK',

                firstName: 'First Name',
                lastName: 'Last Name',
            })
            .layout()
            .modalPromise()
            .then(function (data) {

                    const date = new Date();
                    const dateCom = date.toLocaleDateString('it-IT')
                    const hour = date.getHours()
                    const min = date.getMinutes()

                    print.text = `\
                GAMENAME: ${style.val.gameName}    
                FIRSTNAME: ${data.firstName}
                LASTNAME: ${data.lastName}
                LEVEL: ${style.val.livelloRaggiunto}
                FINAL SCORE: ${style.val.punteggioFinale}
                TIME: ${style.val.tempoDiGioco}
                DATE: ${dateCom + " " + hour + ":" + min}
                --------------------------------------------------------------------
                `


                    localStorage.setItem(
                        ` PHASER-${style.val.gameName}-${data.firstName} ${data.lastName}-${style.val.uniqueVal}`,
                        `GAMENAME: ${style.val.gameName} , FIRSTNAME: ${data.firstName} , LASTNAME: ${data.lastName} , LEVEL: ${style.val.livelloRaggiunto} , FINAL SCORE: ${style.val.punteggioFinale} , TIME: ${style.val.tempoDiGioco} , DATE: ${dateCom + " " + hour + ":" + min}`
                    )
                }
            ).then(() => {
            this.time.delayedCall(3000, () => {
                this.scene.stop("savescore");
                this.scene.start("startmenu", {
                    canvasWidth: this.canvasWidth,
                    canvasHeight: this.canvasHeight
                })
            })
        })

    }

    update() {
    }


}
