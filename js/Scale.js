import RootNoteWithIntervals from "./RootNoteWithIntervals.js";
export const Scale = function(spec) {
    ///console.log('Scale spec',spec);
  
    var self = RootNoteWithIntervals(spec);
  
    self.constructor = Scale;
  
    self.degree = function(pos) {
      //    return self.notes()[pos-1];
      var bag = self.notes();
      var octave = bag.map(function(o) {
        return o.plus(12);
      });
      var octave2 = bag.map(function(o) {
        return o.plus(24);
      });
      octave.each(function(o) {
        bag.push(o);
      });
      octave2.each(function(o) {
        bag.push(o);
      });
      return bag[(pos - 1) % bag.length];
      //return notes[(pos - 1) % notes.length];
    };
  
    self.degrees = function(them) {
      var result = them.map(function(n) {
        return self.degree(n);
      });
      return result;
    };
  
    self.chordFromDegrees = function(them) {
      var degrees = self.degrees(them);
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
      totalInterval = totalInterval + self.intervals()[degrees - 1];
  
      return totalInterval;
    };
  
    return self;
  };
  

  export default Scale;