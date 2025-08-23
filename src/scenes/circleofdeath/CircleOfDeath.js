import {SoundsManager} from "./managers/SoundsManager";
import {BossManager} from "./entity/BossManager";
import {calculatePointCircumference_X, calculatePointCircumference_Y, costanti} from "./constants/costanti";
import {DudeShipManager} from "./entity/DudeShipManager";
import {AmbientManager} from "./entity/AmbientManager";

export class CircleOfDeath extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    circleTrace = null
    firstCollisionHappened = false


    constructor() {
        super("circleofdeath");
        this.soundManager = new SoundsManager(this)
        this.bossManager = new BossManager(this, this.soundManager)
        this.dudeShipManager = new DudeShipManager(this)
        this.ambientManager = new AmbientManager(this, this.dudeShipManager)
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
        this.load.image("rifleAim", "assets/circleofdeath/images/rifleAim_0.png")

        this.load.spritesheet("boost_cloud", "assets/circleofdeath/images/boost_cloud.png", {
            frameWidth: 64, frameHeight: 64
        })

        this.load.spritesheet('flame_spriteSheet', "assets/bombburner/images/bullet_2.png", {
            frameHeight: 151, frameWidth: 93
        })

        this.load.spritesheet("heartsSpriteSheet", "assets/circleofdeath/images/heart_animated_2.png", {
            frameHeight: 17, frameWidth: 17
        })

        this.load.spritesheet("explosion_2", "assets/circleofdeath/images/explosion.png", {
            frameWidth: 128, frameHeight: 128
        })

        this.load.audio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")
        this.load.audio("alarm", "assets/circleofdeath/sounds/alarm.mp3")
        this.load.audio("fireBurning", "assets/circleofdeath/sounds/fireBurning.mp3")
        this.load.audio("laserBeanRelease", "assets/circleofdeath/sounds/laserBeansSound.mp3")
        this.load.audio("dudeShipDamaged", "assets/circleofdeath/sounds/dudeShipDamaged.mp3")
        this.load.audio("teleportSound", "assets/circleofdeath/sounds/teleport.mp3")
        this.load.audio("bombExplosion", "assets/circleofdeath/sounds/bombExplosion.mp3")
    }


    create() {

        this.bossManager.create(this.canvasWidth, this.canvasHeight)
        this.dudeShipManager.create(this.canvasWidth, this.canvasHeight)
        this.ambientManager.create(this.canvasWidth, this.canvasHeight)
        this.ambientManager.addImage(
            this.canvasWidth,
            this.canvasHeight,
            "moon_surface",
            -1,
            0.5,
            this.ambientManager.getMoonSurface()
        )


        this.createAnimation("accelerationBoost", "boost_cloud", 0, 8, 25, 0)
        this.createAnimation("flameBurning", "flame_spriteSheet", 0, 4, 20, -1)

        this.createAnimation("hFull", "heartsSpriteSheet", 0, 0, 20, 0);
        this.createAnimation("h3/4", "heartsSpriteSheet", 1, 1, 20, 0);
        this.createAnimation("h2/4", "heartsSpriteSheet", 2, 2, 20, 0);
        this.createAnimation("h1/4", "heartsSpriteSheet", 3, 3, 20, 0);
        this.createAnimation("h0", "heartsSpriteSheet", 4, 4, 20, 0);

        this.createAnimation("f0", "explosion_2", 0, 0, 20, 0)
        this.createAnimation("f1", "explosion_2", 1, 11, 15, 0)


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

        this.soundManager.addAudio("laserBeanRelease", {
            volume: 1
        })

        this.soundManager.addAudio("dudeShipDamaged", {
            volume: 1
        })

        this.soundManager.addAudio("teleportSound", {
            volume: 1
        })

        this.soundManager.addAudio("bombExplosion", {
            volume: 1
        })


        this.circleTrace = this.add.graphics();

        this.circleTrace.lineStyle(2, 0x293133);
        this.circleTrace.strokeCircle(
            this.canvasWidth / 2, // x centro
            this.canvasHeight / 2, // y centro
            costanti.raggio // raggio
        );

        this.soundManager.playSound("bg_funk")


        this.physics.add.overlap(this.dudeShipManager.getDudeShip(), this.bossManager.getFlameGroup(), this.handleCollisionDudeFlame, this.canDudeTakeDamage, this)
        this.physics.add.overlap(this.dudeShipManager.getDudeShip(), this.bossManager.getLaserBeanGroup(), this.handleCollisionDudeBean, this.canDudeTakeDamage, this)
        this.physics.add.overlap(this.dudeShipManager.getDudeShip(), this.bossManager.getExplosionsGroup(), this.handleCollisionDudeExplosion, this.canDudeTakeDamage, this)

    }

    update(time, delta) {

        this.bossManager.update(delta, this.dudeShipManager.getDudeShip())
        this.dudeShipManager.update(delta)
        this.ambientManager.update(delta)

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
            this.dudeShipManager.setHpBasedOnHpPiece()
            this.soundManager.playSound("dudeShipDamaged")
            // logica per arrecare danno al dude da aggiungere
            this.time.delayedCall(2200, () => {
                this.firstCollisionHappened = false
                this.dudeShipManager.setInvincible(false)
            })

        }
    }

    handleCollisionDudeExplosion(dudeship, expl) {

        // damage from explosion is only taken when the explosion animation start, the "f1" animation
        if (!this.firstCollisionHappened && expl.anims.currentAnim.key !== "f0") {
            console.log("dude subisce danni dall esplosione!!")
            this.firstCollisionHappened = true
            this.dudeShipManager.setInvincible(true)
            this.dudeShipManager.setHpBasedOnHpPiece()
            this.soundManager.playSound("dudeShipDamaged")
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
            this.dudeShipManager.setHpBasedOnHpPiece()
            this.soundManager.playSound("dudeShipDamaged")
            bean.destroy()
            this.time.delayedCall(2200, () => {
                this.firstCollisionHappened = false
                this.dudeShipManager.setInvincible(false)
            })

        }
    }
    
    createAnimation(animName, spritesheetName, start, end, frameRate, repeat) {
        this.anims.create({
            key: animName,
            frames: this.anims.generateFrameNumbers(spritesheetName, {start: start, end: end}),
            frameRate: frameRate,
            repeat: repeat
        })
    }

}