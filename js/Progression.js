import { makeChord } from "./js-music-theory.js";

export function parseProgressionIntoBars(progString) {
    var barStrings = progString.split('|');


    barStrings = barStrings.select(function(o) { return o.trim().length > 0; });
    ///console.log('barStrings',barStrings);

    var bars = barStrings.map(function(barString) {
        var chordNames = barString.split(/,|\ +/);
        chordNames = chordNames.select(function(o) { return o.trim().length > 0; });

        ///console.log('chordNames',chordNames);

        var chords = chordNames.map(function(o) {
            var origChord = makeChord(o);
            return origChord; /////.plus(-12);
        });
        return chords;
    });

    ////console.log('bars???',bars);

    return bars;
};

export function parseProgression(progString) {
    var lastChordName = false;
    var barStrings = progString.split(/\|/);
    barStrings = barStrings.map(function(o) { return o.trim(); });
    barStrings = barStrings.select(function(o) { return o.length > 0; });

    if (barStrings.length == 1) {
        barStrings = barStrings[0].split(/\ +/);
        barStrings = barStrings.map(function(o) { return o.trim(); });
        barStrings = barStrings.select(function(o) { return o.length > 0; });
    }
    //console.log('barStrings',barStrings);

    var barIndex = 0;
    var chordIndex = 0;
    var barChordIndex = 0;

    var flat = [];

    barStrings.each(function(barString) {
        var chordNames = barString.split(/,|\ +/);
        var halfBar = false;
        if (chordNames.length == 2) {
            halfBar = true;
        }


        chordNames.forEach(function(chordName, barChordIndex) {
            if (chordName == '%') {
                chordName = lastChordName;
            }
            var origChord = makeChord(chordName);
            var lowerChord = origChord.plus(-12);

            flat.push({
                barIndex: barIndex,
                barChordIndex: barChordIndex,
                chordIndex: chordIndex,
                chord: lowerChord,
                halfBar: halfBar
            });
            chordIndex += 1;
            lastChordName = chordName;
        });
        barIndex += 1;
    });

    return flat;
};


