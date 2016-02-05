// Copyright 2011, Google Inc.
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
// 
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

//derived from http://chromium.googlecode.com/svn/trunk/samples/audio/wavetable-synth.html

function StaticAudioRouting() {
    // Create dynamics compressor to sweeten the overall mix.
    var compressor = context.createDynamicsCompressor();
    compressor.connect(context.destination);

    var convolver = context.createConvolver();
    loadImpulseResponse('impulse-responses/matrix-reverb6.wav', convolver);
    // loadImpulseResponse('impulse-responses/spatialized4.wav', convolver);

    var convolverDry = context.createGain();//context.createGainNode();
    var convolverWet = context.createGain();//context.createGainNode();

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