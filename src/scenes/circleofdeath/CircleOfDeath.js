import {SoundsManager} from "./managers/SoundsManager";
import {BossManager} from "./entity/BossManager";
import {costanti} from "./constants/costanti";
import {DudeShipManager} from "./entity/DudeShipManager";

export class CircleOfDeath extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    moonSurface = null;
    // dudeShip = null
    angolo = 0;
    velAngolare = Math.PI / 3; // 90° al secondo
    cursor = null
    circleTrace = null
    keySpace = null
    firstCollisionHappened = false


    constructor() {
        super("circleofdeath");
        this.soundManager = new SoundsManager(this)
        this.bossManager = new BossManager(this, this.soundManager)
        this.dudeShipManager = new DudeShipManager(this)
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
        this.load.image("redBean", "assets/circleofdeath/images/redBean.png")

        this.load.image("dudeShip", "assets/pingpong/images/dude_ping_pong.png")

        this.load.spritesheet("boost_cloud", "assets/circleofdeath/images/boost_cloud.png", {
            frameWidth: 64, frameHeight: 64
        })

        this.load.spritesheet('flame_spriteSheet', "assets/bombburner/images/bullet_2.png", {
            frameHeight: 151, frameWidth: 93
        })

        this.soundManager.loadAudio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")
        this.soundManager.loadAudio("alarm", "assets/circleofdeath/sounds/alarm.mp3")
        this.soundManager.loadAudio("fireBurning", "assets/circleofdeath/sounds/fireBurning.mp3")
    }


    create() {

        this.bossManager.create(this.canvasWidth, this.canvasHeight)
        this.dudeShipManager.create(this.canvasWidth, this.canvasHeight)


        this.cursor = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.createAnimation("accelerationBoost", "boost_cloud", 0, 8, 25, 0)
        this.createAnimation("flameBurning", "flame_spriteSheet", 0, 4, 20, -1)

        this.soundManager.addAudio("bg_funk", {
            volume: 2,
            loop: true
        })

        this.soundManager.addAudio("alarm", {
            volume: 1
        })

        this.soundManager.addAudio("fireBurning", {
            volume: 2
        })

        this.moonSurface = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "moon_surface")
            .setScale(0.5)
            .setDepth(-1)


        this.circleTrace = this.add.graphics();

        this.circleTrace.lineStyle(2, 0x293133);
        this.circleTrace.strokeCircle(
            this.canvasWidth / 2, // x centro
            this.canvasHeight / 2, // y centro
            costanti.raggio // raggio
        );

        // this.mapSounds.get("bg_funk").play()
        this.soundManager.playSound("bg_funk")


        this.physics.add.overlap(this.dudeShipManager.getDudeShip(), this.bossManager.getFlameGroup(), this.handleCollisionDudeFlame, this.canDudeTakeDamage, this)
        this.physics.add.overlap(this.dudeShipManager.getDudeShip(), this.bossManager.getLaserBeanGroup(), this.handleCollisionDudeBean, this.canDudeTakeDamage, this)
    }

    update(time, delta) {

        this.bossManager.update(delta, this.dudeShipManager.getDudeShip())
        this.dudeShipManager.update(delta)
        this.checkCursorInput(delta)

    }

    canDudeTakeDamage() {
        if (this.dudeShipManager.getInvincible()) {
            return false // la collide callback non può essere chiamata - dude è invincibile per 2.2"
        } else {
            return true// la collide callback può essere chiamata - dude non è invincibile
        }

    }

    // to handle the collision between dudeship and a flame
    handleCollisionDudeFlame(dudeShip, flame) {
        if (!this.firstCollisionHappened) {
            console.log("dude subisce danni dalla fiamma!!")
            this.firstCollisionHappened = true
            this.dudeShipManager.setInvincible(true)
            // logica per arrecare danno al dude da aggiungere
            this.time.delayedCall(2200, () => {
                this.firstCollisionHappened = false
                this.dudeShipManager.setInvincible(false)
            })

        }
    }

    handleCollisionDudeBean(dudeShip, bean) {
        if (!this.firstCollisionHappened) {
            console.log("dude subisce danni dai bean proiettili!!")
            this.firstCollisionHappened = true
            this.dudeShipManager.setInvincible(true)
            // logica per arrecare danno al dude da aggiungere
            this.time.delayedCall(2200, () => {
                this.firstCollisionHappened = false
                this.dudeShipManager.setInvincible(false)
            })

        }
    }


    calculateX() {
        return (this.canvasWidth / 2) + costanti.raggio * Math.cos(this.angolo);

    }

    calculateY() {
        return this.canvasHeight / 2 + costanti.raggio * Math.sin(this.angolo);
    }

    checkCursorInput(delta) {

        let x;
        let y;

        if (this.cursor.right.isDown) {
            this.angolo += this.velAngolare * (this.dudeShipManager.getTurbo() ? 3 : 1) * (delta / 1000);
            x = this.calculateX()
            y = this.calculateY()
            this.dudeShipManager.getDudeShip().setPosition(x, y);
        }

        if (this.cursor.left.isDown) {
            this.angolo -= this.velAngolare * (this.dudeShipManager.getTurbo() ? 3 : 1) * (delta / 1000);
            x = this.calculateX()
            y = this.calculateY()
            this.dudeShipManager.getDudeShip().setPosition(x, y);
        }

        if (this.keySpace.isDown && this.dudeShipManager.getTurboUpperBar().width >= 1) {

            this.dudeShipManager.setTurbo(true)
            this.dudeShipManager.getTurboUpperBar().width -= 0.58
            this.dudeShipManager.setHasTurboNeedRecharge(true)

            let cloud = this.add.sprite(x, y, "boost_cloud").play("accelerationBoost")

            this.dudeShipManager.getBoostCloudGroup().add(cloud, true)

            this.dudeShipManager.getBoostCloudGroup().children.iterate(boost => {
                boost.on('animationcomplete', () => {
                    boost.destroy();
                });
            })

        } else {
            this.dudeShipManager.setTurbo(false)
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