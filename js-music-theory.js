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
JSMT.strings = [];

JSMT.guitars = [];

JSMT.MAXFRETS = 36;



var NotePrimitive = function(spec) {
  var that = {};
  that.value = function() {
    return spec.value || 0;
  };
  that.add = function(other) { 
    if (typeof other == "number") {
      return NotePrimitive({value: other + that.value()}); 
    } else {
      return NotePrimitive({value: other.value() + that.value()}); 
    }
  };

  that.sub = function(other) { 
    if (typeof other == "number") {
      return NotePrimitive({value: that.value() - other}); 
    } else {
      return NotePrimitive({value: that.value() - other.value()}); 
    }
  };

  return that; 
};

var Note = function(spec) {
  var that = NotePrimitive(spec);
  that.name = function() { 
    return this.nameFromValue(that.value());
  };
  that.nameFromValue = function(value) {
    var tt = that.twelveTones();
    return tt[value%12];
  };
  that.valueFromName = function(name) {
    return 60 + that.twelveTones().indexOf(name);
    
  };
  that.twelveTones = function() {
    return ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  };
  
  that.majorScale = function() {
    return Scale({rootNote: this, intervals: [0,2,4,5,7,9,11]});
  };
  that.minorScale = function() {
    return Scale({rootNote: this, intervals: [0,2,3,5,7,8,10]});
  };


  that.majorChord = function() {
    return Chord({rootNote: this, intervals: [0,4,7]});
  };
  that.minorChord = function() {
    return Chord({rootNote: this, intervals: [0,3,7]});
  };

  return that; 
};

var RootNoteWithIntervals = function(spec) {
  var that = {};
  that.rootNote = spec.rootNote;
  that.intervals = function() { 
    return spec.intervals; 
  };
  that.notes = function() {
    return MusicTheory.map(that.intervals(),function(interval) { return Note({value: that.rootNote.value() + interval}); });    
  };
  that.noteNames = function() {
    return MusicTheory.map(that.notes(),function(note) { return note.name(); });    
  };
  that.noteValues = function() {
    return MusicTheory.map(that.notes(),function(note) { return note.value(); });    
  };  
  that.containsNoteName = function(other) {
    return MusicTheory.include(that.noteNames(),other); 
  };
  that.containsNoteNameOfValue = function(other) {
    return MusicTheory.include(that.noteNames(),Note({value: other}).name()); 
  };
  that.containsNoteNameOfNote = function(other) {
    return MusicTheory.include(that.noteNames(),other.name()); 
  };
  that.containsNoteNamesOfRootNoteWithIntervals = function(other) {      
    var strangers = MusicTheory.reject(other.noteNames(),function(each) {
      return MusicTheory.include(that.noteNames(),each);
    }); 
    return (strangers.length == 0);
  };  
  that.contains = function(other) {
    if (typeof other === "string") {
      return that.containsNoteName(other);
    }
    else if (typeof other === "number") {
      return that.containsNoteNameOfValue(other);
    }
    else if (typeof other.value === "function") {
      return that.containsNoteNameOfNote(other);
    }
    else if (typeof other.noteNames === "function") {
      return that.containsNoteNamesOfRootNoteWithIntervals(other);
    }
  };

  that.noteNamesInCommonWith = function(other) {
    return MusicTheory.select(that.noteNames(),function(each) {
      return MusicTheory.include(other.noteNames(),each);
    });
  };
  that.exclusiveNoteNames = function(other) {
    return that.noteNamesLackedBy(other).concat(other.noteNamesLackedBy(that));
  };

  that.noteNamesLackedBy = function(other) {
    return MusicTheory.reject(that.noteNames(),function(each) {
      return MusicTheory.include(other.noteNames(),each);
    });
  };

  that.noteNamesUniqueTo = function(other) {
    return MusicTheory.reject(other.noteNames(),function(each) {
      return MusicTheory.include(that.noteNames(),each);
    });
  };

  that.strangenessTo = function(other) {
    //return that.exclusiveNoteNames(other).length;
    return other.noteNamesLackedBy(that).length;
  };

  return that;
};

var Scale = function(spec) {
  var that = RootNoteWithIntervals(spec);

  that.degree = function(pos) {
    return that.notes()[pos-1];
  };
  
  that.intervalForDegree = function(pos) {
    var count = that.intervals().length;
    var octaves = Math.floor((pos - 1) / count);
    var degrees = pos % count;
    if (degrees === 0) {
      degrees = count;
    }
    var totalInterval = octaves * 12;
    //console.log('pos',pos,'count',count,'octaves',octaves,'degrees',degrees,'totalInterval',totalInterval);
    //console.log(that.intervals());
    //console.log(degrees-1);
    totalInterval = totalInterval + that.intervals()[degrees-1];
    
    return totalInterval;
    
  };
    

  return that;
};

var Chord = function(spec) {
  var that = RootNoteWithIntervals(spec);
  return that;
};


var Finger = function(spec) {

  var interface = spec;
  
  interface.string = spec.string;
  interface.fret = spec.fret;
  interface.scale = spec.scale;
  interface.degree = spec.degree;  
  return interface;
};




var Fret = function(spec) {

  //private
  var div = document.createElement('div');

  //interface
  var that = {};
  that.number = spec.number || 0;
  that.value = spec.value || 0;
  that.fretted = spec.fretted || false;
  that.degree = spec.degree || false;
  that.lit = spec.lit || false;
  that.string = spec.string || false;
  
  that.toString = function() {
    return '(' + 's: ' + that.string.number + ', f: ' + that.number + ')';
  };
  
  
  that.guitar = function() {
    return that.string.guitar;
  };

  that.goShort = function (orig) { 
    result = orig;
    result = result.replace(/flat/g,'b');
    result = result.replace(/sharp/g,'#');
    //result = result.replace(/flat/g,'&#x266d;');
    //result = result.replace(/sharp/g,'&#x266f;');
    return result;  
  }

  that.goLong = function(orig) {
    result = orig;
    result = result.replace(/b/g,'flat');
    result = result.replace(/#/g,'sharp');
    
    //result = result.replace(/&#x266d;/g,'flat');
    //result = result.replace(/&#x266f;/g,'sharp');
    return result;
  };


  that.higherFrets = function() {
    return that.string.frets.select(function(f) {
      return f.number > that.number;
    });
  };

  that.higherFrettedFrets = function() {
    return that.higherFrets().select(function(f) {
      return f.fretted;
    });
  };

  that.harmonics = function() {
    return that.string.frets.select(function(f) {
      return that.number % 12 == f.number %12; 
    });
  };
  
  that.unlitHarmonics = function() {
    return that.harmonics().select(function(h) { return h.unlit();})
  };

  that.changeColor = function(color){
    $(div).css('background','#' + color.toHex());
  };

  that.toggleLight = function(hexColor) {
    if (that.lit) {
      that.dim();
    }
    else {
      that.lightUp(hexColor);
    }
  };
  that.lightUp = function(color) {
    that.lit = true;
    if (that.lit) {
      that.changeColor(color);
    }
  };
  that.dim = function() {
    that.lit = false;
    if (that.fretted) {
      that.changeColor(BSD.Color({ r: 119, g: 119, b: 119 })); //'#777'
    }
    else {
      that.changeColor(BSD.Color({ r: 221, g: 221, b: 221 })); //#ddd
    }
  };

  that.renderOn = function(html) {
    $(div).addClass('fret');
    $(div).addClass('fret-number-' + that.number);
    if (that.fretted) {
      $(div).addClass('fretted');
      $(div).html(that.goShort(that.degree));  
      $(div).css('background','#777');          
    }  
          
    $(div).click(function() {
      ////console.log('obserrr',that);

      var grip = that.guitar().firstGrip;
      grip.frets.push(that);
      
      
      ////that.toggleLight($('#color').val()); //harmonics() includes itself

      that.harmonics().each(function(f) { //harmonics() includes itself
        f.toggleLight(BSD.colorFromHex($('#color').val()));
      });
    });  
    $(html).append(div);
  };
  return that;
}







JSMT.Pair = function(x,y) {
  var interface = {};
  interface.x = x;
  interface.y = y;
  return interface;
};

JSMT.HarmonizeSession = function() {

  var interface = {};
  var colorMap = {};
  
  var gradients = 5;
  
  
  var blues = BSD.colorFromHex('#1f0ab2').upTo(BSD.colorFromHex('#eeeeff'),gradients);
  var reds = BSD.colorFromHex('#b20a1e').upTo(BSD.colorFromHex('#ffffeeee'),gradients);
  var purples = BSD.colorFromHex('#600eaf').upTo(BSD.colorFromHex('#ffeeff'),gradients);
  var oranges = BSD.colorFromHex('#f06a00').upTo(BSD.colorFromHex('#ffffee'),gradients);
  var greens = BSD.colorFromHex('#089900').upTo(BSD.colorFromHex('#eeffee'),gradients);
  var cyans = BSD.colorFromHex('#009ba8').upTo(BSD.colorFromHex('#eeffff'),gradients);


  var swatches = [
    BSD.colorFromHex('#c979dc').upTo(BSD.colorFromHex('#eeeeee'),gradients),
    BSD.colorFromHex('#d31d89').upTo(BSD.colorFromHex('#eeeeee'),gradients),
    BSD.colorFromHex('#e69b4c').upTo(BSD.colorFromHex('#eeeeee'),gradients),
    BSD.colorFromHex('#38ad46').upTo(BSD.colorFromHex('#eeeeee'),gradients),
    BSD.colorFromHex('#959dd0').upTo(BSD.colorFromHex('#eeeeee'),gradients),
    BSD.colorFromHex('#7a2e71').upTo(BSD.colorFromHex('#eeeeee'),gradients),
    BSD.colorFromHex('#d2e675').upTo(BSD.colorFromHex('#eeeeee'),gradients)
  ];

    
  var starters = [
    '#59096c',
    '#630d19',
    '#e69b4c',
    '#187d16',
    '#151d50',
    '#76a707',
    '#0d9595',  
  ];
  
  var mixture = [];
  while (mixture.length < 7) {
    var candidate = starters.atRandom();
    if (mixture.indexOf(candidate) == -1) {
      mixture.push(candidate);
    }    
  }
  var swatches = [];
  mixture.each(function(hex) {
    var swatch = BSD.colorFromHex(hex).upTo(BSD.colorFromHex('#eeeeee'),gradients);
    swatches.push(swatch);
  });

  
  /////var swatches = [blues,oranges,cyans,reds,greens];
  
  ///swatches.reverse(); //so they'll pop in the order shown in the definition of swatches
  
  
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
    console.log(shape,color.toHex());
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
    console.log('shape',result);
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
