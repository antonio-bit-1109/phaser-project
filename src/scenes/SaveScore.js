import Phaser from "phaser";

const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class SaveScore extends Phaser.Scene {

    punteggioFinale = null;
    livelloRaggiunto = null;
    tempoDiGioco = null;

    constructor() {
        super("savescore");
    }

    init(data) {
        this.punteggioFinale = data.punteggioFinale;
        this.livelloRaggiunto = data.livello;
        this.tempoDiGioco = data.tempoGioco;
    }

    preload() {
        // 🔹 Nessun plugin qui: RexUI è già configurato in index.js
    }

    create() {
        var print = this.add.text(0, 0, '').setDepth(1);

        var style = {
            x: 400, y: 300,
            // width: 400,
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
        var dialog = this.rexUI.add.nameInputDialog(style)
            .resetDisplayContent({
                title: 'My name is...',
                button: 'OK',

                firstName: 'BBB',
                lastName: 'AAA',
            })
            .layout()
            .modalPromise()
            .then(function (data) {
                print.text = `\
First name: ${data.firstName}
Last name : ${data.lastName}
`
            })
    }

    update() {
    }

}
