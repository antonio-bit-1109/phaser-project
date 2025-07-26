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

    }

    create() {

    }

    update() {
    }


}