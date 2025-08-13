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


        this.load.audio("bg_funk", "assets/circleofdeath/sounds/funk.mp3")

    }


    create() {

        this.mapSounds.set("bg_funk", this.sound.add("bg_funk", {
            volume: 2
        }))

        this.moonSurface = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "moon_surface")
            .setScale(0.5)

        this.boss = this.physics.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2, "circular_boss")
            .setScale(0.2)

        this.dudeShip = this.physics.add.sprite((this.canvasWidth / 2) + this.raggio, this.canvasHeight / 2, 'dudeShip')
            .setScale(0.3)

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
        // this.rotateDude(delta)

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

    rotateDudeRight() {
    }

    rotateDudeLeft() {
    }

    // rotateDude(delta) {
    //     // Aggiorna l'angolo in base al tempo trascorso
    //     this.angolo += this.velAngolare * (delta / 1000);
    //
    //     // Calcola la nuova posizione
    //     let x = (this.canvasWidth / 2) + this.raggio * Math.cos(this.angolo);
    //     let y = this.canvasHeight / 2 + this.raggio * Math.sin(this.angolo);
    //     this.dudeShip.setPosition(x, y);
    //
    // }
}