import {
    calculatePointCircumference_X,
    calculatePointCircumference_Y,
    costanti, findNotUsedRandomAngle
} from "../constants/costanti";

export class BossManager {

    passingTime = 0
    isBossAttacking = false
    laserBean_group = null;
    rifleAims_Group = null
    flameGroup = null
    semicircle = null
    semicircleTrace = null
    canvasW = null
    canvasH = null
    countDown = "2"
    countDown_text = null
    explosion_group = null
    countDownFunction = null

    constructor(scene, soundsManager) {
        this.boss = null;
        this.scene = scene
        this.soundsManager = soundsManager
    }

    resetDefault() {
        this.passingTime = 0;
        this.isBossAttacking = false;
        this.laserBean_group = null;
        this.rifleAims_Group = null;
        this.flameGroup = null;
        this.semicircle = null;
        this.semicircleTrace = null;
        this.canvasW = null;
        this.canvasH = null;
        this.countDown = "2";
        this.countDown_text = null;
        this.explosion_group = null;
        this.countDownFunction = null;
    }

    // getter
    getLaserBeanGroup() {
        return this.laserBean_group
    }

    getFlameGroup() {
        return this.flameGroup
    }

    getExplosionsGroup() {
        return this.explosion_group
    }

    create(w, h) {
        this.canvasW = w
        this.canvasH = h
        this.flameGroup = this.scene.add.group()
        this.laserBean_group = this.scene.add.group()
        this.rifleAims_Group = this.scene.add.group()
        this.explosion_group = this.scene.add.group()
        this.boss = this.scene.physics.add.sprite(this.canvasW / 2, this.canvasH / 2, "circular_boss")
            .setScale(0.2)
        this.countDown_text = this.scene.add.text(this.canvasW / 18, this.canvasH / 2, this.countDown)
            .setScale(10)
            .setVisible(false)
    }


    // update della classe
    update(delta, dudeship) {
        this.rotateBoss()
        this.bossAttacks(delta, dudeship)
    }


    createBean(key) {
        return this.scene.physics.add.sprite(this.boss.x, this.boss.y, key)
            .setOrigin(0.5, 0.5);
    }

    rotateBoss() {
        this.boss.body.rotation += 0.5
    }

    bossAttacks(delta, dudeship) {

        // accumulate delta (time passed between a frame and the next one)
        this.passingTime += delta;

        //
        if (!this.isBossAttacking && this.passingTime >= 3000) {

            this.passingTime = 0

            let n = Math.random()

            console.log(n)

            if (n < 0.33) this.laserBeans()
            if (n >= 0.33 && n < 0.66) this.laserSemicircles(dudeship)
            if (n >= 0.66) this.detonateBombs()

        }
    }

    detonateBombs() {
        this.isBossAttacking = true;
        const arrPositionsAim = this.showRifleAims()
        this.showCountDownBeforeExplosions(arrPositionsAim)
        this.resetCountDown()

    }

    showRifleAims() {
        let min = costanti.minNumRifleAim;
        let max = costanti.maxNumRifleAim;
        let nAims = Math.floor(Math.random() * (max - min + 1)) + min;

        // // mettere un array per tenere traccia delle posizioni gia presenti prese sulla circonferenza e non creare troppe sovrapposizioni
        const arrPositionsXYAims = []
        const arrAngles = []

        // play sound teleport
        this.soundsManager.playSound("teleportSound")

        for (let i = 0; i < nAims; i++) {

            let safeRandomAngleRad = findNotUsedRandomAngle(arrAngles)
            arrAngles.push(safeRandomAngleRad)

            let config = {
                x: calculatePointCircumference_X(this.canvasW, safeRandomAngleRad),
                y: calculatePointCircumference_Y(this.canvasH, safeRandomAngleRad),
                texture: "rifleAim"
            }
            let aim = this.scene.add.sprite(
                config.x,
                config.y,
                config.texture,
                true
            ).setScale(0.5)


            this.rifleAims_Group.add(aim)
            arrPositionsXYAims.push({x: config.x, y: config.y})

        }

        console.log(arrPositionsXYAims)
        console.log(arrAngles)

        return arrPositionsXYAims
    }

    addExplosions(arrPositionAims) {

        // put an explosion in every position where there is an aim
        // (remove the aim and put an explosion)
        for (let obj of arrPositionAims) {
            let explosion = this.scene.physics.add.sprite(obj.x, obj.y, "explosion_2")
                .setOrigin(0.5, 0.5)
                .setScale(0.6)
                .play("f0")

            this.explosion_group.add(explosion)
        }

        this.scene.time.delayedCall(300, () => {
            this.explosion_group.children.iterate(exp => {
                exp.play("f1")
                this.soundsManager.playSound("bombExplosion")
            })

            this.rifleAims_Group.clear(true, true)
        })

        this.scene.time.delayedCall(1000, () => {
            this.explosion_group.clear(true, true)
            this.isBossAttacking = false
        })

    }

    showCountDownBeforeExplosions(arrPositionsAims) {
        //  this.countDown_text.setVisible(true)
        this.countDownFunction = this.scene.time.addEvent({
            delay: 1000,
            repeat: 1,
            callback: () => {

                let count = parseInt(this.countDown)
                count--
                this.countDown = count.toString()
                this.countDown_text.setText(count.toString())

                if (this.countDown === "1") {
                    this.addExplosions(arrPositionsAims)
                }

            },

        })
    }
    
    resetCountDown() {
        this.scene.time.delayedCall(200, () => {
            this.countDown = "2"
        })
    }

    laserSemicircles(dudeship) {

        this.isBossAttacking = true;
        this.showDamagingArea(dudeship)

    }

    showDamagingArea(dudeship) {

        let dudeShipX = dudeship.x - this.canvasW / 2;
        let dudeShipY = dudeship.y - this.canvasH / 2;
        let angle = Math.atan2(dudeShipY, dudeShipX); // ordine corretto
        let n1 = Math.floor(Math.random() * (250 - 50 + 1) + 50);

        let circumferenceStartingAngle = angle - Phaser.Math.DegToRad(35);
        let circumferenceEndAngle = angle + Phaser.Math.DegToRad(n1);


        const red = 0xff0000
        const orange = 0xfe4c10

        this.showRed(circumferenceEndAngle, circumferenceStartingAngle, red)

        let totalExec = 0

        this.scene.time.addEvent({
            delay: 300,
            repeat: 4,
            callback: () => {
                totalExec++
                console.log("Callback eseguito"); // Aggiungi questo per vedere se viene chiamato
                if (this.semicircleTrace === costanti.REDTRACE) {
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

    addDamageToSelectedArea(startAngle, endAngle) {
        // fill the circumference portion with flames that damage the dudeship
        for (let i = startAngle; i <= endAngle; i += Phaser.Math.DegToRad(3)) {
            let x = this.canvasW / 2 + costanti.raggio * Math.cos(i);
            let y = this.canvasH / 2 + costanti.raggio * Math.sin(i);

            const flame = this.scene.physics.add.sprite(x, y, "flame_spriteSheet").play("flameBurning")
                .setScale(0.4)
            this.flameGroup.add(flame, true)
            this.soundsManager.playSound("fireBurning")
        }

        this.scene.time.addEvent({
            delay: 1500,
            callback: () => {

                this.flameGroup.clear(true, true)
                this.isBossAttacking = false
            }
        })

    }


    showRed(circumferenceDamage, startingAngle, color) {
        this.semicircleTrace = costanti.REDTRACE
        !this.soundsManager.isSoundAlreadyPlaying("alarm") && this.soundsManager.playSound("alarm")
        this.createSemicircumference(circumferenceDamage, startingAngle, color)
    }

    showOrange(circumferenceDamage, startingAngle, color) {
        this.semicircleTrace = costanti.BLACKTRACE
        !this.soundsManager.isSoundAlreadyPlaying("alarm") && this.soundsManager.playSound("alarm")
        this.createSemicircumference(circumferenceDamage, startingAngle, color)
    }

    createSemicircumference(endingAngle, startingAngle, color) {

        this.semicircle = this.scene.add.graphics()
        this.semicircle.lineStyle(20, color) // red
        this.semicircle.arc(
            this.canvasW / 2,
            this.canvasH / 2,
            costanti.raggio,
            startingAngle,
            endingAngle,
            false
        )

        this.semicircle.strokePath();

        // after the semicircunference is created, because it's a graphics must be deleted after each draw
        // so after render every semicirc call a delayed event  to destroy the semicircle graphic
        this.scene.time.addEvent({
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
        this.boss.setTexture("circular_boss_funky_pose")
        this.soundsManager.playSound("laserBeanRelease")

        for (let i = 0; i < 25; i++) {
            // let bean = this.scene.physics.add.sprite(this.boss.x, this.boss.y, "redBean")
            //     .setOrigin(0.5, 0.5);

            let bean = this.createBean("redBean")

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


            // Distruggi il bean quando raggiunge la circonferenza
            this.scene.time.addEvent({
                delay: (costanti.raggio / speed) * 1000, // tempo per raggiungere il bordo
                callback: () => {
                    if (bean.active) {
                        bean.destroy();
                    }
                    this.resetTexture(this.boss, "circular_boss")
                }
            });

        }

        // Reset del flag dopo che tutti i bean sono partiti
        this.scene.time.addEvent({
            delay: (costanti.raggio / 200) * 1000 + 500, // tempo movimento + buffer
            callback: () => {
                this.isBossAttacking = false;
            }
        });
    }


    resetTexture(sprite, texture) {
        this.scene.time.addEvent({
            delay: 500,
            loop: false,
            callback: () => {
                sprite.setTexture(texture)
            }
        })

    }
}