function StaticAudioRouting() {
    // Create dynamics compressor to sweeten the overall mix.
    var compressor = context.createDynamicsCompressor();
    compressor.connect(context.destination);

    var convolver = context.createConvolver();
    loadImpulseResponse('impulse-responses/matrix-reverb6.wav', convolver);
    // loadImpulseResponse('impulse-responses/spatialized4.wav', convolver);

    var convolverDry = context.createGainNode();
    var convolverWet = context.createGainNode();

    convolverDry.connect(compressor);
    convolverWet.connect(convolver);
    convolver.connect(compressor);

    // BPM delay through delayWaveShaper feedback loop
    //bpmDelay = new BpmDelay(context);

    ///var delayFeedback = context.createGainNode();
    ///var delayDry = context.createGainNode();
    ///var delayWet = context.createGainNode();

    ////delayFeedback.gain.value = 0.5;
    ///delayDry.gain.value = 0.5;
    ///delayWet.gain.value = 0.5;

    ////delayDry.connect(compressor);
    ////bpmDelay.delay.connect(delayWet);
    ///delayWet.connect(compressor);

    ///bpmDelay.delay.connect(delayFeedback);
    ////delayWaveShaper = new WaveShaper(context);
    
    ///delayFeedback.connect(delayWaveShaper.input);
    ///delayWaveShaper.output.connect(bpmDelay.delay);

    //grungeWaveShaper = new WaveShaper(context);

    // Connect to delay dry/wet
    //grungeWaveShaper.output.connect(delayDry);
    //grungeWaveShaper.output.connect(bpmDelay.delay);

    // Connect to reverb dry/wet
    //grungeWaveShaper.output.connect(convolverDry);
    //grungeWaveShaper.output.connect(convolverWet);

    var subsonicFilter = context.createBiquadFilter();
    
    subsonicFilter.type = 1; // hipass
    subsonicFilter.frequency.value = 10;

    ///subsonicFilter.connect(grungeWaveShaper.input);
    
    //cb added, bypassing the grunge
    subsonicFilter.connect(convolverDry);
    subsonicFilter.connect(convolverWet);
    
    this.compressor = compressor;
    this.convolver = convolver;
    this.convolverDry = convolverDry;
    this.convolverWet = convolverWet;
    ///this.bpmDelay = bpmDelay;
    ////this.delayFeedback = delayFeedback;
    ///this.delayDry = delayDry;
    //this.delayWet = delayWet;
    ///this.delayWaveShaper = delayWaveShaper;
    //this.grungeWaveShaper = grungeWaveShaper;
    this.subsonicFilter = subsonicFilter;

    this.setReverbDryWet(0.2);
}

StaticAudioRouting.prototype.setDelayDryWet = function(x) {
    // Equal-power cross-fade dry -> wet
    var gain1 = 0.5 * (1.0 + Math.cos(x * Math.PI));
    var gain2 = 0.5 * (1.0 + Math.cos((1.0-x) * Math.PI));
    this.delayDry.gain.value = gain1;
    this.delayWet.gain.value = gain2;
}

StaticAudioRouting.prototype.setReverbDryWet = function(x) {
    // Equal-power cross-fade dry -> wet
    var gain1 = 0.5 * (1.0 + Math.cos(x * Math.PI));
    var gain2 = 0.5 * (1.0 + Math.cos((1.0-x) * Math.PI));
    this.convolverDry.gain.value = gain1;
    this.convolverWet.gain.value = gain2;
}

StaticAudioRouting.prototype.setDelayFeedback = function(x) {
    this.delayFeedback.gain.value = x;
}

StaticAudioRouting.prototype.setDelayGrunge = function(driveDb) {
    this.delayWaveShaper.setDrive(Math.pow(10, 0.05*driveDb));
}

StaticAudioRouting.prototype.setMainGrunge = function(driveDb) {
    this.grungeWaveShaper.setDrive(Math.pow(10, 0.05*driveDb));
}