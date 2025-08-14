export class CircleOfDeath extends Phaser.Scene {

    REDTRACE = "red"
    BLACKTRACE = "black"

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    moonSurface = null;
    boss = null;
    dudeShip = null
    raggio = 270
    angolo = 0;
    velAngolare = Math.PI / 3; // 90° al secondo
    mapSounds = new Map()
    cursor = null
    circleTrace = null
    keySpace = null
    turbo = false
    boostCloud_group = null
    isBossAttacking = false
    laserBean_group = null;
    semicircle = null
    passingTime = 0
    semicircleTrace = null // traccia per tenere conto di che tipo di semicircle attualmente nella canva


    constructor() {
        super("circleofdeath");
    }

    init(data) {
        this.canvasWidth = data.canvasWidth;
        this.canvasHeight = data.canvasHeight;
        this.gameName = data.gameName
    }

    preload() {

        this.load.image("moon_surface", "assets/circleofdeath/images/mars_land.jpg")
        this.load.image("circular_boss", "assets/circleofdeath/images/circular_boss.png")
        this.load.image("circular_boss_funky_pose", "assets/circleofdeath/images/boss_funky_pose.png")
        this.load.image("dudeShip", "assets/pingpong/images/dude_ping_pong.png")
        this.load.image("redBean", "assets/circleofdeath/images/redBean.png")

        this.load.spritesheet("boost_cloud", "assets/circleofdeath/images/boost_cloud.png", {
            frameWidth: 64, frameHeight: 64
        })

        this.load.audio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")

    }


    create() {

        this.boostCloud_group = this.add.group()
        this.laserBean_group = this.add.group()
        this.cursor = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.createAnimation("accelerationBoost", "boost_cloud", 0, 8, 25, 0)

        this.mapSounds.set("bg_funk", this.sound.add("bg_funk", {
            volume: 2
        }))

        this.moonSurface = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "moon_surface")
            .setScale(0.5)

        this.boss = this.physics.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2, "circular_boss")
            .setScale(0.2)

        this.dudeShip = this.physics.add.sprite((this.canvasWidth / 2) + this.raggio, this.canvasHeight / 2, 'dudeShip')
            .setScale(0.2)
            .setDepth(2)

        this.circleTrace = this.add.graphics();

        this.circleTrace.lineStyle(2, 0x293133);
        this.circleTrace.strokeCircle(
            this.canvasWidth / 2, // x centro
            this.canvasHeight / 2, // y centro
            this.raggio // raggio
        );

        this.mapSounds.get("bg_funk").play()
    }

    update(time, delta) {

        this.rotateBoss()
        this.checkCursorInput(delta)
        this.bossAttacks(delta)

        // check if one of the bullets hits the dudeship
        this.checkCollisionDude_bean()
    }

    resetTexture(sprite, texture) {
        this.time.addEvent({
            delay: 500,
            loop: false,
            callback: () => {
                sprite.setTexture(texture)
            }
        })

    }

    checkCollisionDude_bean() {
        this.laserBean_group.children.iterate(bean => {
            if (this.checkCollision_general(bean, this.dudeShip)) {
                bean.destroy()
            }
        })
    }

    bossAttacks(delta) {

        // accumulate delta (time passed between a frame and the next one)
        this.passingTime += delta;

        //
        if (!this.isBossAttacking && this.passingTime >= 3000) {

            this.passingTime = 0

            let n = Math.random()

            console.log(n)

            // if (n > 0.5) this.laserBeans()
            //   if (n <= 0.5) this.laserSemicircles()


            this.laserSemicircles()
        }
    }

    laserSemicircles() {

        this.isBossAttacking = true;
        this.showDamagingArea()

    }

    addDamageToSelectedArea() {

    }

    showDamagingArea() {

        let circumferenceDamage = Math.random() * (2 - 1) + 1
        let startingAngle = Math.floor(Math.random() * 340)

        const red = 0xff0000
        const black = 0x0a0a0a

        this.showRed(circumferenceDamage, startingAngle, red)

        this.time.addEvent({
            delay: 300,
            repeat: 3,
            callback: () => {
                if (this.semicircleTrace === this.REDTRACE) {
                    this.showBlack(circumferenceDamage, startingAngle, black)
                } else {
                    this.showRed(circumferenceDamage, startingAngle, red)
                }
            },
            onComplete: () => {
                this.addDamageToSelectedArea()
            }
        })

    }

    showRed(circumferenceDamage, startingAngle, color) {
        this.semicircleTrace = this.REDTRACE
        this.createSemicircunference(circumferenceDamage, startingAngle, color)
    }

    showBlack(circumferenceDamage, startingAngle, color) {
        this.semicircleTrace = this.BLACKTRACE
        this.createSemicircunference(circumferenceDamage, startingAngle, color)
    }

    createSemicircunference(circumferenceDamage, startingAngle, color) {
        this.semicircle = this.add.graphics()

        this.semicircle.lineStyle(20, color) // red
        this.semicircle.arc(
            this.canvasWidth / 2,
            this.canvasHeight / 2,
            this.raggio,
            startingAngle,
            Math.PI * circumferenceDamage,
            false
        )

        this.semicircle.strokePath();
    }


    laserBeans() {
        this.isBossAttacking = true;

        for (let i = 0; i < 25; i++) {
            let bean = this.physics.add.sprite(this.boss.x, this.boss.y, "redBean")
                .setOrigin(0.5, 0.5);

            this.laserBean_group.add(bean);

            let distributionBean = Math.floor(Math.random() * 3)

            // Calcola l'angolo per questo bean (distribuiti uniformemente)
            let angle = (i / 10) * Math.PI * distributionBean; // 360 gradi diviso 10

            // Calcola la velocità in base all'angolo
            let speed = 200; // pixel per secondo
            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;

            // Applica la velocità
            bean.setVelocity(velocityX, velocityY);
            bean.setRotation(Phaser.Math.DegToRad(velocityX))
            this.boss.setTexture("circular_boss_funky_pose")

            // Distruggi il bean quando raggiunge la circonferenza
            this.time.addEvent({
                delay: (this.raggio / speed) * 1000, // tempo per raggiungere il bordo
                callback: () => {
                    if (bean.active) {
                        bean.destroy();
                    }
                    this.resetTexture(this.boss, "circular_boss")
                }
            });

        }

        // Reset del flag dopo che tutti i bean sono partiti
        this.time.addEvent({
            delay: (this.raggio / 200) * 1000 + 500, // tempo movimento + buffer
            callback: () => {
                this.isBossAttacking = false;
            }
        });
    }

    checkCollision_general(p1, p2) {
        if (p1 && p2 && this.physics.overlap(p1, p2)) {
            return true;
        }
    }

    rotateBoss() {
        this.boss.body.rotation += 0.5
    }

    checkCursorInput(delta) {

        if (this.cursor.right.isDown && !this.turbo) {
            this.angolo += this.velAngolare * (delta / 1000);
            let x = (this.canvasWidth / 2) + this.raggio * Math.cos(this.angolo);
            let y = this.canvasHeight / 2 + this.raggio * Math.sin(this.angolo);
            this.dudeShip.setPosition(x, y);
        }

        if (this.cursor.left.isDown && !this.turbo) {
            this.angolo -= this.velAngolare * (delta / 1000);
            let x = (this.canvasWidth / 2) + this.raggio * Math.cos(this.angolo);
            let y = this.canvasHeight / 2 + this.raggio * Math.sin(this.angolo);
            this.dudeShip.setPosition(x, y);
        }

        if (this.keySpace.isDown) {
            // this.turbo = true
            this.angolo += (this.velAngolare * 3) * (delta / 1000);
            let x = (this.canvasWidth / 2) + this.raggio * Math.cos(this.angolo);
            let y = this.canvasHeight / 2 + this.raggio * Math.sin(this.angolo);
            this.dudeShip.setPosition(x, y);

            let cloud = this.add.sprite(x, y, "boost_cloud").play("accelerationBoost")

            this.boostCloud_group.add(cloud, true)

            this.boostCloud_group.children.iterate(boost => {
                boost.on('animationcomplete', () => {
                    boost.destroy();
                });
            })

        }

    }

    createAnimation(key, spritesheetName, start, end, frameRate, repeat) {
        this.anims.create({
            key: key,
            frames: this.anims.generateFrameNumbers(spritesheetName, {start: start, end: end}),
            frameRate: frameRate,
            repeat: repeat
        })
    }

}