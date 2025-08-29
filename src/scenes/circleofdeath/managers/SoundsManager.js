export class SoundsManager {
    scene = null
    currSongPlayed = null
    index = 0

    constructor(phaserScene) {
        this.scene = phaserScene
        this.mapSounds = new Map()
    }

    getSound(key) {
        return this.mapSounds.get(key)
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

    isAnySoundAlreadyPlaying() {
        for (let sound of this.mapSounds.values()) {

            if (sound.isPlaying) return true

        }
        return false
    }

    //  looping the songs to be able to reproduce it in a loop constantly
    loopSounds(keys) {

        if (this.isAnySoundAlreadyPlaying()) return


        this.currSongPlayed = keys[this.index]
        !this.isSoundAlreadyPlaying(this.currSongPlayed) && this.playSound(this.currSongPlayed)


        this.getSound(this.currSongPlayed).once("complete", () => {
            console.log("canzone terminata evento acchiappato!!")

            if (this.index === keys.length - 1) {
                this.index = 0
            } else {

                this.index++
            }

            this.currSongPlayed = keys[this.index]
            // recursion - recall the same method but into the complete event to reproduce again the next song
            this.loopSounds(keys)
        })


    }
}