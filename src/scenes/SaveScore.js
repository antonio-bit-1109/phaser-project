const COLOR_PRIMARY = 0x4e342e;
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
        this.load.plugin('rexinputtextplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js',
            true);
    }

    create() {
        const printText = this.add.text(400, 200, '', {
            fontSize: '12px',
        }).setOrigin(0.5).setFixedSize(100, 100);
        const inputText = this.add.rexInputText(400, 400, 10, 10, {
            type: 'textarea',
            text: 'hello world',
            fontSize: '12px',
        })
            .resize(100, 100)
            .setOrigin(0.5)
            .on('textchange', function (inputText) {
                printText.text = inputText.text;
            })
            .on('focus', function (inputText) {
                console.log('On focus');
            })
            .on('blur', function (inputText) {
                console.log('On blur');
            })
            .on('click', function (inputText) {
                console.log('On click');
            })
            .on('dblclick', function (inputText) {
                console.log('On dblclick');
            })

        this.input.on('pointerdown', function () {
            inputText.setBlur();
            console.log('pointerdown outside');
        })

        inputText.on('keydown', function (inputText, e) {
            if ((inputText.inputType !== 'textarea') && (e.key === 'Enter')) {
                inputText.setBlur();
            }
        })

        printText.text = inputText.text;

        this.add.text(0, 580, 'Click below text to edit it');
    }

    update() {
    }
}