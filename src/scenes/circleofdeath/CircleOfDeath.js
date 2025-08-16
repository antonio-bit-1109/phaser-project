import {SoundsManager} from "./managers/SoundsManager";

export class CircleOfDeath extends Phaser.Scene {


    SoundsManager = null

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
    // mapSounds = new Map()
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
    flameGroup = null
    turboLowBar = null;
    turboUpperBar = null
    HasTurboNeedRecharge = false
    deltaRechargeTurbo = 0

    constructor() {
        super("circleofdeath");
        this.SoundsManager = new SoundsManager(this)
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

        this.load.spritesheet('flame_spriteSheet', "assets/bombburner/images/bullet_2.png", {
            frameHeight: 151, frameWidth: 93
        })

        this.SoundsManager.loadAudio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")
        // this.load.audio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")

    }


    create() {

        this.turboLowBar = this.add.rectangle(this.canvasWidth / 12, this.canvasHeight / 12, 50, 20, 0xff0000, 1)
            .setDepth(3)

        this.turboUpperBar = this.add.rectangle(this.canvasWidth / 12, this.canvasHeight / 12, 50, 20, 0x0000FF, 1)
            .setDepth(3)


        this.flameGroup = this.add.group()
        this.boostCloud_group = this.add.group()
        this.laserBean_group = this.add.group()
        this.cursor = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.createAnimation("accelerationBoost", "boost_cloud", 0, 8, 25, 0)
        this.createAnimation("flameBurning", "flame_spriteSheet", 0, 4, 20, -1)

        // this.mapSounds.set("bg_funk", this.sound.add("bg_funk", {
        //     volume: 2,
        //     loop: true
        // }))
        this.SoundsManager.addAudio("bg_funk", {
            volume: 2,
            loop: true
        })

        this.moonSurface = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "moon_surface")
            .setScale(0.5)

        this.boss = this.physics.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2, "circular_boss")
            .setScale(0.2)

        this.dudeShip = this.physics.add.sprite((this.canvasWidth / 2) + this.raggio, this.canvasHeight / 2, 'dudeShip')
            .setScale(0.18)
            .setDepth(2)

        this.circleTrace = this.add.graphics();

        this.circleTrace.lineStyle(2, 0x293133);
        this.circleTrace.strokeCircle(
            this.canvasWidth / 2, // x centro
            this.canvasHeight / 2, // y centro
            this.raggio // raggio
        );

        // this.mapSounds.get("bg_funk").play()
        this.SoundsManager.playSound("bg_funk")
    }

    update(time, delta) {

        this.rotateBoss()
        this.checkCursorInput(delta)
        this.bossAttacks(delta)

        // check if one of the bullets hits the dudeship
        this.checkCollisionDude_bean()
        this.checkCollisionDude_flames()
        this.rechargeTurbo(delta)
    }

    rechargeTurbo(delta) {

        this.deltaRechargeTurbo += delta;

        if (this.HasTurboNeedRecharge && this.deltaRechargeTurbo >= 100) {
            this.turboUpperBar.width++
            this.deltaRechargeTurbo = 0
        }

        if (this.turboUpperBar.width >= 50) {
            this.turboUpperBar.width = 50
            this.HasTurboNeedRecharge = false
        }

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
                console.log("dude subisce danni dai bean proiettili!!")

            }
        })
    }

    checkCollisionDude_flames() {
        this.flameGroup.children.iterate(flame => {
            if (this.checkCollision_general(flame, this.dudeShip)) {
                console.log("dude subisce danni dalla fiamma!!")
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

            if (n > 0.5) this.laserBeans()
            if (n <= 0.5) this.laserSemicircles()

        }
    }

    laserSemicircles() {

        this.isBossAttacking = true;
        this.showDamagingArea()

    }

    addDamageToSelectedArea(startAngle, endAngle) {
// fill the circumference portion with flames that damage the dudeship
        for (let i = startAngle; i <= endAngle; i += Phaser.Math.DegToRad(3)) {
            let x = this.canvasWidth / 2 + this.raggio * Math.cos(i);
            let y = this.canvasHeight / 2 + this.raggio * Math.sin(i);

            const flame = this.physics.add.sprite(x, y, "flame_spriteSheet").play("flameBurning")
                .setScale(0.4)
            this.flameGroup.add(flame, true)
        }

        this.time.addEvent({
            delay: 1500,
            callback: () => {

                this.flameGroup.clear(true, true)
                this.isBossAttacking = false
            }
        })

    }

    showDamagingArea() {

        let dudeShipX = this.dudeShip.x - this.canvasWidth / 2;
        let dudeShipY = this.dudeShip.y - this.canvasHeight / 2;
        let angle = Math.atan2(dudeShipY, dudeShipX); // ordine corretto
        let n1 = Math.floor(Math.random() * (250 - 50 + 1) + 50);

        let circumferenceStartingAngle = angle - Phaser.Math.DegToRad(35);
        let circumferenceEndAngle = angle + Phaser.Math.DegToRad(n1);


        const red = 0xff0000
        const orange = 0xfe4c10

        this.showRed(circumferenceEndAngle, circumferenceStartingAngle, red)

        let totalExec = 0

        this.time.addEvent({
            delay: 300,
            repeat: 4,
            callback: () => {
                totalExec++
                console.log("Callback eseguito"); // Aggiungi questo per vedere se viene chiamato
                if (this.semicircleTrace === this.REDTRACE) {
                    this.showOrange(circumferenceEndAngle, circumferenceStartingAngle, orange)
                } else {
                    this.showRed(circumferenceEndAngle, circumferenceStartingAngle, red)
                }

                if (totalExec === 5) {
                    this.addDamageToSelectedArea(circumferenceStartingAngle, circumferenceEndAngle)
                }
            },

        })

    }

    showRed(circumferenceDamage, startingAngle, color) {
        this.semicircleTrace = this.REDTRACE
        this.createSemicircunference(circumferenceDamage, startingAngle, color)
    }

    showOrange(circumferenceDamage, startingAngle, color) {
        this.semicircleTrace = this.BLACKTRACE
        this.createSemicircunference(circumferenceDamage, startingAngle, color)
    }

    createSemicircunference(endingAngle, startingAngle, color) {

        this.semicircle = this.add.graphics()
        this.semicircle.lineStyle(20, color) // red
        this.semicircle.arc(
            this.canvasWidth / 2,
            this.canvasHeight / 2,
            this.raggio,
            startingAngle,
            endingAngle,
            false
        )

        this.semicircle.strokePath();

        // after the semicircunference is created, because it's a graphics must be deleted after each draw
        // so after render every semicirc call a delayed event  to destroy the semicircle graphic
        this.time.addEvent({
            delay: 200,
            callback: () => {
                this.semicircle.clear();
                this.semicircle.destroy()
                this.semicircle = null
            }
        })
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

    calculateX() {
        return (this.canvasWidth / 2) + this.raggio * Math.cos(this.angolo);

    }

    calculateY() {
        return this.canvasHeight / 2 + this.raggio * Math.sin(this.angolo);
    }

    checkCursorInput(delta) {

        let x;
        let y;

        if (this.cursor.right.isDown) {
            this.angolo += this.velAngolare * (this.turbo ? 3 : 1) * (delta / 1000);
            x = this.calculateX()
            y = this.calculateY()
            this.dudeShip.setPosition(x, y);
        }

        if (this.cursor.left.isDown) {
            this.angolo -= this.velAngolare * (this.turbo ? 3 : 1) * (delta / 1000);
            x = this.calculateX()
            y = this.calculateY()
            this.dudeShip.setPosition(x, y);
        }

        if (this.keySpace.isDown && this.turboUpperBar.width >= 1) {

            this.turbo = true
            this.turboUpperBar.width -= 0.58
            this.HasTurboNeedRecharge = true

            let cloud = this.add.sprite(x, y, "boost_cloud").play("accelerationBoost")

            this.boostCloud_group.add(cloud, true)

            this.boostCloud_group.children.iterate(boost => {
                boost.on('animationcomplete', () => {
                    boost.destroy();
                });
            })

        } else {
            this.turbo = false
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