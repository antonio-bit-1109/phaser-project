export class PingPong extends Phaser.Scene {

    BALLVELOCITY = 280
    GAMEDIFFICULTY = null
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
    scoreLine0 = null;
    scoreLine1 = null;
    backGroundMusic = null;
    computing = false;
    bossInterceptingBall = false;


    constructor() {
        super("pingpong");
    }

    init(data) {
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
        this.gameName = data.gameName
        this.GAMEDIFFICULTY = data.gameDifficulty
    }

    preload() {

        this.load.image("bg_space", "assets/pingpong/images/spaceField.png")
        this.load.image("dudeShip", "assets/pingpong/images/dude_ping_pong.png")
        this.load.image("bossShip", "assets/pingpong/images/boss_ping_pong.png")
        this.load.image("ball", "assets/pingpong/images/pingpongBall.png")


        this.load.audio("bg_music_pingPong", "assets/pingpong/sounds/bg_groove.mp3")
        this.load.audio("crowd_gol", "assets/pingpong/sounds/crowd_gool.mp3")
    }

    create() {

        this.backGroundMusic = this.sound.add("bg_music_pingPong", {
            loop: true,
            volume: 1
        });
        this.backGroundMusic.play();
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

        this.scoreLine0 = this.add.rectangle(
            0,
            this.canvasHeight / 2,
            10,
            this.canvasHeight,
            0x00ff00)
            .setOrigin(0.5, 0.5)

        this.scoreLine1 = this.add.rectangle(
            this.canvasWidth,
            this.canvasHeight / 2,
            10,
            this.canvasHeight,
            0xFF0000)
            .setOrigin(0.5, 0.5)

        this.physics.add.existing(this.scoreLine0, true);
        this.physics.add.existing(this.scoreLine1, true);
    }

    update(delta, time) {

        if (this.isFirstStart || this.ballSpin <= 0.5) {
            this.ballRotateRight()
        } else {
            this.ballRotateLeft()
        }

        this.checkCursorInput()
        this.isScoreMade()
        this.isOpponentInterceptingBall()
    }

    isOpponentInterceptingBall() {

        switch (this.GAMEDIFFICULTY) {

            case "EASY" :
                this.easyMode(this.GAMEDIFFICULTY)
                break;
            case "MEDIUM" :
                this.mediumMode(this.GAMEDIFFICULTY)
                break;
            case "HARD" :
                this.hardMode(this.GAMEDIFFICULTY)
                break;
        }

    }

    isBallInBossSide() {
        return this.ball.x > this.canvasWidth / 2 && this.ball.x < this.canvasWidth - 50
    }

    interceptBall(difficulty) {

        if (this.isBallInBossSide()
            //&& !this.computing
        ) {
            console.log("start computing")
            this.startComputing(difficulty)
        }

    }

    startComputing(difficulty) {
        //this.computing = true;
        let v = Math.random()
        console.log(v)

        if (difficulty === "EASY" && v < 0.5) {
            this.bossInterceptingBall = true
            this.bossShip.body.immovable = false;
            // durante il tween viene spostato lo sprite ma non il suo body
            // collisione success
            // rimbalzo fail
            if (this.canvasWidth - this.ball.x <= 400) {
                console.log("palla abbastanza vicina - attivazione tween");

                this.tweens.add({
                    targets: this.bossShip,
                    y: this.ball.body.y,
                    duration: 200,
                    ease: "Linear",
                    onUpdate: () => {
                        this.bossShip.body.y = this.bossShip.y - this.bossShip.displayHeight / 2;
                        if (this.checkCollision_general(this.ball, this.bossShip)) {
                            this.invertBallVelocity()
                        }
                    },
                    onComplete: () => {
                        this.bossShip.setPosition(this.canvasWidth - 100, this.canvasHeight / 2);
                        this.bossShip.body.reset(this.canvasWidth - 100, this.canvasHeight / 2);
                        this.bossShip.body.immovable = true;
                        this.bossInterceptingBall = false;
                    }
                });
            }
        }
    }

    invertBallVelocity() {
        // Prendi la velocità attuale della palla
        let vx = this.ball.body.velocity.x;
        let vy = this.ball.body.velocity.y;

        // Inverti la direzione X (rimbalzo orizzontale)
        vx = -vx;

        // Eventualmente aggiungi un po' di variazione verticale per rendere il gioco meno prevedibile
        vy += (Math.random() - 0.5) * 100; // piccolo scostamento casuale

        // Imposta la nuova velocità alla palla
        this.ball.body.setVelocity(vx, vy);
    }

    easyMode(difficulty) {
        this.interceptBall(difficulty)
    }

    mediumMode(difficulty) {
        this.interceptBall(difficulty)
    }

    hardMode(difficulty) {
        this.interceptBall(difficulty)
    }

    isScoreMade() {
        // boss has made a point
        if (this.checkCollision_general(this.ball, this.scoreLine0)) {
            let numberFormat = parseInt(this.bossPoints) + 1
            this.bossPoints = numberFormat.toString()
            this.updateVisualScore(this.bossPoints_Ref, this.bossPoints)
            this.ball.body.moves = false;
            this.sound.add("crowd_gol").play()

            this.time.delayedCall(2000, () => {
                this.resetBall()
                this.ball.body.moves = true;
            })


        }

        // dude has made a point
        if (this.checkCollision_general(this.ball, this.scoreLine1)) {
            let numberFormat = parseInt(this.dudePoints) + 1
            this.dudePoints = numberFormat.toString()
            this.updateVisualScore(this.dudePoints_Ref, this.dudePoints)
            this.ball.body.moves = false;
            this.sound.add("crowd_gol").play()

            this.time.delayedCall(2000, () => {
                this.resetBall()
                this.ball.body.moves = true;
            })
        }

    }

    updateVisualScore(ref, newPoints) {
        ref.setText(newPoints)
    }

    resetBall() {
        this.isFirstStart = true;
        this.ball.setPosition(this.canvasWidth / 2, this.canvasHeight / 2)

        let direction = Math.random();
        this.ball.setVelocity(direction <= 0.5 ? this.BALLVELOCITY : this.BALLVELOCITY - (this.BALLVELOCITY * 2))
    }

    checkCollision_general(p1, p2) {
        if (p1 && p2 && this.physics.overlap(p1, p2)) {
            return true;
        }
    }

    onBallCollided() {
        this.isFirstStart = false;
        this.ballSpin = Math.random()

        this.ball.setVelocity(this.BALLVELOCITY)

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
}