export class PingPong extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    bg = null;
    dudeShip = null;
    bossShip = null;
    ball = null
    cursor = null
    ballSpin = Math.random()
    isFirstStart = true;

    constructor() {
        super("pingpong");
    }

    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
        this.gameName = data.gameName
    }

    preload() {

        this.load.image("bg_space", "assets/pingpong/spaceField.png")
        this.load.image("dudeShip", "assets/pingpong/dude_ping_pong.png")
        this.load.image("bossShip", "assets/pingpong/boss_ping_pong.png")
        this.load.image("ball", "assets/pingpong/pingpongBall.png")
    }

    create() {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.bg = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "bg_space")

        this.dudeShip = this.physics.add.sprite(100, this.canvasHeight / 2, "dudeShip")
            .setRotation(Phaser.Math.DegToRad(-90))
            .setSize(300, 300)
            .setDisplaySize(100, 100)

        this.dudeShip.body.immovable = true;

        this.bossShip = this.physics.add.sprite(this.canvasWidth - 100, this.canvasHeight / 2, "bossShip")
            .setRotation(Phaser.Math.DegToRad(90))
            .setSize(300, 300)
            .setDisplaySize(100, 100)

        this.bossShip.body.immovable = true;

        this.ball = this.physics.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2, "ball")
            .setScale(0.1)
            .setBounce(1, 1)
            .setCollideWorldBounds(true)
            .setVelocityX(-150)

        this.physics.add.collider(this.dudeShip, this.ball, this.onBallCollided, null, this);
        this.physics.add.collider(this.bossShip, this.ball, this.onBallCollided, null, this);
    }

    update(delta, time) {

        this.ballRotateRight()

        this.checkCursorInput()
       

    }

    onBallCollided() {
        // this.ballSpin = Math.random()
        // console.log(this.ballSpin)
    }

    ballRotateRight() {
        this.ball.rotation += 0.1
    }

    ballRotateLeft() {
        this.ball.rotation -= 0.1
    }

    checkCursorInput() {
        if (this.dudeShip.y <= 80) {
            this.dudeShip.setVelocityY(0)
        }

        if (this.dudeShip.y >= this.canvasHeight - 80) {
            this.dudeShip.setVelocityY(0)
        }

        if (this.cursor.up.isDown) {
            this.dudeShip.setVelocityY(-200)

        }

        if (this.cursor.down.isDown) {
            this.dudeShip.setVelocityY(200)

        }

    }

    startBallMove() {

    }
}