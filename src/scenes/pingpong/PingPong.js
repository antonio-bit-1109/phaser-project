export class PingPong extends Phaser.Scene {

    BALLVELOCITY = 300
    GAMEDIFFICULTY = null
    MAX_BALL_SPEED = 600;
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
    bossInterceptingBall = false;
    btnHome_Ref = null;
    resetball_btn_ref = null;
    difficultyParams = {
        tweenDuration: {easy: 500, medium: 400, hard: 300},
        yVariation: {easy: 0.5, medium: 0.7, hard: 1},
        incrementV: {easy: 1, medium: 1.05, hard: 1.10},
    }
    isBorderDownReached = false;
    isBorderUpReached = false;
    soundsMap = new Map()
    isBallTouchingScoreline = false;
    fogMode = false
    countFog = 0

    constructor() {
        super("pingpong");
    }

    init(data) {
        this.fogMode = false;
        this.countFog = 0
        this.dudePoints = "0";
        this.bossPoints = "0"
        this.canvasWidth = data.canvasWidth
        this.canvasHeight = data.canvasHeight
        this.gameName = data.gameName
        this.GAMEDIFFICULTY = this.checkIfFogMode(data.gameDifficulty)
        this.isBallTouchingScoreline = false;
    }

    checkIfFogMode(gameDifficultyString) {
        console.log(gameDifficultyString)

        if (gameDifficultyString.includes("-")) {
            this.fogMode = true;
            console.log("modalità fog of war")
            let s = gameDifficultyString.indexOf("-")
            return gameDifficultyString.substring(0, s)
        }

        return gameDifficultyString
    }

    preload() {
        this.load.image("bg_space", "assets/pingpong/images/spaceField.png")
        this.load.image("dudeShip", "assets/pingpong/images/dude_ping_pong.png")
        this.load.image("bossShip", "assets/pingpong/images/boss_ping_pong.png")
        this.load.image("ball", "assets/pingpong/images/pingpongBall.png")
        this.load.image("home_btn", "assets/bombburner/images/btn_sfondo.png")
        this.load.image("fog0", "assets/pingpong/images/fog0.png")
        this.load.image("reset_ball_btn", "assets/common/images/reset_btn.png")


        this.load.audio("bg_music_pingPong", "assets/pingpong/sounds/bg_groove.mp3")
        this.load.audio("crowd_gol", "assets/pingpong/sounds/crowd_gool.mp3")
        this.load.audio("boing0", "assets/pingpong/sounds/boing0.mp3")
    }

    create() {
        console.log(this.GAMEDIFFICULTY)
        console.log(this.fogMode)

        this.soundsMap.set("bg_music_pingPong", this.sound.add("bg_music_pingPong"))
        this.soundsMap.set("crowd_gol", this.sound.add("crowd_gol"))
        this.soundsMap.set("boing0", this.sound.add("boing0"))

        this.soundsMap.get("bg_music_pingPong").play()

        this.resetball_btn_ref = this.add.image(this.canvasWidth / 1.2, 50, "reset_ball_btn")
            .setDepth(12)
            .setScale(0.5)
            .setInteractive({cursor: "pointer"})
            .on("pointerdown", () => {
                this.resetBall()
            })

        this.btnHome_Ref = this.add.image(this.canvasWidth / 1.1, 50, "home_btn")
            .setDepth(12)
            .setScale(0.5)
            .setInteractive({cursor: "pointer"})
            .on("pointerdown", () => {
                this.sound.stopAll()
                this.scene.stop("pingpong");
                this.scene.start("startmenu")
            })

        this.cursor = this.input.keyboard.createCursorKeys();
        this.bg = this.add.image(this.canvasWidth / 2, this.canvasHeight / 2, "bg_space")

        this.dudePoints_Ref = this.add.text((this.canvasWidth / 2) - 80, 50, this.dudePoints)
            .setScale(4)
            .setDepth(11)

        this.bossPoints_Ref = this.add.text((this.canvasWidth / 2) + 45, 50, this.bossPoints)
            .setScale(4)
            .setDepth(11)


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

        this.physics.add.collider(this.dudeShip, this.ball, () => {
            this.onBallCollided(this.GAMEDIFFICULTY)
        }, null, this);

        this.scoreLine0 = this.add.rectangle(
            0,
            this.canvasHeight / 2,
            50,
            this.canvasHeight,
            0x00ff00)
            .setOrigin(0.5, 0.5)

        this.scoreLine1 = this.add.rectangle(
            this.canvasWidth,
            this.canvasHeight / 2,
            50,
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

        this.addFogOfWar("fog0")


        this.checkCursorInput()
        this.isScoreMade()
        this.isOpponentInterceptingBall()
        this.isGameEnded()

    }

    addFogOfWar(textureName) {
        if (this.fogMode && this.countFog < 20) {
            this.countFog++
            this.add
                .image(this.canvasWidth / 1.35, this.canvasHeight / 2, textureName)
                .setDepth(10)
                .setScale(2)
                .setRotation(Phaser.Math.DegToRad(270))
        }
    }

    isGameEnded() {
        if (parseInt(this.bossPoints) >= 5 || parseInt(this.dudePoints) >= 5) {
            this.sound.stopAll()
            this.scene.stop("pingpong")
            this.scene.start("gameover", {
                canvasWidth: this.canvasWidth,
                canvasHeigth: this.canvasHeight,
                isGameVictory: parseInt(this.dudePoints) >= 5,
                gameName: this.gameName,
                sceneName: this.scene.key,
                punteggioFinale: `${this.dudePoints}/${this.bossPoints}`,
                gameDifficult: this.GAMEDIFFICULTY,
                fogModeOn: this.fogMode
            })

        }
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

        if (this.isBallInBossSide()) {
            this.startComputing(difficulty)
        }

    }

    startComputing(difficulty) {

        this.bossInterceptingBall = true
        this.bossShip.body.immovable = false;

        if (this.canvasWidth - this.ball.x <= 400) {

            this.tweens.add({
                targets: this.bossShip,
                y: this.ball.body.y,
                duration:
                    difficulty === "EASY" && this.difficultyParams.tweenDuration.easy ||
                    difficulty === "MEDIUM" && this.difficultyParams.tweenDuration.medium ||
                    difficulty === 'HARD' && this.difficultyParams.tweenDuration.hard
                ,
                ease: "Linear",
                onUpdate: () => {
                    this.bossShip.body.y = this.bossShip.y - this.bossShip.displayHeight / 2;
                    if (this.checkCollision_general(this.ball, this.bossShip) && !this.isBallTouchingScoreline) {
                        this.playSoundIfNotAlreadyPlayed("boing0")
                        this.invertBallVelocity(difficulty, 250)
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


    returnControlledVectorialSpeed(vx, vy) {
        // teorema pitagora per calcolare spostamento diagonale data la velocità x e y della palla
        const speed = Math.sqrt(vx * vx + vy * vy)

        // controllo se la velocità è superiore a quella massima e in caso decremento
        if (speed > this.MAX_BALL_SPEED) {
            const factor = this.MAX_BALL_SPEED / speed
            return {vx: vx * factor, vy: vy * factor}
        }

        return {vx, vy}
    }

    invertBallVelocity(difficulty, addedVelocity) {

        // Prendi la velocità attuale della palla
        let vx = this.ball.body.velocity.x;
        let vy = this.ball.body.velocity.y;

        if (vx < 200) {
            vx += addedVelocity
        }
        if (vy < 200) {
            vy += addedVelocity
        }

        // Inverti la direzione X (rimbalzo orizzontale)
        vx = -vx;

        // Eventualmente aggiungi un po' di variazione verticale per rendere il gioco meno prevedibile
        vy += (Math.random() - this.returnYVariation(difficulty)) * 100; // piccolo scostamento casuale

        let obj = this.returnControlledVectorialSpeed(vx, vy)
        // Imposta la nuova velocità alla palla
        this.ball.body.setVelocity(
            this.returnIncrement(obj.vx, difficulty),
            this.returnIncrement(obj.vy, difficulty)
        );
    }

    returnIncrement(ax, difficulty) {
        return ax * (difficulty === "EASY" && this.difficultyParams.incrementV.easy ||
            difficulty === "MEDIUM" && this.difficultyParams.incrementV.medium ||
            difficulty === "HARD" && this.difficultyParams.incrementV.hard
        )
    }

    returnYVariation(difficulty) {
        return difficulty === "EASY" && this.difficultyParams.yVariation.easy ||
            difficulty === "MEDIUM" && this.difficultyParams.yVariation.medium ||
            difficulty === "HARD" && this.difficultyParams.yVariation.hard
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
            this.isBallTouchingScoreline = true
            let numberFormat = parseInt(this.bossPoints) + 1
            this.bossPoints = numberFormat.toString()
            this.updateVisualScore(this.bossPoints_Ref, this.bossPoints)
            this.ball.body.moves = false;
            this.soundsMap.get("crowd_gol").play();


            this.time.delayedCall(2000, () => {
                this.resetBall()
                this.ball.body.moves = true;
            })


        }

        // dude has made a point
        if (this.checkCollision_general(this.ball, this.scoreLine1)) {
            this.isBallTouchingScoreline = true
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

        let directionX = Math.random();
        let directionY = Math.random();
        this.ball.setVelocityY(directionY < 0.5 ? this.BALLVELOCITY : -this.BALLVELOCITY);
        this.ball.setVelocityX(directionX < 0.5 ? this.BALLVELOCITY : -this.BALLVELOCITY);
        this.isBallTouchingScoreline = false
    }

    checkCollision_general(p1, p2) {
        if (p1 && p2 && this.physics.overlap(p1, p2)) {
            return true;
        }
    }

    playSoundIfNotAlreadyPlayed(key) {

        if (this.soundsMap.get(key) && !this.soundsMap.get(key).isPlaying) {
            this.soundsMap.get(key).play();
        }

    }


    onBallCollided(difficulty) {

        this.playSoundIfNotAlreadyPlayed("boing0")
        this.isFirstStart = false;
        this.ballSpin = Math.random()

        let incrementV =
            difficulty === "EASY" && this.difficultyParams.incrementV.easy ||
            difficulty === "MEDIUM" && this.difficultyParams.incrementV.medium ||
            difficulty === "HARD" && this.difficultyParams.incrementV.hard

        let vx = this.ball.body.velocity.x;
        let vy = this.ball.body.velocity.y;

        let obj = this.returnControlledVectorialSpeed(vx * incrementV, vy * incrementV)

        this.ball.setVelocity(obj.vx, obj.vy)
    }

    ballRotateRight() {
        this.ball.rotation += 0.1
    }

    ballRotateLeft() {
        this.ball.rotation -= 0.1
    }


    checkCursorInput() {

        // dude is bottom Y
        if (this.dudeShip.body.y >= this.canvasHeight - 90) {
            this.isBorderDownReached = true;
            this.dudeShip.setVelocityY(0)
        }

        // dude is top Y
        if (this.dudeShip.body.y <= 10) {
            this.isBorderUpReached = true;
            this.dudeShip.setVelocityY(0)
        }

        if (this.cursor.up.isDown && !this.isBorderUpReached) {
            this.isBorderDownReached = false
            this.isBorderUpReached = false
            this.dudeShip.setVelocityY(-250)

        }

        if (this.cursor.down.isDown && !this.isBorderDownReached) {
            this.isBorderDownReached = false
            this.isBorderUpReached = false
            this.dudeShip.setVelocityY(250)

        }

    }
}