if (typeof Object.create !== 'function') {
     Object.create = function (o) {
         var F = function () {};
         F.prototype = o;
         return new F();
     };
}

if ((typeof log) == 'undefined') {
  log = function(msg) {
    if ((typeof console) == 'undefined') {
      alert(msg);
    }
    else {
      console.log(msg);
    }
  };
}


if (typeof String.prototype.trim == 'undefined') {
 String.prototype.trim = function() {
   return this.replace(
   /^\s*(\S*(\s+\S+)*)\s*$/, "$1");
 };
}

if (typeof String.prototype.supplant == 'undefined') {
   String.prototype.supplant = function(o) {
     return this.replace(/{{([^{}]*)}}/g,
       function(a, b) {
         var r = o[b];
         return typeof r === 'string' ?
           r : a;
       }
     );  
   };
}

JSMT = {};



JSMT.allMIDIValues = [];
for(var i = 0; i < 128; i += 1) {
    JSMT.allMIDIValues[i] = i;
}


JSMT.weekOfYear = function() {
  var that = new Date();
  var onejan = new Date(that.getFullYear(),0,1);
  return Math.ceil((((that - onejan) / 86400000) + onejan.getDay()+1)/7);
};

JSMT.majorKeyOfTheWeek = function() {
  var idx = JSMT.weekOfYear() % 12;
  var them = JSMT.twelveNotes();
  return them[idx];
}





JSMT.randLowColor = function() {

  var start = JSMT.randColor();
  var score = 99;
  while (score > 25) {
    score = parseInt(start.substr(1,1),10) + parseInt(start.substr(3,1),10) + parseInt(start.substr(5,1),10);
  
  } 
  
  
};



JSMT.strings = [];

JSMT.guitars = [];

JSMT.MAXFRETS = 36;



JSMT.toUTF8 = function(str) {

  if (str.match(/&#/)) { 
    console.log('matched already-escaped chars...doing nothing');
    return str; 
  }
  var result = str;
  result = result.replace(/#/g,'&#9839;');
  result = result.replace(/b/g,'&#9837;');
  return result;
};


JSMT.goShort = function (orig) { 
  result = orig;
  /////result = result.replace(/flat/g,'b');
  ///result = result.replace(/sharp/g,'#');
  result = result.replace(/flat/g,'&#x266d;');
  result = result.replace(/sharp/g,'&#x266f;');
  return result;  
}

JSMT.OBSOLETEgoLong = function(orig) {
  result = orig;
  result = result.replace(/b/g,'flat');
  result = result.replace(/#/g,'sharp');
  
  //result = result.replace(/&#x266d;/g,'flat');
  //result = result.replace(/&#x266f;/g,'sharp');
  return result;
};



/*
var NotePrimitive = function(spec) {
  var self = {};
  self.value = function() {
    return spec.value || 0;
  };
  self.add = function(other) { 
    if (typeof other == "number") {
      return NotePrimitive({value: other + self.value()}); 
    } else {
      return NotePrimitive({value: other.value() + self.value()}); 
    }
  };

  self.sub = function(other) { 
    if (typeof other == "number") {
      return NotePrimitive({value: self.value() - other}); 
    } else {
      return NotePrimitive({value: self.value() - other.value()}); 
    }
  };

  return self; 
};
*/

JSMT.twelveTones = function() {
    //return ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    return ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
};

JSMT.twelveNotes = function() {
  return JSMT.twelveTones().map(function(n) { return Note(n); });
};


JSMT.scaleMap = {
    'major' : { name: 'major', intervals: [0,2,4,5,7,9,11] },

    'minor' : { name: 'minor', intervals: [0,2,3,5,7,8,10] },
    'natural minor' : { name: 'natural minor', intervals: [0,2,3,5,7,8,10] },


    'HM' : { name: 'harmonic minor', intervals: [0,2,3,5,7,8,11] },
    'harmonic minor' : { name: 'harmonic minor', intervals: [0,2,3,5,7,8,11] },

    'mm' : { name: 'melodic minor', intervals: [0,2,3,5,7,9,11] },
    'melodic minor' : { name: 'melodic minor', intervals: [0,2,3,5,7,9,11] },


    'dorian' : { name: 'dorian', intervals: [0,2,3,5,7,9,10] },

    'dominant' : { name: 'dominant', intervals: [0,2,4,5,7,9,10] },


    'half whole diminished' : { name: 'half whole diminished', intervals: [0,1,3,4,6,7,9,10] },

    'whole half diminished' : { name: 'whole half diminished', intervals: [0,2,3,5,6,8,9,11] },

    'diminished whole tone' : { name: 'diminished whole tone', intervals: [0,1,3,4,6,8,10] },

    'major 6 diminished' : { name: 'major 6 diminished', intervals: [0,2,4,5,7,8,9,11] }, // (barry harris scale)


    'whole tone' : { name: 'whole tone', intervals: [0,2,4,6,8,10] },


    'mP' : { name: 'minor pentatonic', intervals: [0,3,5,7,10] },
    '-P' : { name: 'minor pentatonic', intervals: [0,3,5,7,10] },

    'blues' : { name: 'blues', intervals: [0,3,5,6,7,10] },

    'MP' : { name: 'major pentatonic', intervals: [0,2,4,7,9] },
    'nothing':   { name: 'nothing', intervals: [] }
  };

JSMT.chordMap = {
    '': { name: 'major', intervals: [0,4,7] }, //verified
    'M': { name: 'major', intervals: [0,4,7] }, //verified
    '-':   { name: 'minor', intervals: [0,3,7] }, //verified
    'm':   { name: 'minor', intervals: [0,3,7] }, //verified


    '+':   { name: 'aug', intervals: [0,4,8] }, //verified


    'sus4':  { name: 'sevenSuspended4', intervals: [0,5,7] }, //TODO: make sure
    'sus':  { name: 'sevenSuspended4', intervals: [0,5,7] }, //TODO: make sure


    'M7': { name: 'major7', intervals: [0,4,7,11] }, //verified

    '7':   { name: 'dominant7', intervals: [0,4,7,10] }, //verified
    'dom7':   { name: 'dominant7', intervals: [0,4,7,10] }, //verified


    '7b5':   { name: 'dominant7Flat5', intervals: [0,4,6,10] }, //verified
    '7-5':   { name: 'dominant7Flat5', intervals: [0,4,6,10] }, //verified
    '7+5':   { name: 'dominant7Sharp5', intervals: [0,4,8,10] }, //verified
    '7#5':   { name: 'dominant7Sharp5', intervals: [0,4,8,10] }, //verified



    'm7': { name: 'minor7', intervals: [0,3,7,10] }, //verified
    '-7': { name: 'minor7', intervals: [0,3,7,10] }, //verified

    'm7b5':  { name: 'minor7Flat5', intervals: [0,3,6,10] }, //verified
    '-7b5':  { name: 'minor7Flat5', intervals: [0,3,6,10] }, //verified
    '-7-5':  { name: 'minor7Flat5', intervals: [0,3,6,10] }, //verified


    '-7+5':  { name: 'minor7Sharp5', intervals: [0,3,8,10] }, //verified


    '7b9':  { name: 'sevenFlat9', intervals: [0,4,7,10,13] },
    '7-9':  { name: 'sevenFlat9', intervals: [0,4,7,10,13] },


    '7#9':  { name: 'sevenSharp9', intervals: [0,4,7,10,15] }, //verified
    '7+9':  { name: 'sevenSharp9', intervals: [0,4,7,10,15] }, //verified

    '7sus4':  { name: 'sevenSuspended4', intervals: [0,5,7,10] },



    '6':  { name: 'six', intervals: [0,4,7,9] },

    '-6':  { name: 'minor6', intervals: [0,3,7,9] },
    'm6':  { name: 'minor6', intervals: [0,3,7,9] },

    'o7':  { name: 'diminished 7', intervals: [0,3,6,9] },



    '9':   { name: 'dominant9', intervals: [0,4,7,10,14] },

    '-9':   { name: 'minor9', intervals: [0,3,7,10,14] },
    'm9':   { name: 'minor9', intervals: [0,3,7,10,14] },
    'M9':   { name: 'major9', intervals: [0,4,7,11,14] },


    '13':   { name: 'dominant13', intervals: [0,4,7,10,21] },


    '-13':   { name: 'minor 13', intervals: [0,3,7,10,21] },
    'm13':   { name: 'minor 13', intervals: [0,3,7,10,21] },



    'nothing':   { name: 'nothing', intervals: [] }
  };

  
  

JSMT.chordTypes = [];


JSMT.chordTypes.push({ id: 1, intervals: [0,4,7] });


  
  










var Note = function(foo) {
  ////var self = spec;/////NotePrimitive(spec);
  
  var self = {};
  
  self.abstractValue = function() {
    return self.value() % 12;
  };
  
  self.abstractlyEqualTo = function(otherNote) {
    return otherNote.abstractValue() == self.abstractValue();
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
    if (typeof foo == "string") {
      return self.valueFromName(foo);
    }

    //at this point, just assume it's another Note object
    return foo.value();
  };
  
  self.name = function() { 
    return self.nameFromValue(self.value());
  };
  
  
  
  self.utf8Name = function() {
    var result = self.nameFromValue(self.value());
    
    return JSMT.toUTF8(result);
    ///
    
    /***
    
    if (result.length == 2) {
      if (result[1] == '#') {
        result = result.replace(/#/,'&#9839;');
      }
      else {
        result = result.replace(/b/,'&#9837;');
      }
    }
    return result;
    ****/
  };
  
  
  
  self.nameFromValue = function(value) {
    var sharps = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var flats = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];    

    var idx = value%12;
    var result = flats[idx];

    if (result == 'Gb') {
      result = 'F#';
    }
    return result;

  };
  
  self.valueFromName = function(name) {
    var sharps = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var flats = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];    

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
      return Note(self.value() + other);
    }
    else {
      return Note(self.value() + other.value());
    }
  };
  
  
  /*
  self.majorScale = function() {
    return Scale({rootNote: self, intervals: [0,2,4,5,7,9,11]});
  };
  self.naturalMinorScale = function() {
    return Scale({rootNote: self, intervals: [0,2,3,5,7,8,10]});
  };
  self.minorScale = self.naturalMinorScale;
  

  self.harmonicMinorScale = function() {
    return Scale({rootNote: self, intervals: [0,2,3,5,6,8,11]});
  };
  */


  self.scale = function(abbrev) {
    var spec = JSMT.scaleMap[abbrev];
    if (typeof spec == "undefined") {
      console.log(abbrev,'not defined');
    }
    return Scale({ rootNote: self, intervals: spec.intervals, name: spec.name, "abbrev": abbrev });          
  };
  
  
  self.lookupChord = function(abbrev) {
  
    var spec = JSMT.chordMap[abbrev];
    
    if (typeof spec == "undefined") {
      console.log(abbrev,'not defined');
    }
    
    return Chord({ rootNote: self, intervals: spec.intervals, name: spec.name, "abbrev": abbrev });          
  
  
  }
  
  self.chord = function(abbrev) {
    var spec = JSMT.chordMap[abbrev];
    
    if (typeof spec == "undefined") {
      console.log(abbrev,'not defined');
    }
    
    return Chord({ rootNote: self, intervals: spec.intervals, name: spec.name, "abbrev": abbrev });          
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



function makeChord(name) {
  
  var rootName = false;
  var chordName = false;

  if (name.substr(1,1).match(/#|b/)) {
    rootName = name.substr(0,2);
    chordName = name.substr(2);
  }
  else {
    rootName = name.substr(0,1);
    chordName = name.substr(1);
  }
  return Note(rootName).chord(chordName);
}


function makeSpecFromValues(values) {
  var lowest = values[0];
  var rest = values.slice(1);
  rest = rest.sort(function(a,b){return a-b});
  var newRoot = Note(lowest);    
  var newIntervals = rest.map(function(v) { return v - newRoot.value(); });
  return { rootNote: newRoot, intervals: newIntervals };
}

function makeChordFromValues(values) {
  return Chord(makeSpecFromValues(values));
}

function makeChordFromNotes(notes) {
  var values = notes.map(function(o) { return o.value(); });
  return makeChordFromValues(values);
}

function makeScaleFromValues(values) {
  return Scale(makeSpecFromValues(values));
}

function makeScaleFromNotes(notes) {
  var values = notes.map(function(o) { return o.value(); });
  return makeScaleFromValues(values);
}
	


function makeScale(name) {
  
  var rootName = false;
  var scaleName = false;

  if (name.substr(1,1).match(/#|b/)) {
    rootName = name.substr(0,2);
    scaleName = name.substr(2);
  }
  else {
    rootName = name.substr(0,1);
    scaleName = name.substr(1);
  }

  //////    console.log('scaleName',scaleName);
  scaleName = scaleName.replace(/^\ +/,'');
  

  return Note(rootName).scale(scaleName);
}




var RootNoteWithIntervals = function(spec) {

  ///console.log('rnwi',spec);

  var self = {};
  
  self.constructor = RootNoteWithIntervals;
  
  
  
  
  
  self.name = spec.name || 'no name given';
  self.abbrev = spec.abbrev || 'no abbrev';
  self.rootNote = spec.rootNote;



  /////console.log('self.name',self.name);


  self.intervals = function() { 
    return spec.intervals.sort(function(a,b){return a-b}); 
  };
  
  self.invertDown = function() {  
    var newSet = self.noteValues();
    var jumper = newSet.pop();
    jumper -= 12; 
    newSet.push(jumper);
    newSet = newSet.sort(function(a,b){return a-b}); 
    newRoot = Note(newSet[0]);
    var newIntervals = newSet.map(function(v) { return v - newRoot.value(); });
    return self.constructor({ rootNote: newRoot, intervals: newIntervals });
  };
  
  self.invertUp = function() {  
    var values = self.noteValues();
    
    var lowest = values[0];
    var rest = values.slice(1);
    rest.push(lowest+12);
    rest = rest.sort(function(a,b){return a-b});
    var newRoot = Note(rest[0]);    
    var newIntervals = rest.map(function(v) { return v - newRoot.value(); });
    return self.constructor({ rootNote: newRoot, intervals: newIntervals });
  };
  
  
  self.octaveUp = function() {
    return self.constructor({
      rootNote: self.rootNote.plus(12),
      intervals: self.intervals().map(function(i){ return i + 12; })
    });
  };
  
  
  
  self.noteFromInterval = function(interval) {
    return Note(self.rootNote.value() + interval)
  };
  
  self.notes = function() {
    return self.intervals().map(function(interval) { return self.noteFromInterval(interval); });    
  };
  self.noteNames = function() {
    return self.notes().map(function(note) { return note.name(); });    
  };

  self.noteValues = function() {
    return self.notes().map(function(note) { return note.value(); }).sort(function(a,b){return a-b});    
  };
  self.abstractNoteValues = function() {
    return self.notes().map(function(note) { return note.abstractValue(); }).sort(function(a,b){return a-b});    
  };




  self.highestNoteValue = function() {
    var them = self.noteValues();
    return them[them.length-1];
  }

  self.lowestNoteValue = function() {
    var them = self.noteValues();
    return them[0];
  }

  
  
  self.fullName = function() {
    return self.rootNote.name() + ' ' + self.name;
  };

  self.fullAbbrev = function() {
    return self.rootNote.name() + ' ' + self.abbrev;
  };

  self.utf8FullAbbrev = function() {
    return self.rootNote.utf8Name() + JSMT.toUTF8(self.abbrev);
  };

  
  self.compatibleScales = function() {
    var result = [];
    JSMT.twelveNotes().each(function(n) {
      for (key in JSMT.scaleMap) {
        var spec = JSMT.scaleMap[key];
        var scale = Scale({ rootNote: n, intervals: spec.intervals, name: spec.name, abbrev: key });
        if (self.notesNotFoundIn(scale).length == 0) {
          result.push(scale);
        }
      }  
    });
    
    return result;
  };


  self.hasDominantQuality = function() {
    return (self.hasMajorThirdInterval() && self.hasDominantSeventhInterval());
  };
  
  self.hasDominantSeventhInterval = function() {
    var hit = self.intervals().detect(function(i) { return i == 10; });  
    return (hit != false);
  };

  self.hasMinorThirdInterval = function() {
    var hit = self.intervals().detect(function(i) { return i == 3; });  
    return (hit != false);
  };

  self.hasMajorThirdInterval = function() {
    var hit = self.intervals().detect(function(i) { return i == 4; });  
    return (hit != false);
  };


  self.myThird = function() {
    var hit = self.intervals().detect(function(i) { return (i == 3 || i == 4); });
    if (!hit) { return false; }
    return self.noteFromInterval(hit);  
  }

  self.mySeventh = function() {
    var hit = self.intervals().detect(function(i) { return (i == 11 || i == 10 || i == 9); });
    if (!hit) { return false; }
    return self.noteFromInterval(hit);  
  }


  self.compatibleScaleNames = function() {
    return self.compatibleScales().map(function(s) { return s.fullName(); });
  };    
  self.compatibleScaleAbbrevs = function() {
    return self.compatibleScales().map(function(s) { return s.fullAbbrev(); });
  };
  
  self.abstractlyEqualTo = function(other) {
    ////console.log('otherzz',other);
    var lista = other.notesNotFoundIn(self);
    var listb = self.notesNotFoundIn(other);
    return (lista.length == 0 && listb.length == 0);
  }
  
  
  self.noteAbove = function(other) {
    //console.log('other',other);
  
    var midival = other.value();
    midival += 1;
    var candidate = Note(midival); 
    while (! self.containsNote(candidate)) {
      midival += 1;
      candidate = Note(midival);     
    }
    return candidate;
  };

  self.noteBelow = function(other) {
    //console.log('other',other);
  
    var midival = other.value();
    midival -= 1;
    var candidate = Note(midival); 
    while (! self.containsNote(candidate)) {
      midival -= 1;
      candidate = Note(midival);     
    }
    return candidate;
  };


  self.containsNote = function(otherNote) {
    return self.notes().detect(function(n) { return n.abstractlyEqualTo(otherNote); });
  };

  self.notesNotFoundIn = function(other) {
    return self.notes().reject(function(n) { return other.containsNote(n); });
  };


  self.noteNamesInCommonWith = function(other) {
    return self.noteNames().select(function(each) {
      return other.noteNames().detect(each);
    });
  };
  self.exclusiveNoteNames = function(other) {
    return self.noteNamesLackedBy(other).concat(other.noteNamesLackedBy(self));
  };

  self.noteNamesLackedBy = function(other) {
    return self.noteNames().reject(function(each) {
      return other.noteNames().detect(each);
    });
  };
  
  self.notesLackedBy = function(other) {
  
  
  }
  
  

  self.noteNamesUniqueTo = function(other) {
    return other.noteNames().reject(function(each) {
      return self.noteNames().detect(each);
    });
  };

  self.strangenessTo = function(other) {
    //return self.exclusiveNoteNames(other).length;
    return other.noteNamesLackedBy(self).length;
  };
  
  
  
  self.plus = function(other) {
    var nrn = self.rootNote.plus(other);
    var result = self.constructor({ rootNote: nrn, intervals: spec.intervals, name: spec.name, abbrev: spec.abbrev });
    return result;
  }

  
  
  
  
  
  
  
  

  return self;
};

var Scale = function(spec) {

  ///console.log('Scale spec',spec);

  var self = RootNoteWithIntervals(spec);


  self.constructor = Scale;


  self.degree = function(pos) {
//    return self.notes()[pos-1];
    var bag = self.notes();    
    var octave = bag.map(function(o){ return o.plus(12); });
    var octave2 = bag.map(function(o){ return o.plus(24); });
    octave.each(function(o){ bag.push(o); });
    octave2.each(function(o){ bag.push(o); });
    return bag[(pos - 1) % bag.length];  
    //return notes[(pos - 1) % notes.length];
  };


  self.degrees = function(them) {
    var result = them.map(function(n){  return self.degree(n); });
    return result;  
  };

  self.chordFromDegrees = function(them) {
  
    var degrees = self.degrees(them);
    
    
  
  }


  
  self.intervalForDegree = function(pos) {
    var count = self.intervals().length;
    var octaves = Math.floor((pos - 1) / count);
    var degrees = pos % count;
    if (degrees === 0) {
      degrees = count;
    }
    var totalInterval = octaves * 12;
    //console.log('pos',pos,'count',count,'octaves',octaves,'degrees',degrees,'totalInterval',totalInterval);
    //console.log(self.intervals());
    //console.log(degrees-1);
    totalInterval = totalInterval + self.intervals()[degrees-1];
    
    return totalInterval;
    
  };
    

  return self;
};

var Chord = function(spec) {
  var self = RootNoteWithIntervals(spec);
  
  /////console.log('Chord spec',spec);
  
  
  self.constructor = Chord;

  self.fullAbbrev = function() { //override superclass, don't want space separator
    return self.rootNote.name() + self.abbrev;
  };
  
  
  
  
  
  

  return self;
};











JSMT.Pair = function(x,y) {
  var self = {};
  self.x = x;
  self.y = y;
  return self;
};



JSMT.keeperPalettes = [
  ['#3e9876','#2860a6','#7057b9','#d79200','#dc3642','#00a7d2','#fe6673'],
  ['#ae6414','#641999','#db4ea2','#4eb7d7','#8486d3','#7f1f17','#285edc'],
  ['#8e9247','#9a2b0b','#216708','#621531','#a75eca','#174da8','#e83d21'],
  ['#f16400','#a70f80','#509dc1','#057af5','#8c1322','#be754f','#cf041b'],
  ['#883232','#9e6abc','#69bfa7','#da135b','#4c4392','#717d8e','#78e834'],
  ['#455e7a','#ad616b','#cec349','#864d3d','#50bb9b','#fa5026','#1c5eef'],
  ['#0e73a0','#9d4936','#752e47','#bb3b20','#316737','#e70b10','#0c2097'],
  ['#a24d1a','#deb848','#351c5d','#559d2e','#cd5b44','#6d73d2','#72785a'],
  ['#22837c','#f28b4b','#fd5f66','#e02702','#3ccb7c','#90849f','#2dd09f']
];

JSMT.randomPalette = function() {
  /***
    var result = [
      BSD.randomDarkColor(),
      BSD.randomDarkColor(),
      BSD.randomDarkColor(),
      BSD.randomDarkColor(),
      BSD.randomDarkColor(),
      BSD.randomDarkColor(),
      BSD.randomDarkColor()
    ];
  ****/
  var result = BSD.play(23);


  var mixtureString = '';
  result.each(function(color) {
    mixtureString += '#' + color.toHex() + ',';
  });
  console.log(mixtureString);
  return result;
};

JSMT.myPalette = JSMT.keeperPalettes.atRandom();
////JSMT.myPalette = JSMT.randomPalette();

JSMT.makeSwatch = function(starter) {
  var gradients = 4;
  if (typeof starter == 'string') {
    starter = BSD.colorFromHex(starter);
  }
  var swatch = starter.upTo(BSD.colorFromHex('#eeeeee'),gradients);
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
    if (typeof colorMap[shape] == 'undefined') {
      colorMap[shape] = swatches.pop();
    }
  };
  
  self.getColorForShape = function(shape) {
    var color = colorMap[shape].pop();
    /////console.log(shape,color.toHex());
    return color;
  };
  
  return self;
}


var Grip = function(spec) { //FIXME: grip is a lot like a chord, no?
  var self = spec;
  
  self.frets = spec.frets || [];
  
  
  self.hasFrets = function() {
    return self.frets.length > 0;
  };
  
  self.lightUp = function(color) {
    self.frets.each(function(f){
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
  
  self.numberSort = function(a,b) {
    return a.number - b.number;
  };



  self.toggleLight = function(color) {
    self.frets.each(function(f){
      f.toggleLight(color);
    });
  };


  self.lit = function() {
    var result = self.frets.detect(function(f) { return f.lit; });
    return (result != false);
  };
  
  self.unlit = function() {
    return ! self.lit();
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
    return self.frets.collect(function(f){ return f.string; });
  }


  self.shape = function() {
    var pairs = [];    

    ///console.log(self,'grip');

    var ls = parseInt(self.lowestString().number,10);
    var lf = parseInt(self.lowestFret().number,10);
    var z = self.frets.collect(function(f) { return f.degree; });
    //console.log('z',z,'ls',ls,'lf',lf);
    
    var pairs = self.frets.collect(function(f) { 
      return [f.string.number - ls,f.number - lf]; 
    });
    
    
    var result = pairs.sort().join(',');
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
      frets: nextSet
    });
  };
  return self;
};


JSMT.DegreePicker = function(spec) {
  var degrees = ['1','flat2','2','flat3','3','4','flat5','5','flat6','6','flat7','7'];  
  var state = {};
  degrees.each(function(d) {  state[d] = false; });
  var turnedOn = spec.degreeString.split(',');
  turnedOn.each(function(d) {
    state[d] = true;
  });  
  
  var self = BSD.PubSub({});
  

  self.updateState = function(li,bool) {
      if (bool) { 
        li.addClass('on'); 
        li.removeClass('off'); }
      else { 
        li.addClass('off'); 
        li.removeClass('on'); 
      }
  };
  
  
  self.renderOn = function(html) {
    var label = DOM.label('Toggle Degrees');//////////jQuery('<label>Toggle Degrees (click on square to toggle)</label>');
    var ul = DOM.ul().addClass('toggler');////////jQuery('<ul class="toggler">');
    degrees.each(function(d) {
      var li = DOM.li();/////jQuery('<li>');


      self.updateState(li,state[d]);
      
      
      li.html(JSMT.goShort(d));
      li.click(function() {
        state[d] = ! state[d];
        ///console.log(state[d]);
        self.updateState(li,state[d]);
  
        var chosen = degrees.select(function(d) {
          return state[d];
        });
        
        ////////spec.onUpdate(chosen); //callback
        
        self.publish('update',chosen);
        
      });
      ul.append(li);      
    });
    html.append(label);
    html.append(ul);
    html.append(jQuery('<div style="clear: both; ">&nbsp;</div>'));
  };
  return self;
};