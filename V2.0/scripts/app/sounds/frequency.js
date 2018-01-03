/**
 * Created by JacobJaffe on 12/21/17.
 */

function Frequency(audioContext, masterGain, frequency, wave, volume) {
    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = volume;
    this.gainNode.connect(masterGain);
    this.oscillatorNode = audioContext.createOscillator();
    this.oscillatorNode.connect(this.gainNode);
    this.oscillatorNode.type = wave;
    this.oscillatorNode.frequency.value = frequency;
    this.oscillatorNode.start();
};