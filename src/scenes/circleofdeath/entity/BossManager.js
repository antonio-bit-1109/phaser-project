import {costanti} from "../constants/costanti";

export class BossManager {

    passingTime = 0
    isBossAttacking = false
    laserBean_group = null;
    flameGroup = null
    semicircle = null
    semicircleTrace = null
    canvasW = null
    canvasH = null

    constructor(scene, soundsManager) {
        this.boss = null;
        this.scene = scene
        this.soundsManager = soundsManager
    }

    // getter
    getLaserBeanGroup() {
        return this.laserBean_group
    }

    getFlameGroup() {
        return this.flameGroup
    }

    create(w, h) {
        this.canvasW = w
        this.canvasH = h
        this.flameGroup = this.scene.add.group()
        this.laserBean_group = this.scene.add.group()
        this.boss = this.scene.physics.add.sprite(this.canvasW / 2, this.canvasH / 2, "circular_boss")
            .setScale(0.2)
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

            if (n > 0.5) this.laserBeans()
            if (n <= 0.5) this.laserSemicircles(dudeship)

        }
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
            this.boss.setTexture("circular_boss_funky_pose")

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