export class CircleOfDeath extends Phaser.Scene {

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
        this.load.spritesheet("boost_cloud", "assets/circleofdeath/images/boost_cloud.png", {
            frameWidth: 64, frameHeight: 64
        })


        this.load.audio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")

    }


    create() {

        this.boostCloud_group = this.add.group()
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
            .setScale(0.3)
            .setDepth(2)

        this.circleTrace = this.add.graphics();
        this.innerShadow = this.add.graphics()
        this.outerlight = this.add.graphics()

        this.circleTrace.lineStyle(2, 0x293133);
        this.circleTrace.strokeCircle(
            this.canvasWidth / 2, // x centro
            this.canvasHeight / 2, // y centro
            this.raggio // raggio
        );

        this.mapSounds.get("bg_funk").play()

        this.showFunkyPose()
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

    update(time, delta) {

        this.rotateBoss()
        this.checkCursorInput(delta)

    }

    rotateBoss() {
        this.boss.body.rotation += 0.5
    }

    showFunkyPose() {
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                this.boss.setTexture("circular_boss_funky_pose")
                this.resetTexture(this.boss, "circular_boss")
            }

        });
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
            this.turbo = true
        }


        if (this.turbo) {

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

            this.time.addEvent({
                delay: 800,
                callback: () => {
                    this.turbo = false
                }
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