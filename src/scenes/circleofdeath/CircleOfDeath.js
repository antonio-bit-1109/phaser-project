import {SoundsManager} from "./managers/SoundsManager";
import {BossManager} from "./entity/BossManager";
import {costanti} from "./constants/costanti";

export class CircleOfDeath extends Phaser.Scene {
    
    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    moonSurface = null;
    dudeShip = null
    angolo = 0;
    velAngolare = Math.PI / 3; // 90° al secondo
    cursor = null
    circleTrace = null
    keySpace = null
    turbo = false
    boostCloud_group = null
    turboLowBar = null;
    turboUpperBar = null
    HasTurboNeedRecharge = false
    deltaRechargeTurbo = 0


    constructor() {
        super("circleofdeath");
        this.soundManager = new SoundsManager(this)
        this.bossManager = new BossManager(this, this.soundManager)
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

        this.turboLowBar = this.add.rectangle(this.canvasWidth / 12, this.canvasHeight / 12, 50, 20, 0xff0000, 1)
            .setDepth(3)

        this.turboUpperBar = this.add.rectangle(this.canvasWidth / 12, this.canvasHeight / 12, 50, 20, 0x0000FF, 1)
            .setDepth(3)

        this.boostCloud_group = this.add.group()

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

        this.dudeShip = this.physics.add.sprite((this.canvasWidth / 2) + costanti.raggio, this.canvasHeight / 2, 'dudeShip')
            .setScale(0.18)
            .setDepth(2)

        this.circleTrace = this.add.graphics();

        this.circleTrace.lineStyle(2, 0x293133);
        this.circleTrace.strokeCircle(
            this.canvasWidth / 2, // x centro
            this.canvasHeight / 2, // y centro
            costanti.raggio // raggio
        );

        // this.mapSounds.get("bg_funk").play()
        this.soundManager.playSound("bg_funk")
    }

    update(time, delta) {

        // this.rotateBoss()
        this.bossManager.update(delta, this.dudeShip)

        this.checkCursorInput(delta)
        // this.bossAttacks(delta)

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


    checkCollisionDude_bean() {


        this.bossManager.getLaserBeanGroup().children.iterate(bean => {
            if (this.checkCollision_general(bean, this.dudeShip)) {
                bean.destroy()
                console.log("dude subisce danni dai bean proiettili!!")

            }
        })
    }

    checkCollisionDude_flames() {
        this.bossManager.getFlameGroup().children.iterate(flame => {
            if (this.checkCollision_general(flame, this.dudeShip)) {
                console.log("dude subisce danni dalla fiamma!!")
            }
        })
    }

    checkCollision_general(p1, p2) {
        if (p1 && p2 && this.physics.overlap(p1, p2)) {
            return true;
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