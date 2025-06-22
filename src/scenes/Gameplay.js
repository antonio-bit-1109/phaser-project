export class Gameplay extends Phaser.Scene {

    VELOCITY = 200;
    BOMB_DEFAULT_WIDTH = 100;
    BOMB_DEFAULT_HEIGHT = 100;
    bomb = null;
    grassTerrain = null;
    dude = null;
    cursors = null;
    explosion = null;
    canvasWidth = null;
    canvasHeight = null;

    // il constructor serve per dare un nome a questa classe, se la devo richiamare da qualche parte questo sarà il nome
    constructor() {
        super('gameplay');
    }

    // si avvia prima di preload e serve per prendere dati dalla scena precedente o dall index
    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight
    }

    preload() {
        // key dell immagine e source da dove prenderla
        this.load.image('nature', 'assets/nature.jpg');
        this.load.image('bomb', "assets/bomb_gpt.png");
        this.load.image('grass', 'assets/grass_no_bg.png');
        // carico l immagine di frame come spritesheet in modo da poter utilizzare ogni singolo frame ad un determinato evento
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameHeight: 48,
            frameWidth: 32
        })

        // carico l'immagine di animazione dello scoppio della bomba
        this.load.spritesheet('explosion', "assets/explosion.png", {
            frameHeight: 232,
            frameWidth: 320
        })

        // carico un suono di un esplosione
        this.load.audio('expl_sound', 'assets/sounds/expl_sound.mp3')
    }

    create() {
        // inizializzo la variabile 'cursor' come variabile che recepisce gli eventi delle frecce direzionali
        // Dopo questa riga, cursors sarà un oggetto così:
        // {
        //     up: Key,
        //         down: Key,
        //     left: Key,
        //     right: Key,
        //     shift: Key,
        //     space: Key
        // }
        this.cursors = this.input.keyboard.createCursorKeys();


        // x
        // y
        // chiave dell oggetto precaricato che si vuole mostrare
        // l'immagine inserita di DEFAULT fa riferimento al punto centrale dell immagine , le coordinate che vengono inserite
        // in questo metodo prendono il centro dell immagine e lo inseriscono sulla x e y specificate nel metodo, sulla canva
        // (specificare es.   this.add.image(0, 0, 'nature');
        // sichifica prendere l 'immagine precaricata 'nature' e inserirla al punto 0,0 dela canvas

        // utilizzare setOrigin(x,y) sto specificando che il punto dell immagine preso come riferimento
        // non è più il centro dell immagine besì quello che sto specificando nel metodo

        // abbiamo detto di DEFAULT l'origin dell immagine che si sta inserendo è x:0,5 y:0,5 quindi al centro dell immagine
        // this.add.image(0,0, 'nature').setOrigin(0,0);
        this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "nature").setOrigin(0.5, 0.5)

        // per dre fisica all oggetto bisogna chiamare l oggetto physics e aggiungerci lo sprite
        // in questo modo avrà accessoad oggetto 'fisica' sul quale sarà possibile applicare della fisica sul corpo
        this.bomb = this.physics.add.sprite(this.canvasWidth / 10, this.canvasHeight / 2, 'bomb').setDepth(2)
        this.bomb.displayHeight = this.BOMB_DEFAULT_HEIGHT;
        this.bomb.displayWidth = this.BOMB_DEFAULT_WIDTH
        // ogni secondo questo body scende sulla y di 200 px (accellerazione che subisce dalla gravita in pratica )
        // bird.body.gravity.y = 0;
        // bird.body.allowGravity = false;

        // velocità sull asse y ( velocità costante senza accellerazione imposta dalla gravita )
        this.bomb.body.velocity.y = this.VELOCITY;
        this.grassTerrain = this.physics.add.staticSprite(0, this.canvasHeight - 80, 'grass').setOrigin(0, 0).setDepth(0)

        this.dude = this.physics.add.sprite(this.canvasWidth / 2, this.canvasHeight - 80, 'dude')
        this.dude.displayWidth = 40;
        this.dude.displayHeight = 60;
        this.createAnimationDude(this)
        this.createAnimationExplosion(this)
    }

    // eseguita ogni 16ms , accetta dei parametri
// delta:tempo passato dall ultimavolta che la funzione è stata chiamata (ogni 16ms )
// time: tempo totale in cui la func viene chiamata
    update(time, delta) {


        if (this.bomb && Math.round(this.bomb.body.y) > Math.round(this.grassTerrain.body.y + 60)) {
            this.explosion = this.add.sprite(this.bomb.x, this.bomb.y - 20, 'explosion');
            this.explosion.setScale(0.5);
            this.explosion.anims.play('boom');
            this.sound.play('expl_sound');
            this.bomb.destroy();
            this.bomb = null;

            this.explosion.on('animationcomplete', () => {
                this.explosion.destroy();
                this.bomb = this.physics.add.sprite(Math.random() * this.canvasWidth, 0, 'bomb').setDepth(2);
                this.bomb.displayHeight = 100;
                this.bomb.displayWidth = 100;
                this.bomb.body.velocity.y = this.VELOCITY;
            });
        }


        // gestione dell animazione del dude
        this.dude.setVelocity(0);

        if (this.cursors.left.isDown) {
            // il tasto FRECCIA SINISTRA è premuto
            this.dude.anims.play('left', true)
            this.dude.setVelocityX(-300);
        }

        if (this.cursors.right.isDown) {
            // il tasto FRECCIA DESTRA è premuto
            this.dude.setVelocityX(300);
            this.dude.anims.play('right', true)
        }
        if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
            this.dude.anims.play('stand')
        }


    }

    // creazione dell animazione di esplosione
    createAnimationExplosion() {
        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 24}),
            frameRate: 15,
            repeat: 0
        })
    }

//funzione per la creazione delle animazioni associate al dude;
    createAnimationDude() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1 // quante volte ripetuta animazione: -1 inifinito , n : n volte , 0: una sola volta
        })

        this.anims.create({
            key: 'stand',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }


}