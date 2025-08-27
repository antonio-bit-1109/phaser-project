export class SoundsManager {
    scene = null

    constructor(phaserScene) {
        this.scene = phaserScene
        this.mapSounds = new Map()
    }

    resetDefault() {
        this.mapSounds = new Map()
    }

    addAudio(key, config) {
        const sound = this.scene.sound.add(key, config)
        this.mapSounds.set(key, sound)
    }

    playSound(key) {
        this.mapSounds.get(key).play()
    }

    stopSound(key) {
        this.mapSounds.get(key).stop()
    }

    isSoundAlreadyPlaying(key) {
        return this.mapSounds.get(key).isPlaying
    }

    stopAllSounds() {
        for (let sound of this.mapSounds.values()) {
            sound.stop()
        }
    }
}