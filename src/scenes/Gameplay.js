export class Gameplay extends Phaser.Scene {

    VELOCITY = 200;
    BOMB_DEFAULT_WIDTH = 100;
    BOMB_DEFAULT_HEIGHT = 100;
    grassTerrain = null;
    dude = null;
    shooting_dude = null;
    cursors = null;
    explosion = null;
    canvasWidth = null;
    canvasHeight = null;
    hp = 100;
    maxHp = 100;
    hpBar = null;
    hpBackground = null;
    punteggio = 10;
    timer = 0;
    punteggioRef = null;
    livello = 1;
    livelloRef = null;
    livelloChanged = false;
    bombsGroup = null;
    timerEventSpawnBomb = null;
    DEFAULT_GENERATION_BOMB = 'default'
    DOUBLE_GENERATION_BOMB = 'double';
    TRIPLE_GENERATION_BOMB = 'triple';
    QUADRUPLE_GENERATION_BOMB = 'quadruple'
    bombGenerationType = this.DEFAULT_GENERATION_BOMB;
    bullet = null;
    explosion_bullet_bomb = null;
    boss = null;
    movingRight = false
    hpBackground_boss = null;
    hpBoss_bar = null
    hpBoss_number = 100;
    shuriken_boss = null;
    boss_laserBeam_1 = null;
    boss_laserBeam_2 = null
    shuriken_count = 0;
    random_x_position_boss = null;

    // il constructor serve per dare un nome a questa classe, se la devo richiamare da qualche parte questo sarà il nome
    constructor() {
        super('gameplay');
    }

    // si avvia prima di preload e serve per prendere dati dalla scena precedente o dall index
    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight

        this.hp = 100;
        this.maxHp = 100;
        this.punteggio = 0;
        this.timer = 0;
        this.livello = 0;
        this.livelloChanged = false;
        this.bombGenerationType = this.DEFAULT_GENERATION_BOMB;
        this.bullet = null
    }

    preload() {
        // key dell immagine e source da dove prenderla
        this.load.image('nature', 'assets/sky.png');
        this.load.image('bomb', "assets/bomb_gpt.png");
        this.load.image('grass', 'assets/grass_no_bg.png');
        // carico l immagine di frame come spritesheet in modo da poter utilizzare ogni singolo frame ad un determinato evento
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameHeight: 48,
            frameWidth: 32
        })

        //carico spritesheet da cui prendo animazione dello sparo
        this.load.spritesheet('dude-shooting', "assets/dude_2.0.png", {
            frameHeight: 204,
            frameWidth: 122
        })

        // carico l'immagine di animazione dello scoppio della bomba
        this.load.spritesheet('explosion', "assets/explosion.png", {
            frameHeight: 115,
            frameWidth: 160
        })

        // carico lo spritesheet dell esplosione causata dal contatto proiettile e bomba
        this.load.spritesheet('bullet_bomb_explosion', "assets/explosion_sprite.png", {
            frameHeight: 145,
            frameWidth: 120
        })

        // carico un suono di un esplosione
        this.load.audio('expl_sound', 'assets/sounds/expl_sound.mp3')
        this.load.audio("gameMusic", "assets/sounds/gameMusic.mp3")
        this.load.audio('expl_bomb_bullet', "assets/sounds/explosion_bullet_bomb.mp3")
        this.load.audio('bossMusic', "assets/sounds/bossMusic.mp3")

        //carico immagine proiettile
        this.load.image('bullet', "assets/bullet.png")

        //caricamento boss nemico
        this.load.spritesheet('bossSpriteSheet', "assets/boss.png", {
            frameWidth: 87, frameHeight: 110
        })

        // caricamento shuriken - boss's attack
        this.load.spritesheet('shuriken_boss', 'assets/shuriken_boss.png', {
            frameWidth: 15.5,
            frameHeight: 17
        })

        // carico immagine del raggio laser del boss
        this.load.image('laserBeam', "assets/laserBeam.png");
    }


    // mostro il punteggio nella canvas la priam volta
    showPunteggio() {
        this.punteggioRef = this.add.text(
            this.canvasWidth / 1.3,
            this.canvasHeight / 11,
            `punteggio: ${this.punteggio} `,
            {
                fontSize: '30px',
                color: '#ff0000',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0.5).setDepth(6)
    }

    handleBombGeneration() {
        switch (this.bombGenerationType) {
            case this.DEFAULT_GENERATION_BOMB:
                this.singleBombGen()
                break;
            case this.DOUBLE_GENERATION_BOMB:
                this.multipleBombGen(2)
                break;
            case this.TRIPLE_GENERATION_BOMB:
                this.multipleBombGen(3)
                break;
            case this.QUADRUPLE_GENERATION_BOMB:
                this.multipleBombGen(4)
                break
        }
    }

    singleBombGen() {
        const bomb = this.bombsGroup.create(
            Math.random() * this.canvasWidth,
            0,
            'bomb'
        );


        bomb.setDisplaySize(this.BOMB_DEFAULT_WIDTH, this.BOMB_DEFAULT_HEIGHT);
        bomb.setVelocityY(this.VELOCITY);        // imposta la velocità iniziale sull'asse Y
        bomb.setGravityY(10);                    // applichi una gravità costante
        bomb.setBounce(0);
    }

    multipleBombGen(count) {
        for (let i = 0; i < count; i++) {
            const bomb = this.bombsGroup.create(
                Math.random() * this.canvasWidth,
                0,
                'bomb'
            );


            bomb.setDisplaySize(this.BOMB_DEFAULT_WIDTH, this.BOMB_DEFAULT_HEIGHT);
            bomb.setVelocityY(this.VELOCITY);        // imposta la velocità iniziale sull'asse Y
            bomb.setGravityY(10);                    // applichi una gravità costante
            bomb.setBounce(0);
        }
    }

    create() {


        //musica principale
        this.sound.play("gameMusic", {
            loop: true
        })


        this.bombsGroup = this.physics.add.group()

        // creo un gruppo nel quale inserire gli sprite che saranno attacchi del boss
        this.shuriken_boss = this.physics.add.group();

        // creo un loop per popolare questa variabile 'gruppo' -- cioè una variabile array tipo
        this.timerEventSpawnBomb = this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => this.handleBombGeneration()
        })

        // visualizzo il punteggio della partita
        this.showPunteggio()
        this.showLivello()

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
        // -------------------------------------------------------------------------------------------------------------------------------
        // this.bomb = this.physics.add.sprite(this.canvasWidth / 10, this.canvasHeight / 2, 'bomb').setDepth(2)
        // this.bomb.displayHeight = this.BOMB_DEFAULT_HEIGHT;
        // this.bomb.displayWidth = this.BOMB_DEFAULT_WIDTH
        // -------------------------------------------------------------------------------------------------------------------------------

        // ogni secondo questo body scende sulla y di 200 px (accellerazione che subisce dalla gravita in pratica )
        // bird.body.gravity.y = 0;
        // bird.body.allowGravity = false;

        // // velocità sull asse y ( velocità costante senza accellerazione imposta dalla gravita )
        // this.bomb.body.velocity.y = this.VELOCITY;
        this.grassTerrain = this.physics.add.staticSprite(0, this.canvasHeight - 80, 'grass').setOrigin(0, 0).setDepth(0)


        // mostra sprite base del dude
        this.dude = this.physics.add.sprite(this.canvasWidth / 2, this.canvasHeight - 80, 'dude')
        this.dude.displayWidth = 40;
        this.dude.displayHeight = 60;

        // carica sprite contenente il dude che spara
        this.shooting_dude = this.physics.add.sprite(this.dude.body.x, this.dude.body.y, 'shooting-dude')
        this.shooting_dude.displayWidth = 12;
        this.shooting_dude.displayHeight = 12;
        this.shooting_dude.setVisible(false); // nascosto di default

        // inizializzo animazione del dude
        this.createAnimationDude(this)
        // inizializzo animazione dell esplosione della bomba
        this.createAnimationExplosion(this)
        // inizializzo animazione del contatto bullet e bomba
        this.createAnimationExplosionBulletBomb()
        // inizializzo la funzione per creare l animazione che poi servirà a far muovere il boss
        this.createAnimationBossMovements()

        // inizilizz animazione rotazione shuriken boss
        this.createAnimationRotationShuriken();

        // crea background hp bar
        this.createHpbackground()

        // crea vita vera e propria
        this.hpBar = this.add.graphics();
        this.updateHpBar()
    }


    showLivello() {
        this.livelloRef = this.add.text(
            this.canvasWidth / 2,
            this.canvasHeight / 11,
            `Livello: ${this.livello} `,
            {
                fontSize: '20px',
                color: '#ff0000',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0.5).setDepth(6)
    }

    createHpbackground() {
        // creo lo sfondo della barra della vita (background)
        this.hpBackground = this.add.graphics() // disegnare forme geometriche in phaser
        this.hpBackground.fillStyle(0xFF0000, 1); // red
        this.hpBackground.fillRect(20, 20, 200, 20); // x, y, width, height -- dimensioni del graphic

    }


    // controlla se il bullet è uscito dalla canvas sull asse y
    checkIfBulletOutOfCanvas() {
        if (this.bullet && this.bullet.body.y <= 0) {
            this.bullet = null
            console.log("bullet uscita dall asse y ")
        }
    }

    // controllo se le hitbox di bomba e bullet si toccano
    checkIfCollide_bullet_bomb(bomb) {
        if (bomb && this.bullet && this.physics.overlap(bomb, this.bullet)) {
            this.sound.play('expl_bomb_bullet', {
                volume: 5
            });
            return true;
        }
    }

    checkCollision_general(p1, p2) {
        if (p1 && p2 && this.physics.overlap(p1, p2)) {
            return true;
        }
    }


    // movimento oscillatorio del bbss dx - sn
    moveBoss() {

        if (this.boss.x >= 0 && this.movingRight) {
            this.boss.setVelocityX(150)
        }

        if (this.boss.x >= this.canvasWidth - 100) {
            this.boss.setVelocityX(-150);
            this.movingRight = false;
        }

        if (this.boss.x === 100) {
            this.movingRight = true;
        }

        // ogni volta che la posizione x è un multiplo di 100 il boss lancia un attacco
        if (this.boss.x % 100 === 0 && this.shuriken_count < 15) {
            this.bossAttack1()
            console.log("boss lancia shuriken")
        }

        if (this.shuriken_count >= 15) {
            this.bossAttack2()
        }

    }

    bossAttack2() {

        if (this.random_x_position_boss === null) {
            this.random_x_position_boss = Math.random() * this.canvasWidth
        }

        // sposto il boss ad una posizione x
        // casuale in modo graduale evitaando il teletrasporto
        this.tweens.add({
            targets: this.boss,
            x: this.random_x_position_boss,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.fireLaserBeam()
            }
        });


    }

    fireLaserBeam() {
        // Qui puoi fare qualcosa quando il boss arriva alla posizione
        console.log("Boss arrivato alla posizione!");
        // Ad esempio sparare il laser
        // Creo un rettangolo che rappresenta il laser dal boss fino a terra
        const laserWidth = 10;
        const laserHeight = this.canvasHeight - this.boss.y;

        this.boss_laserBeam_1 = this.add.rectangle(
            this.boss.x - 40,
            this.boss.y + (laserHeight / 2), // centro del rettangolo
            laserWidth,
            laserHeight,
            0xff0000, // colore rosso
            0.8 // trasparenza
        );

        this.boss_laserBeam_2 = this.add.rectangle(
            this.boss.x + 30,
            this.boss.y + (laserHeight / 2), // centro del rettangolo
            laserWidth,
            laserHeight,
            0xff0000, // colore rosso
            0.8 // trasparenza
        );

        // Aggiungi fisica per collision detection
        this.physics.add.existing(this.boss_laserBeam_1);
        this.physics.add.existing(this.boss_laserBeam_2);

    }

    bossAttack1() {
        // Crea lo shuriken
        const shuriken = this.physics.add
            .sprite(this.boss.x, this.boss.y, 'shuriken_boss')
            .setScale(2);

        // Aggiungi al gruppo
        this.shuriken_boss.add(shuriken);

        // Imposta velocità DOPO l'aggiunta al gruppo
        shuriken.setVelocityY(100);
        shuriken.body.allowGravity = false; // Evita che la gravità interferisca
        shuriken.anims.play('shuriken');
        this.shuriken_count++
    }


    // eseguita ogni 16ms , accetta dei parametri
// delta:tempo passato dall ultimavolta che la funzione è stata chiamata (ogni 16ms )
// time: tempo totale in cui la func viene chiamata
    update(time, delta) {

        this.updatePunteggio(time)
        this.updateLivello()

        // se la vita scende a zero avvio la scena di gameover
        // interruzione della scena corrente
        if (this.hp <= 0) {
            this.scene.stop('gameplay');
            this.bombsGroup = null;
            this.timerEventSpawnBomb = null
            this.sound.stopAll();
            this.scene.start('gameover', {
                canvasWidth: this.canvasWidth,
                canvasHeigth: this.canvasHeight,
                punteggioFinale: this.punteggio,
                livello: this.livello
            })
        }


        // se il boss esiste, gestione dei movimenti
        this.boss && this.moveBoss()
        this.boss && this.updateBossLife()


        // controllo le collisioni tra dude e gruppo delle bombe
        this.bombsGroup && this.bombsGroup.children.iterate((bomb) => {

            if (!bomb) return

            if (this.checkIfCollide_bullet_bomb(bomb)) {
                // nel punto dove bullet e bomb si toccano inserisci l animazione di una esplosione
                bomb.destroy()
                this.punteggio += 10;
                this.explosion_bullet_bomb = this.physics.add.sprite(bomb.x, bomb.y, 'bullet_bomb_explosion')

                this.explosion_bullet_bomb.setGravity(false)
                this.explosion_bullet_bomb.anims.play('boom2')
                this.bullet.destroy();
                this.bullet = null;
                this.explosion_bullet_bomb.on('animationcomplete', () => {
                    this.explosion_bullet_bomb.destroy()
                });
                return;
                //


            }

            if (bomb && Math.round(bomb.body.y) > Math.round(this.grassTerrain.body.y + 60)) {
                // sprite con interazioni fisiche
                this.explosion = this.physics.add.sprite(bomb.x, bomb.y - 20, 'explosion')

                this.explosion.anims.play('boom');
                this.sound.play('expl_sound');
                bomb.destroy()
                this.handle_Dude_Explosion_overlap()
                this.explosion.on('animationcomplete', () => {
                    this.explosion.destroy();
                });
            }

        })


        // controllo collisioni tra dude e gruppo degli shuriken
        this.shuriken_boss && this.shuriken_boss.children.iterate((shur) => {

            // per ogni shuriken controllo collisione con dude
            // se avviene sottraggo vita
            if (this.checkCollision_general(shur, this.dude)) {
                this.hp -= 10
                shur.destroy()
            }

        })


        // controllo collisioni tra bullet e boss se questi esistono
        if (this.bullet && this.boss && this.checkCollision_general(this.bullet, this.boss)) {
            this.hpBoss_number -= 10;
            this.bullet.destroy()
            this.bullet = null;
        }

        if (this.boss && this.hpBoss_number === 0) {
            this.boss.destroy()
            this.boss = null
        }


        // gestione dell animazione del dude
        this.dude.setVelocity(0);
        // this.dude.setVisible(true)

        if (this.cursors.left.isDown) {
            // il tasto FRECCIA SINISTRA è premuto
            this.dude.setVisible(true)
            this.shooting_dude.setVisible(false)
            this.dude.anims.play('left', true)
            this.dude.setVelocityX(-300);
        }

        if (this.cursors.right.isDown) {
            // il tasto FRECCIA DESTRA è premuto
            this.dude.setVisible(true)
            this.shooting_dude.setVisible(false)
            this.dude.setVelocityX(300);
            this.dude.anims.play('right', true)
        }
        if (this.cursors.up.isDown) {

            if (this.cursors.right.isDown) return;
            if (this.cursors.left.isDown) return;

            this.dude.setVisible(false)

            if (this.bullet === null) {
                this.bullet = this.physics.add.sprite(
                    this.dude.x,
                    this.dude.y - 30,
                    'bullet'
                )
                    .setAngle(90)
                    .setScale(0.3) // Riduce anche il render grafico
                    .setOrigin(0.5);

                // Calcola nuova dimensione hitbox in base alla scala e all’immagine originale
                const width = this.bullet.displayWidth;
                const height = this.bullet.displayHeight;

                this.bullet.body.setSize(width, height);
                this.bullet.body.setOffset((this.bullet.width - width) / 2, (this.bullet.height - height) / 2);
                this.bullet.setVelocity(0, -250)
            }


            this.shooting_dude.setVisible(true)
            this.shooting_dude.setPosition(this.dude.x, this.dude.y - 9);
            this.shooting_dude.anims.play('shoot', true);

        }
        if (!this.cursors.right.isDown && !this.cursors.left.isDown && !this.cursors.up.isDown) {
            this.dude.setVisible(true)
            this.shooting_dude.setVisible(false)
            this.dude.anims.play('stand')
        }


        this.updateHpBar()
        this.checkIfBulletOutOfCanvas()

    }

    updateLivello() {
        if (!this.livelloChanged && this.punteggio % 200 === 0) {
            this.livelloChanged = true;
            this.livello++
            this.livelloRef.setText(`Livello: ${this.livello}`)
            setTimeout(() => {
                this.livelloChanged = false;
            }, 1000)

            // riduco il tempo di delay per lo spawn di una bomba all aumentare del livello
            if (this.timerEventSpawnBomb.delay !== 1000) {
                this.timerEventSpawnBomb.delay -= 1000;
                console.log("timer spwan bomba diminuito", this.timerEventSpawnBomb.delay)
            }

            if (this.livello === 3) {
                this.bombGenerationType = this.DOUBLE_GENERATION_BOMB
                console.log("passato a modalità spawn bombe doppio")
            }

            if (this.livello === 5) {
                this.bombGenerationType = this.TRIPLE_GENERATION_BOMB
                console.log("passato alla modalità spawn bombe triplo")
            }

            if (this.livello === 9) {
                this.bombGenerationType = this.QUADRUPLE_GENERATION_BOMB
                console.log("passato alla modalità spawn bombe quadruplo")
            }

            if (this.livello === 1) {
                // metto in pausa la generazione di bombe
                this.timerEventSpawnBomb.paused = true;
                // interrompo musica di base
                this.sound.get('gameMusic').stop();

                // inizializzo musica boss figth
                this.sound.play('bossMusic')

                // genero il boss
                this.generateBoss()
            }
        }
    }


    // informazioni per generare il boss
    generateBoss() {
        this.boss = this.physics.add.sprite(this.canvasWidth / 8, this.canvasHeight / 6, 'bossSpriteSheet')
        this.createBossHp_Background()
        this.boss.anims.play('bossAnim')
        // variabile usate per lo spostamento iniziale del boss
        this.movingRight = true;
        this.hpBoss_bar = this.add.graphics()
    }

    createBossHp_Background() {
        // creo lo sfondo della barra della vita (background)
        this.hpBackground_boss = this.add.graphics() // disegnare forme geometriche in phaser
        this.hpBackground_boss.fillStyle(0x808080, 1); // grigio medio
        this.hpBackground_boss.fillRect(this.canvasWidth - 250, 20, 200, 20); // x, y, width, height -- dimensioni del graphic

    }

    updateBossLife() {
        this.hpBoss_bar.clear()
        const hpPercent = this.hpBoss_number / this.maxHp

        // Disegno la barra verde in base alla percentuale
        this.hpBoss_bar.fillStyle(0x800080, 1); // viola
        this.hpBoss_bar.fillRect(this.canvasWidth - 250, 20, 200 * hpPercent, 20);
    }

    // aggiorno il valore del punteggio allo scorrere del tempo
    updatePunteggio(time) {
        const roundedTimer = Math.floor(time / 1000)

        if (this.timer !== 0 && this.timer !== roundedTimer) {
            this.punteggio += 10;
        }

        this.timer = roundedTimer

        this.punteggioRef.setText(`Punteggio: ${this.punteggio}`)
        // console.log(Math.floor(time / 1000))

    }


    // aggiornamento dello stato della vita
    updateHpBar() {

        this.hpBar.clear()
        const hpPercent = this.hp / this.maxHp

        // Disegno la barra verde in base alla percentuale
        this.hpBar.fillStyle(0x00ff00, 1); // verde
        this.hpBar.fillRect(20, 20, 200 * hpPercent, 20);
    }

    // controllare la collisione tra due elementi
    handle_Dude_Explosion_overlap() {
        if (this.dude && this.explosion && this.physics.overlap(this.dude, this.explosion)) {
            this.hp -= 20
            this.updateHpBar()
        }
    }

    // animazione di collisione tra bullet e bomb
    createAnimationExplosionBulletBomb() {
        this.anims.create({
            key: 'boom2',
            frames: this.anims.generateFrameNumbers('bullet_bomb_explosion', {start: 0, end: 7}),
            frameRate: 15,
            repeat: 0
        })
    }

    createAnimationBossMovements() {
        this.anims.create({
            key: 'bossAnim',
            frames: this.anims.generateFrameNumbers('bossSpriteSheet', {start: 0, end: 7}),
            frameRate: 20,
            repeat: -1
        })
    }

    // creazione dell animazione di esplosione
    createAnimationExplosion() {
        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 24}),
            frameRate: 30,
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

        this.anims.create({
            key: 'shoot',
            frames: [{key: 'dude-shooting', frame: 4}],
            frameRate: 20,
            repeat: 0
        })
    }

    createAnimationRotationShuriken() {
        this.anims.create({
            key: 'shuriken',
            frames: this.anims.generateFrameNumbers('shuriken_boss', {start: 0, end: 1}),
            frameRate: 8,
            repeat: -1 // infinito
        })
    }
}