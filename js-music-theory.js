if (typeof Object.create !== 'function') {
     Object.create = function (o) {
         var F = function () {};
         F.prototype = o;
         return new F();
     };
}

if ((typeof log) == 'undefined') {
  function log(msg) {
    if ((typeof console) == 'undefined')
      alert(msg);
    else
      console.log(msg);
  }
}


var MusicTheory = {
 
  map: function(ary,fn) {
    var result = [];
    for(i = 0; i < ary.length; i++) {
      result.push(fn(ary[i]));
    }
    return result;
  }
};

var NotePrimitive = function(spec) {
  var that = {};
  that.value = spec.value || 0;
  that.add = function(other) { 
    if (typeof other == "number")
      return NotePrimitive({value: other + that.value}); 
    else
      return NotePrimitive({value: other.value + that.value}); 
  };

  that.sub = function(other) { 
    if (typeof other == "number")
      return NotePrimitive({value: that.value - other}); 
    else
      return NotePrimitive({value: that.value - other.value}); 
  };

  return that; 
};

var Note = function(spec) {
  var that = NotePrimitive(spec);
  that.name = function() { 
    return this.nameFromValue(that.value);
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

  that.majorChord = function() {
    return Chord({rootNote: this, intervals: [0,4,7]});
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
    return MusicTheory.map(that.intervals(),function(interval) { return Note({value: that.rootNote.value + interval}); });    
  };
  that.noteNames = function() {
    return MusicTheory.map(that.notes(),function(note) { return note.name(); });    
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
    if (degrees == 0)
      degrees = count;
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



