// public/audio-worklet-processor.js
class AudioRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.port.onmessage = (event) => {
      if (event.data === "clearBuffer") {
        this.buffer = [];
      }
    };
  }

  process(inputs, outputs, parameters) {
    if (!inputs || inputs.length === 0 || inputs[0].length === 0) {
      return true;
    }

    const inputChannelData = inputs[0][0];
    const pcmData = new Int16Array(inputChannelData.length);
    for (let i = 0; i < inputChannelData.length; i++) {
      pcmData[i] = Math.max(-1, Math.min(1, inputChannelData[i])) * 32767;
    }

    this.port.postMessage(pcmData.buffer, [pcmData.buffer]);
    return true;
  }
}

registerProcessor("audio-recorder-processor", AudioRecorderProcessor);
