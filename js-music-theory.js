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



var MusicTheory = {
 
  include: function(ary,o) {
    return (ary.indexOf(o) > -1);
  },

  collect: function(ary,fn) {
    var result = [];
    for(var i = 0; i < ary.length; i++) {
      result.push(fn(ary[i]));
    }
    return result;
  },

  map: function(ary,fn) {
    return this.collect(ary,fn);
  },

  reject: function(ary,fn) {
    var result = [];
    for(var i = 0; i < ary.length; i++) {
      if (!fn(ary[i])) {
        result.push(ary[i]);
      }
    }
    return result;
  },

  select: function(ary,fn) {
    var result = [];
    for(var i = 0; i < ary.length; i++) {
      if (fn(ary[i])) {
        result.push(ary[i]);
      }
    }
    return result;
  }

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



