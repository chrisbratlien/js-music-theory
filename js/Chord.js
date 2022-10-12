import RootNoteWithIntervals from "./RootNoteWithIntervals.js";

export const Chord = function(spec) {
    var self = RootNoteWithIntervals(spec);
  
    /////console.log('Chord spec',spec);
  
    self.constructor = Chord;
  
    self.fullAbbrev = function() {
      //override superclass, don't want space separator
      return self.rootNote.name() + self.abbrev;
    };
  
    return self;
  };
  
  export default Chord;