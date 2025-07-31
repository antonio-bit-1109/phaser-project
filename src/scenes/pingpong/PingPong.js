export class PingPong extends Phaser.Scene {

    canvasWidth = null;
    canvasHeight = null;
    gameName = null;
    bg = null;
    dudeShip = null;
    bossShip = null;
    ball = null
    cursor = null
    ballSpin = null;
    isFirstStart = true;
    dudePoints_Ref = null;
    bossPoints_Ref = null;
    dudePoints = "0";
    bossPoints = "0"


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

        this.dudePoints_Ref = this.add.text((this.canvasWidth / 2) - 80, 50, this.dudePoints)
            .setScale(4)

        this.bossPoints_Ref = this.add.text((this.canvasWidth / 2) + 45, 50, this.bossPoints)
            .setScale(4)


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
            .setVelocityX(-220)

        this.physics.add.collider(this.dudeShip, this.ball, this.onBallCollided, null, this);
        this.physics.add.collider(this.bossShip, this.ball, this.onBallCollided, null, this);
    }

    update(delta, time) {

        if (this.isFirstStart || this.ballSpin <= 0.5) {
            this.ballRotateRight()
        } else {
            this.ballRotateLeft()
        }

        this.checkCursorInput()
        
    }

    onBallCollided() {
        this.isFirstStart = false;
        this.ballSpin = Math.random()

        this.ball.setVelocity(220)
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