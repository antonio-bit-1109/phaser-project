export class SoundsManager {
    scene = null

    constructor(phaserScene) {
        this.scene = phaserScene
        this.mapSounds = new Map()
    }

    addAudio(key, config) {
        const sound = this.scene.sound.add(key, config)
        this.mapSounds.set(key, sound)
    }

    playSound(key) {
        this.mapSounds.get(key).play()
    }

    isSoundAlreadyPlaying(key) {
        return this.mapSounds.get(key).isPlaying
    }
}