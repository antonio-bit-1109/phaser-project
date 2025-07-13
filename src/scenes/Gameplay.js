export class Gameplay extends Phaser.Scene {

    VELOCITY = 250;
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
    boss_tweens = null;
    boss_atk_2_done = false;
    hittedByLaserBeam = false;
    generatingHpBomb = false;
    hpBomb_sprite = null;
    alreadyAccessed = false;
    bossDoingAtk1 = false;
    bossDoingAtk2 = false;
    bossDoingAtk3 = false;
    bossDoingAtk4 = false;
    arrAtks = [this.bossDoingAtk1, this.bossDoingAtk2, this.bossDoingAtk3, this.bossDoingAtk4]
    bossExecutingAnAttack = false;
    layer = null;
    timeToBeatBoss = 60;  // time you have to kill the boss
    textTimerBoss = null
    timerDecrement = null;
    clicking_clock_sound = null
    thunderTempest = null
    bossShield = null;
    timerBossShield = null;
    playingThunderStorm = false

    attackUp_sprite = null;
    generatingAttackUpSprite = false
    caricatoreBullets = null;
    bulletsGroup = null
    dudePompato = false;
    removingBullet = false;
    superBullet = null
    textSuperBulletRemaining = null
    dudeCorazzato_sprite = null;
    dudePositionX = null;

    // il constructor serve per dare un nome a questa classe, se la devo richiamare da qualche parte questo sarà il nome
    constructor() {
        super('gameplay');
    }

    // si avvia prima di preload e serve per prendere dati dalla scena precedente o dall index
    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight
        this.VELOCITY = 250
        this.hp = 100;
        this.maxHp = 100;
        this.punteggio = 0;
        this.timer = 0;
        this.livello = 0;
        this.livelloChanged = false;
        this.bombGenerationType = this.DEFAULT_GENERATION_BOMB;
        this.bullet = null
        this.hpBoss_number = 100
        this.boss = null;
        this.thunderTempest = null;
        this.bossExecutingAnAttack = false;
        this.layer = null;
        this.timeToBeatBoss = 60;  // time you have to kill the boss
        this.textTimerBoss = null
        this.timerDecrement = null;
        this.clicking_clock_sound = null
        this.thunderTempest = null
        this.caricatoreBullets = null;
        this.textSuperBulletRemaining = null;
        this.dudePompato = false;
        this.removingBullet = false;
        this.dudeCorazzato_sprite = null;
    }


    preload() {
        // key dell immagine e source da dove prenderla
        this.load.image('nature', 'assets/sky.png');

        this.load.image('shield', "assets/shield.png")

        // spritesheet della bomba con rapida animazione
        this.load.spritesheet('bomb', "assets/bomb_spritesheet.png", {
            frameWidth: 32, frameHeight: 32
        });

        this.load.image('grass', 'assets/grass_no_bg.png');

        // carico l immagine di frame come spritesheet in modo da poter utilizzare ogni singolo frame a un determinato evento
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameHeight: 45,
            frameWidth: 32
        })

        //carico immagine della bomba gainHp
        this.load.spritesheet("hpBomb", "assets/lifeBomb.png", {
            frameWidth: 261, frameHeight: 264.5
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
        this.load.audio('hpUp', "assets/sounds/hpUp.mp3")

        // caricamento suono danno subito dal dude
        this.load.audio("dude_damage_1", "assets/sounds/hurt_1.mp3")
        this.load.audio("dude_damage_2", "assets/sounds/hurt_2.mp3")
        this.load.audio("dude_damage_3", "assets/sounds/hurt_3.mp3")
        this.load.audio("dude_damage_4", "assets/sounds/hurt_4.mp3")

        this.load.audio("clicking-clock", "assets/sounds/clock-timer.mp3")
        this.load.audio("thunderstorm", "assets/sounds/thunderstorm.mp3");
        this.load.audio("attackUpSound", "assets/sounds/attackUpSound.mp3")

        //carico spritesheet proiettile
        this.load.spritesheet('bullet', "assets/bullet_2.png", {
            frameHeight: 151, frameWidth: 93
        })

        //load dude pompato
        // this.load.spritesheet('dudePompato', 'assets/dudePompato.png', {
        //     frameWidth: 216,
        //     frameHeight: 490.5
        // });

        this.load.spritesheet('dudeCorazzato', 'assets/dude_corazzato.png', {
            frameWidth: 43,
            frameHeight: 42
        });

        //caricamento boss nemico
        this.load.spritesheet('bossSpriteSheet', "assets/boss.png", {
            frameWidth: 87, frameHeight: 110
        })

        // caricamento shuriken - boss's attack
        this.load.spritesheet('shuriken_boss', 'assets/shuriken_boss.png', {
            frameWidth: 15.5,
            frameHeight: 17
        })

        // add texture laser layer boss's attack
        this.load.spritesheet('layer', "assets/texture_laser.png", {
            frameWidth: 68, frameHeight: 422
        })

        // carico immagine del raggio laser del boss
        this.load.image('laserBeam', "assets/laserBeam.png");

        this.load.image("attackUp", "assets/attackUp.png")

        // carico suono bullet
        this.load.audio('bulletSound', "assets/sounds/fireBall.mp3");

        this.load.audio('bossHitted', "assets/sounds/bossDefeated.mp3")
        this.load.audio('bossDeath', "assets/sounds/bossIsDeath.mp3")
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


        // X
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
        this.dudePositionX = this.canvasWidth / 2;

        this.dudeCorazzato_sprite = this.physics.add.sprite(this.dude.x, this.dude.y, 'dudeCorazzato')
        this.dudeCorazzato_sprite.setVisible(false)
        this.dudeCorazzato_sprite.setSize(40, 60)
        this.dudeCorazzato_sprite.setDisplaySize(40, 60);

        // carica sprite contenente il dude che spara
        this.shooting_dude = this.physics.add.sprite(this.dude.body.x, this.dude.body.y, 'shooting-dude')
        this.shooting_dude.displayWidth = 12;
        this.shooting_dude.displayHeight = 12;
        this.shooting_dude.setVisible(false); // nascosto di default

        //inizializzo l animazione della bomba mentre cade
        this.loadBombAnimation()
        // inizializzo animazione del dude
        this.createAnimationDude(this)
        // inizializzo animazione dell esplosione della bomba
        this.createAnimationExplosion(this)
        // inizializzo animazione del contatto bullet e bomba
        this.createAnimationExplosionBulletBomb()
        // inizializzo la funzione per creare l animazione che poi servirà a far muovere il boss
        this.createAnimationBossMovements()

        // inizializzo animazioni per la gestione della bomba hpGain
        this.animateBombHpGain()

        // animazione per attacco layer del boss
        this.animateThunderLayer()

        // creo animazione del bullet fiammeggiante
        this.createAnimationBulletFiring()

        // inizilizz animazione rotazione shuriken boss
        this.createAnimationRotationShuriken();

        // crea background hp bar
        this.createHpbackground()

        // create animation dude pompato
        this.createAnimationDudeCorazzato()

        // crea vita vera e propria
        this.hpBar = this.add.graphics();
        this.updateHpBar()
    }

    layersAttackBoss() {
        console.log("attacco 3 del boss!")

        // attacco a layers
        if (!this.layer) {
            this.layer = this.physics.add.sprite(Math.floor(Math.random() * this.canvasWidth), 0, 'layer')
            this.layer.setVelocityY(300)
            this.layer.anims.play('thunderLayer')
            this.bossDoingAtk3 = false;
            this.bossExecutingAnAttack = false;
        }

    }


    // impostare una delle variabili contenenti i booleani per scegliere quale attacco fare su true
    // lil metodo deve essere skippato se in esecuzione un attacco,
    // finchè non finisce non dovrà entrare in questa funzione
    chooseAttackRandomly() {

        let n = Math.floor(Math.random() * this.arrAtks.length);
        this.arrAtks[n] = true;
        console.log(this.arrAtks)
        this.bossExecutingAnAttack = true;
    }

    // reset a boolean array with all falses
    resetArrAttacks() {
        this.arrAtks = this.arrAtks.map(() => false);
        console.log(this.arrAtks, "array attacchi post reset");
    }


    // show the title with remaining time to kill boss (only if the boss is present)
    showTimerBossDefeat() {
        if (!this.textTimerBoss) {
            console.log("renderizzo timer boss")
            this.textTimerBoss = this.add.text(
                this.canvasWidth / 7,
                this.canvasHeight / 8,
                `time before annihilation:
             ${this.timeToBeatBoss}`,
                {
                    fontSize: '17px',
                    color: '#ffcc00',
                    fontStyle: 'bold'
                }).setOrigin(0.5, 0.5)
        }
    }


    startDecrementBossTimer() {
        if (!this.timerDecrement) {
            this.timerDecrement = this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.timeToBeatBoss -= 1
                    this.textTimerBoss.setText(`time before annihilation:
             ${this.timeToBeatBoss}`)
                },
                callbackScope: this,
                loop: true
            });
        }
    }

    activateBossShield() {
        if (!this.bossShield) {
            this.bossShield = this.physics.add.image(this.boss.x, this.boss.y, "shield")
            this.bossShield.displayWidth = 200;
            this.bossShield.displayHeight = 200;
        }

    }


    generateAttackUpSprite() {
        this.attackUp_sprite = this.physics.add.sprite(Math.random() * this.canvasWidth, 0, "attackUp");
        this.attackUp_sprite.setVelocityY(150)
    }

    // eseguita ogni 16ms , accetta dei parametri
// delta:tempo passato dall ultimavolta che la funzione è stata chiamata (ogni 16ms )
// time: tempo totale in cui la func viene chiamata
    update(time, delta) {


        this.updatePunteggio(time)
        this.updateLivello()


        // ogni 300 punti spawn della bomba hp
        if (this.punteggio % 300 === 0 &&
            !this.generatingHpBomb &&
            this.punteggio !== 0) {
            console.log("generazione hp bomb ")
            this.generatingHpBomb = true;
            this.generateHpBomb()
        }

        // every 400 points an attackup power up is spawned
        if (this.punteggio % 400 === 0 &&
            !this.generatingAttackUpSprite
            //&& this.punteggio !== 0
        ) {
            this.generatingAttackUpSprite = true;
            this.generateAttackUpSprite()
        }

        // check if AttackUp Sprite is colliding with terrain
        if (this.attackUp_sprite && this.checkCollisionWithGround(this.attackUp_sprite, 100)) {
            this.attackUp_sprite.destroy();
            this.attackUp_sprite = null;
            this.generatingAttackUpSprite = false;
            console.log("attack up sprite ritornato a null")
        }

        //check if powerUp is colliding with dude
        if (this.attackUp_sprite && !this.dudePompato && this.checkCollision_general(this.dude, this.attackUp_sprite)) {
            this.sound.play("attackUpSound");
            this.attackUp_sprite.destroy();
            this.attackUp_sprite = null;
            this.generatingAttackUpSprite = false;
            this.dudePompato = true;
            console.log("dude has taken power up")
        }


// ho dovuto impostare il boolena this.alreadyAccessed boolean
        // perche altrimenti nel loop successivo rientrava nel if ma poi 'animationcomplete'
        // scattava e il riferimento a hpBomb_sprite diventata null e rompeva tutto
        if (this.hpBomb_sprite &&
            !this.alreadyAccessed &&
            (this.dude || this.dudeCorazzato_sprite) &&
            (this.checkCollision_general(this.hpBomb_sprite, this.dude) || this.checkCollision_general(this.hpBomb_sprite, this.dudeCorazzato_sprite))) {
            this.alreadyAccessed = true;
            this.hpBomb_sprite.setVelocityY(0);               // azzera velocità
            this.sound.play('hpUp'); // suono hpBomb
            this.hpBomb_sprite.body.setAllowGravity(false);

            this.hpBomb_sprite && this.hpBomb_sprite.anims.play('hpBombTaken')
                .on('animationcomplete', () => {
                    this.hpBomb_sprite.destroy();
                    this.hpBomb_sprite = null;
                    this.alreadyAccessed = false;
                    this.generatingHpBomb = false;
                })

            if (this.hp <= 80) {
                this.hp += 20;
            } else {
                console.log("la vita è troppo alta per essere ricaricata: hp dude --> ", this.hp);
            }


        }

        // se la Hpbomb collide col terreno sparisce e resetto timer per spawn hpbomb
        if (this.checkCollisionWithGround(this.hpBomb_sprite, 90)) {
            this.hpBomb_sprite.destroy();
            this.hpBomb_sprite = null;
            this.generatingHpBomb = false;
        }


        // se la vita scende a zero avvio la scena di gameover
        // interruzione della scena corrente
        if (this.hp <= 0) {
            this.stopGameAndGameOver()
        }


        // se il boss esiste, gestione dei movimenti
        this.boss && this.moveBoss()
        this.boss && this.updateBossLife()

        // ogni volta che la posizione x è un multiplo di 100 il boss lancia un attacco shuriken finche non ne lancia 15
        // poi passa al laser beam e poi di nuovo agli shurikne in loop finche non stira le zampe

        // BOSS'S ATTACKS
        if (this.boss) {

            // create and show the timer the user has to defeat boss
            this.showTimerBossDefeat()

            // when the boss appear y have a limit time to defeat it
            this.startDecrementBossTimer()
            if (!this.clicking_clock_sound) {
                this.clicking_clock_sound = this.sound.play('clicking-clock')
            }

            !this.bossExecutingAnAttack && this.chooseAttackRandomly()

            // se arrAtks[0] è true allora vado con il primo attacco
            // completato l attacco resetto tutti i valori e reimposto anche arrAtks con tutti false
            if (this.arrAtks[0] && !this.bossDoingAtk2 && !this.bossDoingAtk3 && !this.bossDoingAtk4) {

                this.bossDoingAtk1 = true;
                this.bossExecutingAnAttack = true;
                Math.floor(this.boss.x) % 100 === 0 &&
                this.shuriken_count < 5 &&
                this.shurikenAttackBOss()

                if (this.shuriken_count >= 5) {
                    this.resetArrAttacks()
                    this.bossDoingAtk1 = false;
                    this.shuriken_count = 0;
                    this.bossExecutingAnAttack = false;
                }

            }

            // se arrAtks[1] è true allora vado con il secondo attacco
            // completato l attacco resetto tutti i valori e reimposto anche arrAtks con tutti false
            if (this.arrAtks[1] && !this.bossDoingAtk1 && !this.bossDoingAtk3 && !this.bossDoingAtk4) {
                this.bossDoingAtk2 = true;
                this.laserBeamAttackBoss()
            }

            if (this.arrAtks[2] && !this.bossDoingAtk1 && !this.bossDoingAtk2 && !this.bossDoingAtk4) {
                this.bossDoingAtk3 = true;
                this.bossExecutingAnAttack = true
                this.layersAttackBoss()
            }

            if (this.arrAtks[3] && !this.bossDoingAtk1 && !this.bossDoingAtk2 && !this.bossDoingAtk3) {
                this.bossDoingAtk4 = true;
                this.bossExecutingAnAttack = true;
                this.activateBossShield()
            }


            // if the shield has been activated, handle it to last 3 sec than reset arr attacks and loop
            if (this.bossShield) {

                this.bossShield.x = this.boss.x
                this.bossShield.y = this.boss.y
                // the shield must last 1 sec each time
                // when 1 second is lasts reset variable to restar the loop of random weapon generation
                this.timerBossShield++
                // to handle the duration of the shield using delta variable,
                // each 2 sec are 62 iterations in the loop
                // every time the loop enters the if the variable is +1
                // if it reached 62, 1 sec is lasted do it * 3 to have 3 sec
                if (this.timerBossShield >= 62 * 2) {
                    this.bossShield.destroy();
                    this.bossShield = null
                    this.timerBossShield = 0;
                    this.bossExecutingAnAttack = false;
                    this.bossDoingAtk4 = false;
                    this.resetArrAttacks()
                }

            }

            // if time to kill boss is finished than givesYou an inavoidable attack
            if (this.timeToBeatBoss <= 0 && !this.thunderTempest) {
                this.thunderTempest = this.add.group()
                for (let i = 0; i < 100; i++) {
                    const thunder = this.physics.add.sprite(Math.floor(Math.random() * this.canvasWidth), 0, 'layer')
                    this.thunderTempest.add(thunder);
                    thunder.setVelocityY(300)
                    thunder.anims.play('thunderLayer')
                }

            }

        }

        // if thundertempest has been released play sound
        if (this.thunderTempest !== null && !this.playingThunderStorm) {
            this.sound.play('thunderstorm')
            this.playingThunderStorm = true;
        }


        // check collision between the dude and a thunder in the main update method
        // or between dudeCorazzato and thunder
        this.thunderTempest && this.thunderTempest.children.iterate(thunder => {
            if (this.checkCollision_general(this.dude, thunder)) {
                this.hp -= 10
            }

            if (this.dudeCorazzato_sprite &&
                this.checkCollision_general(this.dudeCorazzato_sprite , thunder)){
                this.hp -= 5;
            }
        })


        // controllo le collisioni tra dude e gruppo delle bombe se dude non pompato
        this.bombsGroup && this.bombsGroup.children.iterate((bomb) => {

            if (!bomb) return

            if (this.bullet && this.checkCollision_general(bomb, this.bullet)) {
                // nel punto dove bullet e bomb si toccano inserisci l animazione di una esplosione
                bomb.destroy()
                this.sound.play('expl_bomb_bullet', {
                    volume: 5
                });

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

            }

            if (this.superBullet && this.checkCollision_general(bomb, this.superBullet)) {
                // nel punto dove bullet e bomb si toccano inserisci l animazione di una esplosione
                bomb.destroy()
                this.sound.play('expl_bomb_bullet', {
                    volume: 5
                });

                this.punteggio += 10;
                this.explosion_bullet_bomb = this.physics.add.sprite(bomb.x, bomb.y, 'bullet_bomb_explosion')

                this.explosion_bullet_bomb.setGravity(false)
                this.explosion_bullet_bomb.anims.play('boom2')
                this.explosion_bullet_bomb.on('animationcomplete', () => {
                    this.explosion_bullet_bomb.destroy()
                });
                this.removingBullet = false;
                return;

            }

            if (this.checkCollisionWithGround(bomb, 60)) {

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

        //if dude is pompato handle caricatore bullets
        if (
            this.dudePompato &&
            (
                !this.caricatoreBullets ||
                this.caricatoreBullets.getLength() === 0
            )
        ) {

            if (!this.caricatoreBullets) {
                this.caricatoreBullets = this.physics.add.group();
            }


            for (let i = 0; i < 5; i++) {
                const bullet = this.physics.add.sprite(
                    this.dude.x,
                    this.dude.y - 40,
                    'bullet'
                )
                    .setAngle(180)
                    .setScale(0.5) // Riduce anche il render grafico
                    .setOrigin(0.5)
                    .setBounce(1)
                    .setVisible(false)
                    .setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
                this.caricatoreBullets.add(bullet)
            }
            console.log("caricatore bullet dude pompato:", this.caricatoreBullets)
            // create a visual text for residual super bullet remaining

            this.textSuperBulletRemaining ?
                this.textSuperBulletRemaining.setText(`Superbullets: ${this.caricatoreBullets.getLength()} `) :
                this.textSuperBulletRemaining = this.add.text(this.canvasWidth / 17,
                    this.canvasHeight / 7,
                    `Superbullets: ${this.caricatoreBullets.getLength()} `)

        }



        // controllo collisioni tra dude e gruppo degli shuriken
        this.shuriken_boss && this.shuriken_boss.children.iterate((shur) => {

            // per ogni shuriken controllo collisione con dude
            // se avviene sottraggo vita
            if (this.checkCollision_general(shur, this.dude)) {
                this.hp -= 10
                shur.destroy()
                this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
            }

            if (this.dudeCorazzato_sprite && this.checkCollision_general(shur, this.dudeCorazzato_sprite)) {
                this.hp -= 10
                shur.destroy()
                this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
            }

        })

        // se lo shuriken tocca terra lo elimino dal gruppo
        this.shuriken_boss && this.shuriken_boss.children.iterate(shuriken => {

            if (this.checkCollisionWithGround(shuriken, 100)) {
                console.log("shuriken tocca terra brasato.")
                shuriken.destroy()
            }

        })

        // check if dude is hitted by layers attack
        if (this.layer && this.dude) {
            if (this.checkCollision_general(this.layer, this.dude)) {
                this.hp -= 2;
            }
        }

        // check if dudeCorazzato is hitted by layers attack
        if (this.layer && this.dudeCorazzato_sprite) {
            if (this.checkCollision_general(this.layer, this.dudeCorazzato_sprite)) {
                this.hp -= 1;
            }
        }


        // check if dude hitted by is own bullet
        if (this.bullet &&
            (this.dude || this.dudeCorazzato_sprite) &&
            (this.checkCollision_general(this.bullet, this.dude) || this.checkCollision_general(this.bullet, this.dudeCorazzato_sprite)  )) {
            this.hp -= 10;
            this.bullet.destroy()
            this.bullet = null;
            this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
        }

        // check if dude hitted by its own superbullet
        if (this.superBullet &&
            (this.dude || this.dudeCorazzato_sprite) &&
            (this.checkCollision_general(this.superBullet, this.dudeCorazzato_sprite) || this.checkCollision_general(this.superBullet , this.dude) )) {
            this.hp -= 18;
            this.superBullet.destroy()
            this.superBullet = null;
            this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
            this.removingBullet = false;
        }

        // check if layer thunder has passed the canvas heigth
        if (this.layer && this.layer.y > this.canvasHeight) {
            console.log("il layer è uscito dalla canvas")
            this.layer.destroy();
            this.layer = null;
        }


        //controllo se uno dei laserBeam colpisce dude
        if (this.dude && this.boss_laserBeam_1 && this.boss_laserBeam_2 && !this.hittedByLaserBeam) {
            if (this.checkCollision_general(this.dude, this.boss_laserBeam_1) ||
                this.checkCollision_general(this.dude, this.boss_laserBeam_2)) {
                this.hp -= 30;
                this.hittedByLaserBeam = true;
                this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
                console.log("dude preso da uno dei laser beam del boss")
            }
        }

        //controllo se uno dei laserBeam colpisce dudeCorazzato
        if (this.dudeCorazzato_sprite && this.boss_laserBeam_1 && this.boss_laserBeam_2 && !this.hittedByLaserBeam) {
            if (this.checkCollision_general(this.dudeCorazzato_sprite, this.boss_laserBeam_1) ||
                this.checkCollision_general(this.dudeCorazzato_sprite, this.boss_laserBeam_2)) {
                this.hp -= 20;
                this.hittedByLaserBeam = true;
                this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
                console.log("dude preso da uno dei laser beam del boss")
            }
        }

        // se dude è stato colpito dal laser aspetto due secondi e poi resetto la variabile
        // che se impostata su false gli consente di riprendere danno dal laser,
        // (quindi dopo un danno dal laserbeam del boss ne è immune per 2 secondi
        if (this.hittedByLaserBeam) {
            this.time.delayedCall(2000, () => {
                this.hittedByLaserBeam = false;
            })
        }


        // controllo collisioni tra bullet e boss se questi esistono
        if (this.bullet && this.boss && this.checkCollision_general(this.bullet, this.boss)) {
            this.hpBoss_number -= 10;
            this.hpBoss_number > 0 && this.sound.play('bossHitted')
            this.bullet.destroy()
            this.bullet = null;
        }

        // controllo collisioni tra superbullet e boss se questi esistono
        if (this.superBullet && this.boss && this.checkCollision_general(this.superBullet, this.boss)) {
            this.hpBoss_number -= 15;
            this.hpBoss_number > 0 && this.sound.play('bossHitted')
            this.superBullet.destroy()
            this.superBullet = null;
            this.removingBullet = false;
        }

        if (this.boss && this.hpBoss_number <= 0) {
            this.sound.play('bossDeath', {
                volume: 3
            })
            this.updateBossLife()
            this.boss.destroy()
            this.boss = null


            this.time.delayedCall(3000, () => {
                this.scene.stop('gameplay')
                this.sound.stopAll();
                this.scene.start('gameover', {
                    canvasWidth: this.canvasWidth,
                    canvasHeigth: this.canvasHeight,
                    punteggioFinale: this.punteggio,
                    livello: this.livello,
                    isGameVictory: true
                })
            })

        }


        // gestione dell animazione del dude
        this.dude.setVelocity(0);


        if (this.cursors.left.isDown) {
            // il tasto FRECCIA SINISTRA è premuto


            if (!this.dudePompato) {
                this.showSprite(this.dude);
                this.hideSprite(this.dudeCorazzato_sprite);
                this.hideSprite(this.shooting_dude);
                this.dude.anims.play('left', true)
                this.dude.setVelocityX(-300);
                this.dudePositionX = this.dude.x;
            }


            if (this.dudePompato && this.dudeCorazzato_sprite) {

                this.hideSprite(this.dude);
                this.hideSprite(this.shooting_dude);
                this.showSprite(this.dudeCorazzato_sprite);
                this.dudeCorazzato_sprite.setVelocityX(-300)
                this.dudeCorazzato_sprite.anims.play('goLeft', true)
                this.dudePositionX = this.dudeCorazzato_sprite.x;
                // this.dudeCorazzato_sprite.x = this.dudePositionX;
            }
        }

        if (this.cursors.right.isDown) {
            // il tasto FRECCIA DESTRA è premuto

            if (!this.dudePompato) {

                this.showSprite(this.dude);
                this.hideSprite(this.shooting_dude);

                // this.dude.setVisible(true)
                // this.shooting_dude.setVisible(false)
                this.dude.setVelocityX(300);
                this.dudePositionX = this.dude.x;
                this.dude.anims.play('right', true)
            }

            if (this.dudePompato) {

                this.hideSprite(this.dude);
                this.hideSprite(this.shooting_dude);
                this.showSprite(this.dudeCorazzato_sprite);

                this.dudeCorazzato_sprite.setVelocityX(300);
                this.dudePositionX = this.dudeCorazzato_sprite.x;
                this.dudeCorazzato_sprite.anims.play("goRight", true)
            }
        }

        if (this.cursors.up.isDown) {

            if (this.cursors.right.isDown) return;
            if (this.cursors.left.isDown) return;

            // if dude pompato handle throw of bigger bullet and caricatore bullet
            if (this.dudePompato &&
                this.caricatoreBullets &&
                this.caricatoreBullets.getLength() > 0 &&
                !this.removingBullet) {

                this.hideSprite(this.dude);
                this.hideSprite(this.shooting_dude);
                this.showSprite(this.dudeCorazzato_sprite)

                this.dudeCorazzato_sprite.anims.play("spara_corazzato")
                this.dudeCorazzato_sprite.setVelocityX(0);
                this.removingBullet = true;
                const bullet = this.caricatoreBullets.getLast(true)
                bullet.setVelocityY(-500);
                bullet.setVisible(true)
                bullet.anims.play('flameBullet')
                bullet.body.x = this.dudeCorazzato_sprite.x - 30
                bullet.body.y = this.dudeCorazzato_sprite.y - 120
                this.caricatoreBullets.remove(bullet);
                this.superBullet = bullet;
                console.log("caricatore bullets rimasti dovrebbe essere x - 1 ", this.caricatoreBullets)
                this.textSuperBulletRemaining.setText(`Superbullets: ${this.caricatoreBullets.getLength()}`)

                //
            }


            if (this.bullet === null && !this.dudePompato) {
                this.bullet = this.physics.add.sprite(
                    this.dude.x,
                    this.dude.y - 40,
                    'bullet'
                )
                    .setAngle(180)
                    .setScale(0.3) // Riduce anche il render grafico
                    .setOrigin(0.5)
                    .setBounce(1)

                // Calcola nuova dimensione hitbox in base alla scala e all’immagine originale
                const width = this.bullet.displayWidth;
                const height = this.bullet.displayHeight;

                this.bullet.body.setSize(width, height);
                this.bullet.body.setOffset((this.bullet.width - width) / 2, (this.bullet.height - height) / 2);
                this.bullet.setVelocity(0, -250)
                this.sound.play('bulletSound')
                this.bullet.anims.play('flameBullet');
                // this.shooting_dude.setVisible(true)
                this.hideSprite(this.dudeCorazzato_sprite)
                this.hideSprite(this.dude);
                this.showSprite(this.shooting_dude)
                this.shooting_dude.x = this.dudePositionX;
                this.shooting_dude.y = this.dude.y - 9
                this.shooting_dude.anims.play('shoot', true);
            }


        }

        // static situation, no key pressed
        // case dude pompato and not pompato
        if (!this.cursors.right.isDown && !this.cursors.left.isDown && !this.cursors.up.isDown && !this.dudePompato) {
            this.showSprite(this.dude);
            this.hideSprite(this.dudeCorazzato_sprite);
            this.hideSprite(this.shooting_dude);
            this.dude.x = this.dudePositionX;
            this.dude.anims.play('stand')
        }

        if (!this.cursors.right.isDown && !this.cursors.left.isDown && !this.cursors.up.isDown && this.dudePompato) {

            this.hideSprite(this.dude);
            this.showSprite(this.dudeCorazzato_sprite);
            this.hideSprite(this.shooting_dude);
            this.dudeCorazzato_sprite.displayWidth = 100;
            this.dudeCorazzato_sprite.displayHeigth = 250;
            this.dudeCorazzato_sprite.anims.play('standCorazzato')
            this.dudeCorazzato_sprite.x = this.dudePositionX;

        }


        //check if bullet has collided with shield,
        // if that happen his velocity on y axe is inverted, than bullet exit from canvas and became null
        if (this.bullet && this.bossShield && this.checkCollision_general(this.bullet, this.bossShield)) {
            {
                this.bullet.setVelocityY(400)
                this.bullet.setAngle(360);
            }
        }

        //check if superBullet has collided with shield,
        // if that happen his velocity on y axe is inverted, than superBullet exit from canvas and became null
        if (this.superBullet && this.bossShield && this.checkCollision_general(this.superBullet, this.bossShield)) {
            {
                this.superBullet.setVelocityY(600)
                this.superBullet.setAngle(360);
            }
        }

        this.updateHpBar()
        this.bullet && this.checkIfBulletOutOfCanvas()

        this.superBullet && this.checkIfSuperBulletOutOfCanvas()

        if (this.caricatoreBullets && this.caricatoreBullets.getLength() !== null && this.caricatoreBullets.getLength() === 0 && this.dudePompato) {
            console.log("dude non più pompato")
            this.dudePompato = false;
        }


        console.log("dude è pompato??? ---> " , this.dudePompato)
    }


    // method to hide a sprite from the canvas and also disable his body
    hideSprite(sprite_ref) {
        sprite_ref.setVisible(false)
        sprite_ref.body.enable = false;
    }

    // method to show a sprite into the canvas and also enable his body physic
    showSprite(sprite_ref) {
        sprite_ref.setVisible(true)
        sprite_ref.body.enable = true;
    }


    // funzione per la generazione della hp bomb a schermo
    generateHpBomb() {
        this.hpBomb_sprite = this.physics.add.sprite(Math.random() * this.canvasWidth,
            0,
            "hpBomb")
        this.hpBomb_sprite.anims.play("hpBombFall")
        this.hpBomb_sprite.setVelocityY(350)
        this.hpBomb_sprite.setScale(0.3)
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
        if (this.bullet && this.bullet.body.y <= 0 || this.bullet.body.y >= this.canvasHeight) {
            this.bullet = null
            console.log("bullet uscita dall asse y ")
        }
    }

    checkIfSuperBulletOutOfCanvas() {
        if (this.superBullet && this.superBullet.body.y <= 0 || this.superBullet.body.y >= this.canvasHeight) {
            this.superBullet = null
            console.log(" super bullet uscita dall asse y ")
            this.removingBullet = false;
            console.log("removing bullet false, posso sparare di nuovo: colpi superbullet residui: " + this.caricatoreBullets.getLength())
        }
    }

    chooseRandomDudeDamageSound() {
        const arrDamage = ['dude_damage_1', "dude_damage_2", "dude_damage_3", "dude_damage_4"]
        return arrDamage[Math.floor(Math.random() * arrDamage.length)];
    }

    // check collision between 2 objects
    checkCollision_general(p1, p2) {
        if (p1 && p2 && this.physics.overlap(p1, p2)) {
            return true;
        }
    }


    // movimento oscillatorio del bbss dx - sn
    moveBoss() {

        if (this.boss_atk_2_done) {
            this.boss_atk_2_done = false;
            this.boss.setVelocityX(0);

            if (this.boss.x > this.canvasWidth / 2) {
                this.movingRight = false;
                this.boss.setVelocityX(-150);
            } else {
                this.boss.setVelocityX(150)
                this.movingRight = true;
            }
        }

        if (this.boss.x >= 0 && this.movingRight) {
            this.boss.setVelocityX(150)
        }

        if (this.boss.x >= this.canvasWidth - 100) {
            this.boss.setVelocityX(-150);
            this.movingRight = false;
        }

        if (this.boss.x <= 100) {
            this.movingRight = true;
        }

    }

    laserBeamAttackBoss() {


        // IMPORTANTE PORTARE SEMPRE IL BOSS AD UNA POSIZIONE X % 100 === 0
        // perche gli shuriken vengono lanciati solo quando il boss si trova in posizione x % 100 === 0
        // (quindi quando il valore di x è intero e divisibile per 100 senza resto.)
        if (this.random_x_position_boss === null) {
            const randomPositions = [200, 300, 400, 500, 600, 700, 800, 900]
            const shuffledArr = Phaser.Actions.Shuffle(randomPositions)
            this.random_x_position_boss = shuffledArr[0];
        }


        if (!this.boss_tweens) {
            // sposto il boss ad una posizione x
            // casuale in modo graduale evitaando il teletrasporto
            this.boss_tweens = this.tweens.add({
                targets: this.boss,
                x: this.random_x_position_boss,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.fireLaserBeam()

                    this.boss_laserBeam_1 &&
                    this.boss_laserBeam_2 &&
                    this.time.delayedCall(1000, () => {
                        this.boss_laserBeam_1.destroy();
                        this.boss_laserBeam_2.destroy();
                        this.boss_tweens = null;
                        this.bossDoingAtk2 = false;
                        console.log("Laser beam disattivato!");
                    })

                    // this.shuriken_count = 0;
                    this.random_x_position_boss = null;
                    this.bossExecutingAnAttack = false;
                    this.resetArrAttacks()
                }
            });
        }


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

    shurikenAttackBOss() {
        // Crea lo shuriken
        const shuriken = this.physics.add
            .sprite(this.boss.x, this.boss.y, 'shuriken_boss')
            .setScale(2);

        // Aggiungi al gruppo
        this.shuriken_boss.add(shuriken);

        // Imposta velocità DOPO l'aggiunta al gruppo

        shuriken.setVelocityY(this.VELOCITY += 10);
        shuriken.body.allowGravity = false; // Evita che la gravità interferisca
        shuriken.anims.play('shuriken');
        this.shuriken_count++
        console.log(shuriken.body.velocity)
    }


    stopGameAndGameOver() {
        this.scene.stop('gameplay');
        this.bombsGroup = null;
        this.timerEventSpawnBomb = null
        this.sound.stopAll();
        this.scene.start('gameover', {
            canvasWidth: this.canvasWidth,
            canvasHeigth: this.canvasHeight,
            punteggioFinale: this.punteggio,
            livello: this.livello,
            // sadDude: "assets/sad_dude_no_bg.png",
            // happyDude: null,
            // music: "assets/sounds/gameOver.mp3",
            isGameVictory: false
        })
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

    createBomb() {
        return this.bombsGroup.create(
            Math.random() * this.canvasWidth,
            0,
            'bomb'
        );
    }

    singleBombGen() {
        const bomb = this.createBomb()

        bomb.setDisplaySize(this.BOMB_DEFAULT_WIDTH, this.BOMB_DEFAULT_HEIGHT);
        bomb.setVelocityY(this.VELOCITY);        // imposta la velocità iniziale sull'asse Y
        bomb.setGravityY(10);                    // applichi una gravità costante
        bomb.setBounce(0);
        bomb.anims.play('bombAnim')
    }

    multipleBombGen(count) {
        for (let i = 0; i < count; i++) {
            const bomb = this.createBomb()

            bomb.setDisplaySize(this.BOMB_DEFAULT_WIDTH, this.BOMB_DEFAULT_HEIGHT);
            bomb.setVelocityY(this.VELOCITY);        // imposta la velocità iniziale sull'asse Y
            bomb.setGravityY(10);                    // applichi una gravità costante
            bomb.setBounce(0);
            bomb.anims.play('bombAnim')
        }
    }

    // controllo se c'è collisione tra p1 ed il terreno,
    // aggiustando la distanza a cui voglio che l'oggetto sparisca una volta in prossimita dell terreno (offsetFromTerrain)
    checkCollisionWithGround(p1, offsetFromTerrain) {
        if (p1 && p1.body && Math.round(p1.body.y) > Math.round(this.grassTerrain.body.y + offsetFromTerrain)) {
            return true;
        }
    }

    updateLivello() {
        if (!this.livelloChanged &&
            this.punteggio % 200 === 0 &&
            !this.boss) {
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

            if (this.livello === 2) {
                this.bombGenerationType = this.DOUBLE_GENERATION_BOMB
                console.log("passato a modalità spawn bombe doppio")
            }

            if (this.livello === 3) {
                this.bombGenerationType = this.TRIPLE_GENERATION_BOMB
                console.log("passato alla modalità spawn bombe triplo")
            }

            if (this.livello === 4) {
                this.bombGenerationType = this.QUADRUPLE_GENERATION_BOMB
                console.log("passato alla modalità spawn bombe quadruplo")
            }

            if (this.livello === 6) {
                // metto in pausa la generazione di bombe
                this.timerEventSpawnBomb.paused = true;
                // interrompo musica di base facendo un fade out

                this.tweens.add({
                    targets: this.sound.get('gameMusic'),
                    volume: 0,
                    duration: 2000, // durata in millisecondi
                    ease: 'Linear',
                    onComplete: () => {
                        this.sound.get('gameMusic').stop(); // opzionale: ferma la musica quando il volume è 0
                    }
                });

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
            this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
            this.updateHpBar()
        }

        if (this.dudeCorazzato_sprite && this.explosion && this.physics.overlap(this.dudeCorazzato_sprite, this.explosion)) {
            this.hp -= 20
            this.sound.play(this.chooseRandomDudeDamageSound(), {volume: 2});
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
            repeat: -1 // quante volte ripetuta animazione: -1 inifinito, n: n volte, 0: una sola volta
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

    createAnimationBulletFiring() {
        this.anims.create({
            key: 'flameBullet',
            frames: this.anims.generateFrameNumbers('bullet', {start: 0, end: 4}),
            frameRate: 15,
            repeat: -1
        })
    }


    loadBombAnimation() {
        this.anims.create({
            key: 'bombAnim',
            frames: this.anims.generateFrameNumbers('bomb', {start: 0, end: 2}),
            frameRate: 15,
            repeat: -1
        })
    }


    animateBombHpGain() {
        this.anims.create({
            key: 'hpBombFall',
            frames: this.anims.generateFrameNumbers('hpBomb', {start: 0, end: 0}),
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: 'hpBombTaken',
            frames: this.anims.generateFrameNumbers('hpBomb', {start: 4, end: 11}),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: 'hpBombFallenGround',
            frames: this.anims.generateFrameNumbers('hpBomb', {start: 7, end: 11}),
            frameRate: 15,
            repeat: -1
        })
    }

    animateThunderLayer() {
        this.anims.create({
            key: 'thunderLayer',
            frames: this.anims.generateFrameNumbers('layer', {start: 0, end: 3}),
            frameRate: 15,
            repeat: -1
        })
    }

    createAnimationDudeCorazzato() {
        this.anims.create({
            key: 'standCorazzato',
            frames: this.anims.generateFrameNumbers('dudeCorazzato', {start: 0, end: 0}),
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: 'goRight',
            frames: this.anims.generateFrameNumbers('dudeCorazzato', {start: 3, end: 8}),
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: 'goLeft',
            frames: this.anims.generateFrameNumbers('dudeCorazzato', {start: 9, end: 14}),
            frameRate: 15,
            repeat: -1
        })

        this.anims.create({
            key: 'spara_corazzato',
            frames: this.anims.generateFrameNumbers('dudeCorazzato', {start: 18, end: 18}),
            frameRate: 15,
            repeat: -1
        })
    }

}