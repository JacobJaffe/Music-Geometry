/**
 * Created by JacobJaffe on 12/21/17.
 */


function Audio() {

    // catch various browsers
    this.audioContext = new (window.AudioContext || window.webkitAudioContext);

    this.frequencyTable = new FrequencyTable().table; // TODO: why is it like this lol table.table is so bad

    this.activeSounds = [];
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
};

Audio.prototype.addSound = function (sound) {
    this.activeSounds.push(sound);
};

