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
    return ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
};

JSMT.twelveNotes = function() {
  return JSMT.twelveTones().map(function(n) { return Note(n); });
};


JSMT.scaleMap = {
    'major' : { name: 'major', intervals: [0,2,4,5,7,9,11] },
    'minor' : { name: 'minor', intervals: [0,2,3,5,7,8,10] },
    'HM' : { name: 'harmonic minor', intervals: [0,2,3,5,7,8,11] },

    'mP' : { name: 'minor pentatonic', intervals: [0,3,5,7,10] },
    '-P' : { name: 'minor pentatonic', intervals: [0,3,5,7,10] },

    'blues' : { name: 'blues', intervals: [0,3,5,6,7,10] },

    'MP' : { name: 'major pentatonic', intervals: [0,2,4,7,9] },
    'nothing':   { name: 'nothing', intervals: [] }
  };

JSMT.chordMap = {
    '': { name: 'major', intervals: [0,4,7] },
    'M': { name: 'major', intervals: [0,4,7] },
    '-':   { name: 'minor', intervals: [0,3,7] },
    'm':   { name: 'minor', intervals: [0,3,7] },

    'M7': { name: 'major7', intervals: [0,4,7,11] },

    '7':   { name: 'dominant7', intervals: [0,4,7,10] },
    'dom7':   { name: 'dominant7', intervals: [0,4,7,10] },





    'm7': { name: 'minor7', intervals: [0,3,7,10] },
    '-7': { name: 'minor7', intervals: [0,3,7,10] },

    'm7b5':  { name: 'minor7Flat5', intervals: [0,3,6,10] },
    '-7b5':  { name: 'minor7Flat5', intervals: [0,3,6,10] },
    '-7-5':  { name: 'minor7Flat5', intervals: [0,3,6,10] },


    '-7+5':  { name: 'minor7Sharp5', intervals: [0,3,8,10] },


    '7b9':  { name: 'sevenFlat9', intervals: [0,1,4,7,10] },


    '7#9':  { name: 'sevenFlat9', intervals: [0,3,4,7,10] },
    '7+9':  { name: 'sevenFlat9', intervals: [0,3,4,7,10] },

    '7sus4':  { name: 'sevenSuspended4', intervals: [0,5,7,10] },


    '6':  { name: 'six', intervals: [0,4,7,9] },

    'o7':  { name: 'diminished 7', intervals: [0,3,6,9] },



    '9':   { name: 'dominant9', intervals: [0,4,7,10,14] },

    '-9':   { name: 'minor9', intervals: [0,3,7,10,14] },
    'm9':   { name: 'minor9', intervals: [0,3,7,10,14] },


    '13':   { name: 'dominant13', intervals: [0,4,7,10,2,9] },

    'nothing':   { name: 'nothing', intervals: [] }
  };



var Note = function(foo) {
  ////var self = spec;/////NotePrimitive(spec);
  
  var self = {};
  
  self.abstractValue = function() {
    return self.value() % 12;
  };
  
  self.abstractlyEqualTo = function(otherNote) {
    return otherNote.abstractValue() == self.abstractValue();
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
  self.nameFromValue = function(value) {
    var tt = JSMT.twelveTones();
    return tt[value%12];
  };
  self.valueFromName = function(name) {
    var sharps = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var flats = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];    
    var idx = sharps.indexOf(name);
    if (idx == -1) {
      idx = flats.indexOf(name);
    }             
    ///console.log('idx',idx);
    
    return 60 + idx;
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
  return Note(rootName).scale(scaleName);
}




var RootNoteWithIntervals = function(spec) {

  ///console.log('rnwi',spec);

  var self = {};
  
  self.constructor = RootNoteWithIntervals;
  
  self.name = spec.name || 'no name given';
  self.abbrev = spec.abbrev || 'no abbrev';
  self.rootNote = spec.rootNote;
  self.intervals = function() { 
    return spec.intervals; 
  };
  
  self.invertDown = function() {  
    var newSet = self.noteValues();
    var jumper = newSet.pop();
    jumper -= 12; 
    newSet.push(jumper);
    newSet = newSet.sort();    
    newRoot = Note(newSet[0]);
    var newIntervals = newSet.map(function(v) { return v - newRoot.value(); });
    return self.constructor({ rootNote: newRoot, intervals: newIntervals });
  };
  
  self.invertUp = function() {  
    var newSet = self.noteValues();
    var jumper = newSet.shift();
    jumper += 12; 
    newSet.push(jumper);
    newSet = newSet.sort();    
    newRoot = Note(newSet[0]);
    var newIntervals = newSet.map(function(v) { return v - newRoot.value(); });
    return self.constructor({ rootNote: newRoot, intervals: newIntervals });
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
    return self.notes().map(function(note) { return note.value(); });    
  };
  
  
  self.fullName = function() {
    return self.rootNote.name() + ' ' + self.name;
  };

  self.fullAbbrev = function() {
    return self.rootNote.name() + ' ' + self.abbrev;
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


      


  /*
  self.containsNoteName = function(other) {
    return self.noteNames().detect(function(nn) { return nn == other; });
  };
  self.containsNoteNameOfValue = function(other) {
    return self.containsNoteName(other.name());
  };
  self.containsNoteNameOfNote = function(other) {
    return self.containsNoteName(other.name());
  };
  self.containsNoteNamesOfRootNoteWithIntervals = function(other) {      
    var strangers = other.noteNames().reject(function(each) {
      return self.noteNames().detect(each);
    }); 
    return (strangers.length == 0);
  };
    
  self.contains = function(other) {
    if (typeof other === "string") {
      return self.containsNoteName(other);
    }
    else if (typeof other === "number") {
      return self.containsNoteNameOfValue(other);
    }
    else if (typeof other.value === "function") {
      return self.containsNoteNameOfNote(other);
    }
    else if (typeof other.noteNames === "function") {
      return self.containsNoteNamesOfRootNoteWithIntervals(other);
    }
  };

  */

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

  return self;
};

var Scale = function(spec) {

  ///console.log('Scale spec',spec);

  var self = RootNoteWithIntervals(spec);


  self.constructor = Scale;


  self.degree = function(pos) {
    return self.notes()[pos-1];
  };
  
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
  self.constructor = Chord;

  self.fullAbbrev = function() { //override superclass, don't want space separator
    return self.rootNote.name() + self.abbrev;
  };

  return self;
};











JSMT.Pair = function(x,y) {
  var interface = {};
  interface.x = x;
  interface.y = y;
  return interface;
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

  var interface = {};
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
  
  interface.addShape = function(shape) {
    if (typeof colorMap[shape] == 'undefined') {
      colorMap[shape] = swatches.pop();
    }
  };
  
  interface.getColorForShape = function(shape) {
    var color = colorMap[shape].pop();
    /////console.log(shape,color.toHex());
    return color;
  };
  
  return interface;
}


var Grip = function(spec) { //FIXME: grip is a lot like a chord, no?
  var interface = spec;
  
  interface.frets = spec.frets || [];
  
  
  interface.hasFrets = function() {
    return interface.frets.length > 0;
  };
  
  interface.lightUp = function(color) {
    interface.frets.each(function(f){
      f.lightUp(color);
    });
  };

  interface.lightUpWithHarmonics = function(color) {
    interface.lightUp(color);
    interface.frets.each(function(f) {
      f.harmonics().each(function(h) {
        h.lightUp(color);
      });
    });
  };
  
  interface.numberSort = function(a,b) {
    return a.number - b.number;
  };



  interface.toggleLight = function(color) {
    interface.frets.each(function(f){
      f.toggleLight(color);
    });
  };


  interface.lit = function() {
    var result = interface.frets.detect(function(f) { return f.lit; });
    return (result != false);
  };
  
  interface.unlit = function() {
    return ! interface.lit();
  };

  interface.lowestFret = function() {
    var them = interface.frets.sort(interface.numberSort);
    return them[0];
  };
  interface.lowestString = function() {
    var them = interface.strings().sort(interface.numberSort);
    return them[0];
  };
  
  interface.strings = function() {
    return interface.frets.collect(function(f){ return f.string; });
  }


  interface.shape = function() {
    var pairs = [];    

    ///console.log(interface,'grip');

    var ls = parseInt(interface.lowestString().number,10);
    var lf = parseInt(interface.lowestFret().number,10);
    var z = interface.frets.collect(function(f) { return f.degree; });
    //console.log('z',z,'ls',ls,'lf',lf);
    
    var pairs = interface.frets.collect(function(f) { 
      return [f.string.number - ls,f.number - lf]; 
    });
    
    
    var result = pairs.sort().join(',');
    ///console.log('shape',result);
    return result;    
  };

  interface.nextFrets = function() {
    var candidates = [];
    interface.frets.each(function(f) {
      var higherSet = f.higherFrettedFrets();
      if (higherSet.length > 0) {
       candidates.push(higherSet[0]); 
      }
    });
    return candidates;
  };
  
  interface.nextGrip = function() {
    var nextSet = interface.nextFrets();
    ///console.log(nextSet,'next');
    return Grip({
      frets: nextSet
    });
  };
  return interface;
};


JSMT.DegreePicker = function(spec) {
  var degrees = ['1','flat2','2','flat3','3','4','flat5','5','flat6','6','flat7','7'];  
  var state = {};
  degrees.each(function(d) {  state[d] = false; });
  var turnedOn = spec.degreeString.split(',');
  turnedOn.each(function(d) {
    state[d] = true;
  });  
  
  var interface = {};
  interface.renderOn = function(html) {
    var label = jQuery('<label>Toggle Degrees (click on square to toggle)</label>');
    var ul = jQuery('<ul class="toggler">');
    degrees.each(function(d) {
      var li = jQuery('<li>');
      
      if (state[d]) { 
        li.addClass('on'); 
        li.removeClass('off'); }
      else { 
        li.addClass('off'); 
        li.removeClass('on'); 
      }
      
      li.html(JSMT.goShort(d));
      li.click(function() {
        state[d] = ! state[d];
        ///console.log(state[d]);
        
        var chosen = degrees.select(function(d) {
          return state[d];
        });
        
        spec.onUpdate(chosen); //callback
      });
      ul.append(li);      
    });
    html.append(label);
    html.append(ul);
    html.append(jQuery('<div style="clear: both; ">&nbsp;</div>'));
  };
  return interface;
};