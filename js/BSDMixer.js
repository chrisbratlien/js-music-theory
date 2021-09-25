function BSDMixer(context) {

  function impulseResponse(duration, decay, reverse) {
    var sampleRate = context.sampleRate;
    var length = sampleRate * duration;
    var impulse = context.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
      decay = 2.0;
    for (var i = 0; i < length; i++) {
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
  }


  var common = context.createGain();
  common.gain.value = 1.0;

  var wet = context.createGain();
  var dry = context.createGain();


  var convolver = context.createConvolver();
  convolver.buffer = impulseResponse(1.5, 1.5, false);

  wet.gain.value = 0.4;
  wet.connect(convolver);
  convolver.connect(context.destination);

  dry.gain.value = 0.6;
  dry.connect(context.destination);

  common.connect(wet);
  common.connect(dry);

  return {
    common
  }

}
export default BSDMixer;