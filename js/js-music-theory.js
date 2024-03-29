import RootNoteWithIntervals from "./RootNoteWithIntervals.js";
import Chord from "./Chord.js";
import Scale from "./Scale.js";


let JSMT = {};
JSMT.symbols = {
  flat: "♭",
  sharp: "♯",
};

JSMT.midi2Hertz = function(x) {
  return Math.pow(2, (x - 69) / 12) * 440;
};

JSMT.allMIDIValues = [];
for (var i = 0; i < 128; i += 1) {
  JSMT.allMIDIValues[i] = i;
}

JSMT.weekOfYear = function() {
  var that = new Date();
  var onejan = new Date(that.getFullYear(), 0, 1);
  return Math.ceil(((that - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

JSMT.majorKeyOfTheWeek = function() {
  var idx = JSMT.weekOfYear() % 12;
  var them = JSMT.twelveNotes();
  return them[idx];
};

JSMT.randLowColor = function() {
  var start = JSMT.randColor();
  var score = 99;
  while (score > 25) {
    score =
      parseInt(start.substr(1, 1), 10) +
      parseInt(start.substr(3, 1), 10) +
      parseInt(start.substr(5, 1), 10);
  }
};

JSMT.strings = [];

JSMT.guitars = [];

JSMT.MAXFRETS = 36;

JSMT.toUTF8 = function(str) {
  if (str.match(/&#/)) {
    console.log("matched already-escaped chars...doing nothing");
    return str;
  }
  var result = str;
  result = result.replace(/#/g, "♯");
  result = result.replace(/b/g, "♭");
  return result;
};

JSMT.goShort = function(orig) {
  result = orig;
  /////result = result.replace(/flat/g,'b');
  ///result = result.replace(/sharp/g,'#');
  result = result.replace(/flat/g, "&#x266d;");
  result = result.replace(/sharp/g, "&#x266f;");
  return result;
};

JSMT.OBSOLETEgoLong = function(orig) {
  result = orig;
  result = result.replace(/b/g, "flat");
  result = result.replace(/#/g, "sharp");

  //result = result.replace(/&#x266d;/g,'flat');
  //result = result.replace(/&#x266f;/g,'sharp');
  return result;
};

JSMT.twelveTones = function() {
  //return ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  return ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
};

JSMT.twelveNotes = function() {
  return JSMT.twelveTones().map(function(n) {
    return Note(n);
  });
};

JSMT.noteBitmap = function(chordOrScale) {
  var result = JSMT.twelveNotes().map(function(note) {
    return chordOrScale.containsNote(note) ? 1 : 0;
  });
  return result;
};

JSMT.scaleMap = {
  major: { name: "major", intervals: [0, 2, 4, 5, 7, 9, 11] },
  ionian: { name: "ionian", intervals: [0, 2, 4, 5, 7, 9, 11] },

  minor: { name: "minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
  aeolian: { name: "aeolian", intervals: [0, 2, 3, 5, 7, 8, 10] },
  "natural minor": { name: "natural minor", intervals: [0, 2, 3, 5, 7, 8, 10] },

  dorian: { name: "dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },

  lydian: { name: "lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },

  HM: { name: "harmonic minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
  "harmonic minor": {
    name: "harmonic minor",
    intervals: [0, 2, 3, 5, 7, 8, 11],
  },

  HM2: { name: "harmonic minor mode 2", intervals: [0, 1, 3, 5, 6, 9, 10] },

  HM4: { name: "harmonic minor mode 4", intervals: [0, 2, 3, 6, 7, 9, 10] },

  HM5: { name: "harmonic minor mode 5", intervals: [0, 1, 4, 5, 7, 8, 10] },

  MM: { name: "melodic minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
  MM1: { name: "melodic minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
  mm: { name: "melodic minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
  "melodic minor": { name: "melodic minor", intervals: [0, 2, 3, 5, 7, 9, 11] },

  MM2: { name: "melodic minor mode 2", intervals: [0, 1, 3, 5, 7, 9, 10] },
  mm2: { name: "melodic minor mode 2", intervals: [0, 1, 3, 5, 7, 9, 10] },

  MM4: { name: "melodic minor mode 4", intervals: [0, 2, 4, 6, 7, 9, 10] },
  mm4: { name: "melodic minor mode 4", intervals: [0, 2, 4, 6, 7, 9, 10] },
  "lydian dominant": {
    name: "melodic minor mode 4",
    intervals: [0, 2, 4, 6, 7, 9, 10],
  },

  MM5: { name: "melodic minor mode 5", intervals: [0, 2, 4, 5, 7, 8, 10] },
  mm5: { name: "melodic minor mode 5", intervals: [0, 2, 4, 5, 7, 8, 10] },

  MM6: { name: "melodic minor mode 6", intervals: [0, 2, 3, 5, 6, 8, 10] },
  mm6: { name: "melodic minor mode 6", intervals: [0, 2, 3, 5, 6, 8, 10] },

  MM6: { name: "melodic minor mode 6", intervals: [0, 2, 3, 5, 6, 8, 10] },

  MM7: { name: "melodic minor mode 7", intervals: [0, 1, 3, 4, 6, 8, 10] },
  mm7: { name: "melodic minor mode 7", intervals: [0, 1, 3, 4, 6, 8, 10] },
  alt: { name: "altered", intervals: [0, 1, 3, 4, 6, 8, 10] },

  dorian: { name: "dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },

  dominant: { name: "dominant", intervals: [0, 2, 4, 5, 7, 9, 10] },
  mixolydian: { name: "mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
  mixobluesian: {
    name: "mixobluesian",
    intervals: [0, 2, 3, 4, 5, 6, 7, 9, 10],
  },

  locrian: { name: "locrian", intervals: [0, 1, 3, 5, 6, 8, 10] },

  "half whole diminished": {
    name: "half whole diminished",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
  },
  "hw diminished": {
    name: "half whole diminished",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
  },

  "whole half diminished": {
    name: "whole half diminished",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
  },
  "wh diminished": {
    name: "whole half diminished",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
  },

  "diminished whole tone": {
    name: "diminished whole tone",
    intervals: [0, 1, 3, 4, 6, 8, 10],
  },

  "major 6 diminished": {
    name: "major 6 diminished",
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
  }, // (barry harris scale)

  "whole tone": { name: "whole tone", intervals: [0, 2, 4, 6, 8, 10] },

  mP: { name: "minor pentatonic", intervals: [0, 3, 5, 7, 10] },
  "-P": { name: "minor pentatonic", intervals: [0, 3, 5, 7, 10] },

  blues: { name: "blues", intervals: [0, 3, 5, 6, 7, 10] },

  MP: { name: "major pentatonic", intervals: [0, 2, 4, 7, 9] },
  nothing: { name: "nothing", intervals: [] },
};

JSMT.chordMap = {
  "": { name: "major", intervals: [0, 4, 7] }, //verified
  M: { name: "major", intervals: [0, 4, 7] }, //verified
  Major: { name: "major", intervals: [0, 4, 7] }, //verified
  major: { name: "major", intervals: [0, 4, 7] }, //verified
  Maj: { name: "major", intervals: [0, 4, 7] }, //verified
  maj: { name: "major", intervals: [0, 4, 7] }, //verified
  "-": { name: "minor", intervals: [0, 3, 7] }, //verified
  m: { name: "minor", intervals: [0, 3, 7] }, //verified
  minor: { name: "minor", intervals: [0, 3, 7] }, //verified
  min: { name: "minor", intervals: [0, 3, 7] }, //verified

  dim: { name: "diminished", intervals: [0, 3, 6] },
  o: { name: "diminished", intervals: [0, 3, 6] },
  "°": { name: "diminished", intervals: [0, 3, 6] },

  "+": { name: "aug", intervals: [0, 4, 8] }, //verified

  "5": { name: "power", intervals: [0, 7] },

  sus4: { name: "suspended4", intervals: [0, 5, 7] }, //TODO: make sure
  sus: { name: "suspended4", intervals: [0, 5, 7] }, //TODO: make sure
  sus2: { name: "suspended2", intervals: [0, 2, 7] }, //TODO: make sure

  M7: { name: "major7", intervals: [0, 4, 7, 11] }, //verified
  Major7: { name: "major7", intervals: [0, 4, 7, 11] }, //verified
  Maj7: { name: "major7", intervals: [0, 4, 7, 11] }, //verified
  major7: { name: "major7", intervals: [0, 4, 7, 11] }, //verified
  maj7: { name: "major7", intervals: [0, 4, 7, 11] }, //verified

  "M7#5": { name: "major7Sharp5", intervals: [0, 4, 8, 11] }, //verified
  "Major7#5": { name: "major7Sharp5", intervals: [0, 4, 8, 11] }, //verified
  "Maj7#5": { name: "major7Sharp5", intervals: [0, 4, 8, 11] }, //verified
  "major7#5": { name: "major7Sharp5", intervals: [0, 4, 8, 11] }, //verified
  "maj7#5": { name: "major7Sharp5", intervals: [0, 4, 8, 11] }, //verified

  mM7: { name: "minorMajor7", intervals: [0, 3, 7, 11] }, //verified
  minmaj7: { name: "minorMajor7", intervals: [0, 3, 7, 11] }, //verified

  "7": { name: "dominant7", intervals: [0, 4, 7, 10] }, //verified
  dom7: { name: "dominant7", intervals: [0, 4, 7, 10] }, //verified

  "7#11": { name: "dominant7Sharp11", intervals: [0, 4, 7, 10, 18] },

  "7b5": { name: "dominant7Flat5", intervals: [0, 4, 6, 10] }, //verified
  "7-5": { name: "dominant7Flat5", intervals: [0, 4, 6, 10] }, //verified

  "7+5": { name: "dominant7Sharp5", intervals: [0, 4, 8, 10] }, //verified
  "+7": { name: "dominant7Sharp5", intervals: [0, 4, 8, 10] }, //verified
  "7#5": { name: "dominant7Sharp5", intervals: [0, 4, 8, 10] }, //verified

  m7: { name: "minor7", intervals: [0, 3, 7, 10] }, //verified
  "-7": { name: "minor7", intervals: [0, 3, 7, 10] }, //verified
  min7: { name: "minor7", intervals: [0, 3, 7, 10] }, //verified
  minor7: { name: "minor7", intervals: [0, 3, 7, 10] }, //verified

  m7b5: { name: "minor7Flat5", intervals: [0, 3, 6, 10] }, //verified
  min7b5: { name: "minor7Flat5", intervals: [0, 3, 6, 10] }, //verified
  "-7b5": { name: "minor7Flat5", intervals: [0, 3, 6, 10] }, //verified
  "-7-5": { name: "minor7Flat5", intervals: [0, 3, 6, 10] }, //verified
  "ø": { name: "minor7Flat5", intervals: [0, 3, 6, 10] }, //verified
  "Ø": { name: "minor7Flat5", intervals: [0, 3, 6, 10] }, //verified

  "-7+5": { name: "minor7Sharp5", intervals: [0, 3, 8, 10] }, //verified

  "7b9": { name: "sevenFlat9", intervals: [0, 4, 7, 10, 13] },
  "7-9": { name: "sevenFlat9", intervals: [0, 4, 7, 10, 13] },

  "7#9": { name: "sevenSharp9", intervals: [0, 4, 7, 10, 15] }, //verified
  "7+9": { name: "sevenSharp9", intervals: [0, 4, 7, 10, 15] }, //verified

  "7sus4": { name: "sevenSuspended4", intervals: [0, 5, 7, 10] },

  "6": { name: "six", intervals: [0, 4, 7, 9] },

  "-6": { name: "minor6", intervals: [0, 3, 7, 9] },
  m6: { name: "minor6", intervals: [0, 3, 7, 9] },

  o7: { name: "diminished 7", intervals: [0, 3, 6, 9] },
  "°7": { name: "diminished 7", intervals: [0, 3, 6, 9] },

  "6/9": { name: "sixNine", intervals: [0, 4, 7, 9, 14] },

  "9": { name: "dominant9", intervals: [0, 4, 7, 10, 14] },

  "-9": { name: "minor9", intervals: [0, 3, 7, 10, 14] },
  m9: { name: "minor9", intervals: [0, 3, 7, 10, 14] },

  M9: { name: "major9", intervals: [0, 4, 7, 11, 14] },
  Major9: { name: "major9", intervals: [0, 4, 7, 11, 14] },
  major9: { name: "major9", intervals: [0, 4, 7, 11, 14] },
  Maj9: { name: "major9", intervals: [0, 4, 7, 11, 14] },
  maj9: { name: "major9", intervals: [0, 4, 7, 11, 14] },

  add9: { name: "add9", intervals: [0, 4, 7, 14] },
  madd9: { name: "madd9", intervals: [0, 3, 7, 14] },

  "11": { name: "dominant11", intervals: [0, 4, 7, 10, 17] },
  "13": { name: "dominant13", intervals: [0, 4, 7, 10, 21] },

  "-13": { name: "minor 13", intervals: [0, 3, 7, 10, 21] },
  m13: { name: "minor 13", intervals: [0, 3, 7, 10, 21] },

  nothing: { name: "nothing", intervals: [] },
};

JSMT.chordTypes = [];

JSMT.chordTypes.push({ id: 1, intervals: [0, 4, 7] });

export const Note = function(foo, accidental) {
  if (foo !== 0 && !foo) {
    return "constructor?";
  }
  ////var self = spec;/////NotePrimitive(spec);

  var self = {};

  self.spec = foo;

  self.accidental = accidental || false;

  if (typeof foo == "string") {
    var acc = foo.match(/#|♯|b|♭$/);
    if (acc && foo.length > 1) {
      var m = acc[0];
      /*
      var map = { 
        'b': 'flat', 
        '#': 'sharp' 
      };
      */
      self.accidental = foo.substr(1);
    }
  }

  self.abstractValue = function() {
    return self.value() % 12;
  };
  self.chromaticValue = self.abstractValue;

  self.abstractlyEqualTo = function(otherNote) {
    return otherNote.abstractValue() == self.abstractValue();
  };
  self.chromaticallyEqualTo = self.abstractlyEqualTo;

  self.abstractDistanceTo = function(other) {
    return Math.abs(other.abstractValue() - self.abstractValue());
  };

  self.distanceTo = function(other) {
    return Math.abs(other.value() - self.value());
  };

  self.equalTo = function(other) {
    return other.value() == self.value();
  };

  self.fourth = function() {
    return self.plus(5);
  };

  self.fifth = function() {
    return self.plus(7);
  };

  self.value = function() {
    if (typeof foo == "number") {
      return foo;
    }

    if (foo.match(/^\d+$/)) {
      return parseInt(foo, 10);
    }

    if (typeof foo == "string") {
      return self.valueFromName(foo);
    }

    //at this point, just assume it's another Note object
    return foo.value();
  };

  self.name = function(accidental) {
    return self.nameFromValue(self.value(), accidental || self.accidental);
  };

  self.utf8Name = function() {
    var result = self.nameFromValue(self.value());

    return JSMT.toUTF8(result);

  };

  self.sharpNameFromValue = function(value) {
    var names = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    var idx = value % 12;
    var result = names[idx];
    return result;
  };

  self.flatNameFromValue = function(value) {
    var names = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];
    var idx = value % 12;
    var result = names[idx];
    return result;
  };

  self.nameFromValue = function(value, accidental) {
    var result = false;
    var sharps = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    var flats = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];
    var map = {
      sharp: sharps,
      "#": sharps,
      "♯": sharps,
      flat: flats,
      b: flats,
      "♭": flats,
    };
    var idx = value % 12;
    if (accidental) {
      result = map[accidental][idx];
    } else {
      //the old way i did it.
      var result = flats[idx];
      if (result == "Gb") {
        result = "F#";
      }
    }
    return result;
  };

  self.valueFromName = function(name) {
    var sharps = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    var flats = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];

    var idx = -1; ///sharps.indexOf(name);
    if (idx == -1) {
      idx = flats.indexOf(name);
    }
    if (idx == -1) {
      idx = sharps.indexOf(name);
    }
    ///console.log('idx',idx);

    return 60 + idx;
  };

  self.plus = function(other) {
    if (typeof other == "number") {
      return Note(self.value() + other, self.accidental);
    } else {
      return Note(self.value() + other.value(), self.accidental);
    }
  };


  self.scale = function(abbrev) {
    var spec = JSMT.scaleMap[abbrev];
    if (typeof spec == "undefined") {
      console.log(abbrev, "not defined");
    }
    return Scale({
      rootNote: self,
      intervals: spec.intervals,
      name: spec.name,
      abbrev: abbrev,
    });
  };

  self.lookupChord = function(abbrev) {
    var spec = JSMT.chordMap[abbrev];

    if (typeof spec == "undefined") {
      console.log(abbrev, "not defined");
    }

    return Chord({
      rootNote: self,
      intervals: spec.intervals,
      name: spec.name,
      abbrev: abbrev,
    });
  };

  self.chord = function(abbrev, bassNote) {
    var spec = JSMT.chordMap[abbrev];

    if (typeof spec == "undefined") {
      console.log(abbrev, "not defined");
    }

    return Chord({
      rootNote: self,
      intervals: spec.intervals,
      name: spec.name,
      abbrev,
      bassNote
      //accidental: accidental
    });
  };

  self.isAFourthOf = function(otherNote) {
    var test = Note(otherNote.value() + 5);
    return self.abstractlyEqualTo(test);
  };

  self.isAFifthOf = function(otherNote) {
    var test = Note(otherNote.value() + 7);
    return self.abstractlyEqualTo(test);
  };

  return self;
};

export function makeChord(name) {
  let rootName = false;

  let [chordName, bassNote] = name.split('/');
  if (chordName.substr(1, 1).match(/#|♯|b|♭/)) {
    rootName = chordName.substr(0, 2);
    chordName = chordName.substr(2);
  } else {
    rootName = chordName.substr(0, 1);
    chordName = chordName.substr(1);
  }

  // adjust for bass note being the new root note?
  // [0,4,7].map(n => (n + 5)%12 ).sort()
  return Note(rootName).chord(chordName, bassNote);
}

function makeSpecFromValues(values) {
  var o = JSMT.rnwiFromNoteValues(values);
  var result = o.spec;
  return result;
}

export function makeChordFromValues(values) {
  return Chord(makeSpecFromValues(values));
}

export function makeChordFromNotes(notes) {
  var values = notes.map(function(o) {
    return o.value();
  });
  return makeChordFromValues(values);
}

export function makeScaleFromValues(values) {
  return Scale(makeSpecFromValues(values));
}

export function makeScaleFromNotes(notes) {
  var values = notes.map(function(o) {
    return o.value();
  });
  return makeScaleFromValues(values);
}

export function makeScale(name) {
  var rootName = false;
  var scaleName = false;

  if (name.substr(1, 1).match(/#|b/)) {
    rootName = name.substr(0, 2);
    scaleName = name.substr(2);
  } else {
    rootName = name.substr(0, 1);
    scaleName = name.substr(1);
  }

  //////    console.log('scaleName',scaleName);
  scaleName = scaleName.replace(/^\ +/, "");

  return Note(rootName).scale(scaleName);
}

JSMT.rnwiFromNoteValues = function(noteValues) {
  //console.log('incoming noteValues',noteValues);
  var sorted = noteValues.sort();

  var first = sorted[0];
  //console.log('sorted',sorted);
  //console.log('incoming noteValues',noteValues);

  var result = RootNoteWithIntervals({
    rootNote: Note(first),
    intervals: sorted.map(function(n) {
      return n - first;
    }),
  });
  return result;
};

export const twelveBitMask = [
  0x800,
  0x400,
  0x200,
  0x100,
  0x80,
  0x40,
  0x20,
  0x10,
  0x8,
  0x4,
  0x2,
  0x1,
];
JSMT.twelveBitMask = twelveBitMask;

JSMT.twelveBitHash = function(ary) {
  return ary.reduce((accum, val) => JSMT.twelveBitMask[val] | accum, 0);
};



JSMT.Pair = function(x, y) {
  var self = {};
  self.x = x;
  self.y = y;
  return self;
};

JSMT.keeperPalettes = [
  ["#3e9876", "#2860a6", "#7057b9", "#d79200", "#dc3642", "#00a7d2", "#fe6673"],
  ["#ae6414", "#641999", "#db4ea2", "#4eb7d7", "#8486d3", "#7f1f17", "#285edc"],
  ["#8e9247", "#9a2b0b", "#216708", "#621531", "#a75eca", "#174da8", "#e83d21"],
  ["#f16400", "#a70f80", "#509dc1", "#057af5", "#8c1322", "#be754f", "#cf041b"],
  ["#883232", "#9e6abc", "#69bfa7", "#da135b", "#4c4392", "#717d8e", "#78e834"],
  ["#455e7a", "#ad616b", "#cec349", "#864d3d", "#50bb9b", "#fa5026", "#1c5eef"],
  ["#0e73a0", "#9d4936", "#752e47", "#bb3b20", "#316737", "#e70b10", "#0c2097"],
  ["#a24d1a", "#deb848", "#351c5d", "#559d2e", "#cd5b44", "#6d73d2", "#72785a"],
  ["#22837c", "#f28b4b", "#fd5f66", "#e02702", "#3ccb7c", "#90849f", "#2dd09f"],
];

JSMT.myPalette = JSMT.keeperPalettes.atRandom();
////JSMT.myPalette = JSMT.randomPalette();

JSMT.makeSwatch = function(starter) {
  var gradients = 4;
  if (typeof starter == "string") {
    starter = BSD.colorFromHex(starter);
  }
  var swatch = starter.upTo(BSD.colorFromHex("#eeeeee"), gradients);
  var lightest = swatch.pop(); //take off lightest
  ////console.log(lightest,'lightest');
  //swatch = swatch.concat(swatch); //double itself
  return swatch;
};

JSMT.HarmonizeSession = function() {
  var self = {};
  var colorMap = {};

  var swatches = [];
  JSMT.myPalette.each(function(starter) {
    var swatch = JSMT.makeSwatch(starter);
    swatches.push(swatch);
  });

  /////var swatches = [blues,oranges,cyans,reds,greens];

  swatches.reverse(); //so they'll pop in the order shown in the definition of swatches

  swatches.each(function(a) {
    //a.pop(); //pop off the lightest few
    //a.pop(); //pop off the lightest few
    a.reverse(); //so that we pop the darker colors first
  });

  self.addShape = function(shape) {
    if (typeof colorMap[shape] == "undefined") {
      colorMap[shape] = swatches.pop();
    }
  };

  self.getColorForShape = function(shape) {
    var color = colorMap[shape].pop();
    /////console.log(shape,color.toHex());
    return color;
  };

  return self;
};

var Grip = function(spec) {
  //FIXME: grip is a lot like a chord, no?
  var self = spec;

  self.frets = spec.frets || [];

  self.hasFrets = function() {
    return self.frets.length > 0;
  };

  self.lightUp = function(color) {
    self.frets.each(function(f) {
      f.lightUp(color);
    });
  };

  self.lightUpWithHarmonics = function(color) {
    self.lightUp(color);
    self.frets.each(function(f) {
      f.harmonics().each(function(h) {
        h.lightUp(color);
      });
    });
  };

  self.numberSort = function(a, b) {
    return a.number - b.number;
  };

  self.toggleLight = function(color) {
    self.frets.each(function(f) {
      f.toggleLight(color);
    });
  };

  self.lit = function() {
    var result = self.frets.detect(function(f) {
      return f.lit;
    });
    return result != false;
  };

  self.unlit = function() {
    return !self.lit();
  };

  self.lowestFret = function() {
    var them = self.frets.sort(self.numberSort);
    return them[0];
  };
  self.lowestString = function() {
    var them = self.strings().sort(self.numberSort);
    return them[0];
  };

  self.strings = function() {
    return self.frets.collect(function(f) {
      return f.string;
    });
  };

  self.shape = function() {
    var pairs = [];

    ///console.log(self,'grip');

    var ls = parseInt(self.lowestString().number, 10);
    var lf = parseInt(self.lowestFret().number, 10);
    var z = self.frets.collect(function(f) {
      return f.degree;
    });
    //console.log('z',z,'ls',ls,'lf',lf);

    var pairs = self.frets.collect(function(f) {
      return [f.string.number - ls, f.number - lf];
    });

    var result = pairs.sort().join(",");
    ///console.log('shape',result);
    return result;
  };

  self.nextFrets = function() {
    var candidates = [];
    self.frets.each(function(f) {
      var higherSet = f.higherFrettedFrets();
      if (higherSet.length > 0) {
        candidates.push(higherSet[0]);
      }
    });
    return candidates;
  };

  self.nextGrip = function() {
    var nextSet = self.nextFrets();
    ///console.log(nextSet,'next');
    return Grip({
      frets: nextSet,
    });
  };
  return self;
};

JSMT.DegreePicker = function(spec) {
  var degrees = [
    "1",
    "flat2",
    "2",
    "flat3",
    "3",
    "4",
    "flat5",
    "5",
    "flat6",
    "6",
    "flat7",
    "7",
  ];
  var state = {};
  degrees.each(function(d) {
    state[d] = false;
  });
  var turnedOn = spec.degreeString.split(",");
  turnedOn.each(function(d) {
    state[d] = true;
  });

  var self = BSD.PubSub({});

  self.updateState = function(li, bool) {
    if (bool) {
      li.addClass("on");
      li.removeClass("off");
    } else {
      li.addClass("off");
      li.removeClass("on");
    }
  };

  self.renderOn = function(html) {
    var label = DOM.label("Toggle Degrees"); //////////jQuery('<label>Toggle Degrees (click on square to toggle)</label>');
    var ul = DOM.ul().addClass("toggler"); ////////jQuery('<ul class="toggler">');
    degrees.each(function(d) {
      var li = DOM.li(); /////jQuery('<li>');

      self.updateState(li, state[d]);

      li.html(JSMT.goShort(d));
      li.click(function() {
        state[d] = !state[d];
        ///console.log(state[d]);
        self.updateState(li, state[d]);

        var chosen = degrees.select(function(d) {
          return state[d];
        });

        ////////spec.onUpdate(chosen); //callback

        self.publish("update", chosen);
      });
      ul.append(li);
    });
    html.append(label);
    html.append(ul);
    html.append(jQuery('<div style="clear: both; ">&nbsp;</div>'));
  };
  return self;
};

export default JSMT;