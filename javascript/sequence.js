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

function Sequence() {
    this.loopLength = 16;
    this.rhythmIndex = 0;
    this.lastRhythmIndex = -1;
    this.loopNumber = 0;
    this.noteTime = 0.0;

    this.rhythm = [4, 4, 4, -1, 8, 13, 25, 15, 33, 23, 11, -1, 0, -1, 3, -1];
    // this.minor = [0, 3, 7, 10, 12, 15, 19, 22, 24, 27, 31, 34, 36, 39, 43, 46, 48, 51, 55, 58];
}

Sequence.prototype.schedule = function() {
    var currentTime = context.currentTime;

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= startTime;

    while (this.noteTime < currentTime + 0.040 /*0.120*/) {
        // Convert noteTime to context time.
        var contextPlayTime = this.noteTime + startTime;
        
        if (this.rhythm[this.rhythmIndex] != -1) {
            var noteNumber = this.rhythm[this.rhythmIndex];
            if (arp) {
                
                var minor = [0, 3, 7, 10];
                var arpOctave = Math.floor(noteNumber / 4);
                var i = noteNumber % 4;
                noteNumber = minor[i] + 12 * arpOctave;
            }

            if (playMonophonic) {
              console.log(contextPlayTime);
                monophonicNote.play(waveTable, waveTable2, noteNumber, octave, contextPlayTime);
            } else {
                var note = new WTNote(staticAudioRouting, false);
                note.play(waveTable, waveTable2, noteNumber, octave, contextPlayTime);

                if (playDoubleOctave) {
                    var note2 = new WTNote(staticAudioRouting, false);
                    note2.play(waveTable, waveTable2, noteNumber + 12, octave, contextPlayTime);
                }

            }

        }

        this.advanceNote();
    }
    
    setTimeout(Sequence.ddd, 0);
};

Sequence.ddd = function() {
    sequence.schedule();
};




Sequence.prototype.advanceNote = function() {
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;
    this.noteTime += 0.25 * secondsPerBeat;

    this.lastRhythmIndex = this.rhythmIndex;
    
    this.rhythmIndex++;
    if (this.rhythmIndex == this.loopLength) {
        this.rhythmIndex = 0;
        this.loopNumber++
    }
}
