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
