function WTNote(staticAudioRouting, isMonophonic) {
    this.staticAudioRouting = staticAudioRouting;
    this.isMonophonic = isMonophonic;
    
    // Create oscillators, panners, amplitude, and filter envelopes.    
    
    var osc1 = context.createBufferSource();
    osc1.looping = true;

    var osc1Octave = context.createBufferSource();
    osc1Octave.looping = true;

    var osc2 = context.createBufferSource();
    osc2.looping = true;

    var osc2Octave = context.createBufferSource();
    osc2Octave.looping = true;
    
    var panner1 = context.createPanner();
    panner1.panningModel = webkitAudioPannerNode.EQUALPOWER;

    var panner2 = context.createPanner();
    panner2.panningModel = webkitAudioPannerNode.EQUALPOWER;

    // Amplitude envelope
    var ampEnvelope = context.createGainNode();
    ampEnvelope.gain.value = 0.0; // default value

    // Filter
    var filter = context.createBiquadFilter();
    filter.type = 0;
    filter.gain.value = 0.0; // default value

    // Create note volume.
    var noteVolume = context.createGainNode();
    noteVolume.gain.value = 0; // start out silent until told otherwise

    // Make connections
    
    // oscillators --> panners.
    osc1.connect(panner1);
    osc1Octave.connect(panner1);
    osc2.connect(panner2);
    osc2Octave.connect(panner2);

    // panners --> amplitude envelope
    panner1.connect(ampEnvelope);
    panner2.connect(ampEnvelope);

    // amplitude envelope --> filter envelope
    ampEnvelope.connect(filter);

    // filter envelope --> note volume
    filter.connect(noteVolume);

    // note volume -> subsonic filter
    noteVolume.connect(this.staticAudioRouting.subsonicFilter /*subsonicFilter*/);

    // Keep oscillators playing at all times if monophonic.
    if (this.isMonophonic) {
        osc1.noteOn(0);
        osc2.noteOn(0);
        osc1Octave.noteOn(0);
        osc2Octave.noteOn(0);
    }
    
    // Keep track of all the nodes.
    this.osc1 = osc1;
    this.osc2 = osc2;
    this.osc1Octave = osc1Octave;
    this.osc2Octave = osc2Octave;
    this.panner1 = panner1;
    this.panner2 = panner2;
    this.ampEnvelope = ampEnvelope;
    this.filter = filter;
    this.noteVolume = noteVolume;
    
    this.wave = 0;
    this.wave2 = 0;
}

WTNote.prototype.setFilterValues = function() {
    var time = this.time;
    var filter = this.filter;
    var pitchFrequency = this.pitchFrequency;
    
    filter.frequency.cancelScheduledValues(0);

    filter.type = 0; // Lowpass
    filter.Q.value = resonance; // !!FIXME: should be Q

    var nyquist = 0.5 * context.sampleRate;

    var cutoffCents = 9600 * cutoff;
    var cutoffRate = Math.pow(2, cutoffCents / 1200.0);
    var startFrequency = cutoffRate * pitchFrequency;
    if (startFrequency > nyquist)
        startFrequency = nyquist;

    var envAmountCents = 7200 * envAmount;
    var envAmountRate = Math.pow(2, envAmountCents / 1200.0);
    var envAmountFrequency = startFrequency * envAmountRate;
    if (envAmountFrequency > nyquist)
        envAmountFrequency = nyquist;

    if (!this.isMonophonic) {
        filter.frequency.value = startFrequency;
        filter.frequency.setValueAtTime(startFrequency, time);
    } else {
        // filter.frequency.setValueAtTime(filter.frequency.value, time); // !! not correct
    }

    filter.frequency.setTargetValueAtTime(envAmountFrequency, time, filterAttack);
    filter.frequency.setTargetValueAtTime(startFrequency, time + filterAttack, filterDecay);
}


WTNote.firstTime = true;

WTNote.prototype.play = function(wave, wave2, semitone, octave, time) {
    this.time = time;
    
    if (wave != this.wave || wave2 != this.wave2 || !this.isMonophonic) {
        this.wave = wave;
        this.wave2 = wave2;
        WTNote.firstTime = true;
    }
    
    // Get local copies.
    var osc1 = this.osc1;
    var osc2 = this.osc2;
    var osc1Octave = this.osc1Octave;
    var osc2Octave = this.osc2Octave;
    var panner1 = this.panner1;
    var panner2 = this.panner2;
    var ampEnvelope = this.ampEnvelope;
    var filter = this.filter;
    var noteVolume = this.noteVolume;

    // Set oscillator pitches.
    
    var pitchFrequency = 20.0 /*440.0*/ * Math.pow(2.0, semitone / 12.0);
    this.pitchFrequency = pitchFrequency;
    
    var pitchRate = pitchFrequency * wave.getRateScale();

    var rate1 = pitchRate * Math.pow(2.0, -detune1/1200);
    var buffer1 = wave.getWaveDataForPitch(rate1);
    if (WTNote.firstTime) osc1.buffer = buffer1;

    osc1.playbackRate.value = rate1;


    var rate2 = pitchRate * Math.pow(2.0, octave - detune2/1200);
    var buffer2 = wave2.getWaveDataForPitch(rate2);
    if (WTNote.firstTime) osc1Octave.buffer = buffer2;
    osc1Octave.playbackRate.value = rate2;

    if (WTNote.firstTime) osc2.buffer = buffer1;
    osc2.playbackRate.value = pitchRate * Math.pow(2.0, +detune1/1200); // max one semi-tone

    if (WTNote.firstTime) osc2Octave.buffer = buffer2;
    osc2Octave.playbackRate.value = pitchRate * Math.pow(2.0, octave + detune2/1200); // max one semi-tone
    
    // Set panning amount for width spreading.
    
    // pan maximum from -90 -> +90 degrees
    var x = Math.sin(0.5*Math.PI * width);
    var z = -Math.cos(0.5*Math.PI * width);
    panner1.panningModel = webkitAudioPannerNode.EQUALPOWER;
    panner1.setPosition(-x, 0, z);

    panner2.panningModel = webkitAudioPannerNode.EQUALPOWER;
    panner2.setPosition(x, 0, z);

    // Amplitude envelope
    ampEnvelope.gain.cancelScheduledValues(0);

    if (!this.isMonophonic)
        ampEnvelope.gain.setValueAtTime(0.0, time);
    else {
        // ampEnvelope.gain.setValueAtTime(ampEnvelope.gain.value, time); // !! not correct
    }
    
    // Amplitude attack
    var ampAttackTime = time + ampAttack;
    
    // Amplitude decay
    ampEnvelope.gain.setTargetValueAtTime(1, time, ampAttack);
    ampEnvelope.gain.setTargetValueAtTime(0, ampAttackTime, ampDecay);

    // Filter
    this.setFilterValues();

    // Set note volume.
    noteVolume.gain.value = 0.1 * volume*volume; // use x^2 volume curve for now

    // Trigger note if polyphonic, otherwise oscillators are running all the time for monophonic.
    if (!this.isMonophonic) {
        var ampDecayAdjust = 8*ampDecay; // time-constant adjusting... 
        if (ampDecayAdjust < 0.100) ampDecayAdjust = 0.100;
        if (ampDecayAdjust > 4) ampDecayAdjust = 4;
        var offTime = ampAttackTime + ampDecayAdjust;

        osc1.noteOn(time);
        osc2.noteOn(time);
        osc1.noteOff(offTime);
        osc2.noteOff(offTime);

        osc1Octave.noteOn(time);
        osc2Octave.noteOn(time);
        osc1Octave.noteOff(offTime);
        osc2Octave.noteOff(offTime);
    } else {
        WTNote.firstTime = false;
    }
}



