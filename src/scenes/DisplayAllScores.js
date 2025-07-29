const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class DisplayAllScores extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;


    constructor() {
        super('displayallscores');
    }

    init(data) {
        this.canvasHeight = data.canvasHeight
        this.canvasWidth = data.canvasWidth
    }

    preload() {
    }

    create() {
        const allScores = obtainValuesFromLocalStorage(); // qui ottieni tutta la stringa completa
        const dialog = CreateDialog(this, allScores, this.canvasWidth / 2, this.canvasHeight / 2)
            .layout()
            .modalPromise()
            .then(() => {
                this.scene.stop("displayallscores");
                this.scene.start("startmenu");
            });
    }

    update(time, delta) {

    }

}


var CreateDialog = function (scene, content, canvasWidth, canvasHeight) {
    return scene.rexUI.add.textArea({
        x: canvasWidth,
        y: canvasHeight,
        width: canvasWidth * 2,
        height: canvasHeight * 2,

        background: scene.rexUI.add.roundRectangle({
            color: COLOR_PRIMARY,
            radius: 20
        }),

        // text: scene.add.text(),
        text: scene.rexUI.add.BBCodeText(),
        // textMask: true,

        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
            thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
        },

        space: {
            left: 20, right: 20, top: 20, bottom: 20,

            text: 10,
            // text: {
            //     top: 20,
            //     bottom: 20,
            //     left: 20,
            //     right: 20,
            // },
            header: 20,
            footer: 20,
        },

        scroller: {
            // pointerOutRelease: false,
        },

        mouseWheelScroller: {
            focus: false,
            speed: 0.1
        },

        header: scene.rexUI.add.label({
            space: {left: 400, right: 400, top: 10, bottom: 10},

            orientation: 0,
            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
            text: scene.add.text(canvasWidth, canvasHeight, 'CLASSIFICA'),
        }),

        footer: scene.rexUI.add.label({
            space: {left: 10, right: 10, top: 10, bottom: 10},

            orientation: 0,
            background: scene.rexUI.add.roundRectangle({
                radius: 10,
                color: COLOR_DARK,
                strokeColor: COLOR_LIGHT
            }),
            text: scene.add.text(0, 0, 'Close'),
        }).onClick(function (button, gameObject, pointer, event) {
            gameObject.getTopmostSizer().modalClose();
        }),

        content: content,

        expand: {
            footer: false
        }
    })
}

function obtainValuesFromLocalStorage() {

    const map = new Map();

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        if (key.startsWith(" PHASER-BOMB-BURNER-")) {
            // style.val.scores.add([key, value])
            map.set(key, value)
        }
    }

    let result = ``

    map.forEach((value, key) => {

        result += `${value.concat("\n ------------------------------------------ ")} \n`
    })

    if (result === ``) {
        result = "Nessun salvataggio presente."
        return result;
    }

    return result.replaceAll(",", "\n");
}



