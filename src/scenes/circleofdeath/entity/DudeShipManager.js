import {costanti} from "../constants/costanti";

export class DudeShipManager {

    boostCloud_group = null
    deltaRechargeTurbo = 0
    turboLowBar = null;
    turboUpperBar = null
    HasTurboNeedRecharge = false
    turbo = false
    invincible = false
    hp_sprite = null
    hpPiece = 4

    constructor(scene) {
        this.dudeShip = null
        this.scene = scene
        this.canvasW = null
        this.canvasH = null
    }

    //getter

    getHpSprite() {
        return this.hp_sprite
    }

    getHpPiece() {
        return this.hpPiece
    }

    getTurbo() {
        return this.turbo
    }

    getInvincible() {
        return this.invincible
    }

    getDudeShip() {
        return this.dudeShip
    }

    getTurboUpperBar() {
        return this.turboUpperBar
    }

    getBoostCloudGroup() {
        return this.boostCloud_group
    }

    getHasTurboNeedRecharge() {
        // CORREZIONE: Restituisci la proprietà, non chiamare la funzione stessa.
        return this.HasTurboNeedRecharge;
    }

    //setter

    setHpPiece(num) {
        this.hpPiece = num
    }

    setTurbo(bool) {
        this.turbo = bool
    }

    setInvincible(bool) {
        this.invincible = bool
    }

    setHasTurboNeedRecharge(bool) {
        // CORREZIONE: Assegna il valore alla proprietà corretta.
        this.HasTurboNeedRecharge = bool;
    }


    setHpBasedOnHpPiece() {
        this.hpPiece--
        this.shakeHeart()
        switch (this.hpPiece) {
            case 4:
                console.log("vita piena. nessuna manovra.")
                break;
            case 3:
                this.hp_sprite.play("h3/4")
                break;
            case 2:
                this.hp_sprite.play("h2/4")
                break;
            case 1:
                this.hp_sprite.play("h1/4")
                break;
            case 0:
                this.hp_sprite.play("h0")
                break;

        }
    }

    shakeHeart() {

        this.scene.tweens.chain({
            targets: this.hp_sprite,
            loop: 0,
            tweens: [
                {
                    duration: 50,
                    x: this.hp_sprite.x += 5
                },
                {
                    duration: 50,
                    x: this.hp_sprite.x -= 5
                }, {
                    duration: 50,
                    x: this.hp_sprite.x += 5
                }, {
                    duration: 50,
                    x: this.hp_sprite.x -= 5
                }, {
                    duration: 50,
                    x: this.hp_sprite.x += 5
                }, {
                    duration: 50,
                    x: this.hp_sprite.x -= 5
                }, {
                    duration: 50,
                    x: this.hp_sprite.x += 5
                },
                {
                    duration: 50,
                    x: this.hp_sprite.x -= 5
                },
            ]
        })
    }

    create(w, h) {
        this.canvasH = h
        this.canvasW = w
        this.dudeShip = this.scene.physics.add.sprite((w / 2) + costanti.raggio, h / 2, 'dudeShip')
            .setScale(0.18)
            .setDepth(2)

        this.boostCloud_group = this.scene.add.group()
        this.createTurboBars()
        this.createHpSprite()
    }

    update(delta) {

        this.rechargeTurbo(delta)

    }

    createHpSprite() {
        this.hp_sprite = this.scene.add.sprite(this.canvasW / 12, this.canvasH / 6, "heartsSpriteSheet")
            .setDepth(5)
            .setScale(3)
            .play("hFull")
    }

    createTurboBars() {
        this.turboLowBar = this.scene.add.rectangle(this.canvasW / 12, this.canvasH / 12, 50, 20, 0xff0000, 1)
            .setDepth(3)

        this.turboUpperBar = this.scene.add.rectangle(this.canvasW / 12, this.canvasH / 12, 50, 20, 0x0000FF, 1)
            .setDepth(3)
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
}