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
      $(div).html(JSMT.goShort(that.degree));  
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



JSMT.keeperPalettes = [
  ['#3e9876','#2860a6','#7057b9','#d79200','#dc3642','#00a7d2','#fe6673'],
  ['#1b1d22','#425000','#39166c','#940812','#056921','#0e00b1','#0cac01'],
  ['#ae6414','#641999','#db4ea2','#4eb7d7','#8486d3','#7f1f17','#285edc'],
  ['#8e9247','#9a2b0b','#216708','#621531','#a75eca','#174da8','#e83d21'],
  ['#f16400','#a70f80','#509dc1','#057af5','#8c1322','#be754f','#cf041b'],
  ['#1cbcbd','#7c6c02','#989791','#b421cb','#f81e9e','#0eaadf','#4f9323'],
  ['#883232','#9e6abc','#69bfa7','#da135b','#4c4392','#717d8e','#78e834'],
  ['#455e7a','#ad616b','#cec349','#864d3d','#50bb9b','#fa5026','#1c5eef']
/*
  ['#185a6f','#6f9d10','#bb254b','#261e3d','#7f1888','#a8020d','#0015ed'],
  ['#7d481e','#229a3f','#1b44ac','#340349','#e41a0e','#950a6f','#02f31d'],
  ['#814caf','#af6b15','#1051af','#6c0d24','#020418','#664a55','#34a455'],
  ['#350503','#aa1c2d','#307484','#2a6404','#6b3916','#1a25b1','#18156b'],
  ['#186e4f','#532c0a','#a12937','#141c9e','#838313','#0c2840','#1a02eb']
*/
//  ['#0e73a0','#9d4936','#752e47','#bb3b20','#316737','#e70b10','#0c2097'],

//    ['#0D0824','#A29C33','#6B1C17','#6338C2'],
//    ['#c90314','#4d2f11','#258b22','#143584','#486139'],
//    ['#142949','#9a1e12','#254351','#8d1d36','#811e4d'],
//    ['#8e0821','#0c2aba','#1e696a','#6b1068','#6c4c19','#2c6048','#0b494a'],
//    ['#217368','#200421','#d70f19','#476156','#992d27','#035f03','#460202'],
//    ['#57600b','#164c55','#7c7a02','#27057e','#082a54','#0cc41d','#1fd822'],
//    ['#cf2f24','#8b2c68','#3841af','#ea3e02','#504003','#2c0803','#113b74'],
//    ['#4204a3','#27a415','#1e076d','#f11215','#671a3b','#1d2a9b','#944100'],
//    ['#635e26','#1b4326','#1f595e','#3b780d','#7e8b08','#23535c','#482f2a']
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
  var degrees = ['1','flat2','2','flat3','3','4','flat5','5','sharp5','6','flat7','7'];  
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