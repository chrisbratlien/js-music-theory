import JSMT, {Note} from "./js-music-theory.js";
import Scale from "./Scale.js";

export const RootNoteWithIntervals = function(spec) {
    ///console.log('rnwi',spec);
  
    var self = {};
  
    self.spec = spec;
  
    self.constructor = RootNoteWithIntervals;
  
    self.name = spec.name || "no name given";
  
    self.abbrev = spec.abbrev;
    if (!self.abbrev) {
      if (spec.name == "major") {
        self.abbrev = ""; //ok to be blank
      } else {
        self.abbrev = "no abbrev given";
      }
    }
  
    self.rootNote = spec.rootNote;
  
    self.intervalHash = function() {
      //return a number which, in binary, would represent a 12-bit string with 1s for
      //each interval.
      //The fact that the 0 interval (root note) will hit the 0x800 in the bitmask
      //takes care of allocating the 12 bits because
      //(0x800).toString(2) = "100000000000"
      return JSMT.twelveBitHash(spec.intervals);
    };
    self.intervalBitString = function() {
      return self
        .intervalHash()
        .toString(2)
        .padStart(12, "0");
    };
  
    self.chromaticHash = function() {
      return JSMT.twelveBitHash(self.chromaticNoteValues());
    };
    self.chromaticBitString = function() {
      return self
        .chromaticHash()
        .toString(2)
        .padStart(12, "0");
    };
  
    self.getAccidental = function() {
      if (spec.rootNote.accidental) {
        return spec.rootNote.accidental;
      }
  
      //root note isn't sharp or flat, so...
      if (self.hasMinorQuality()) {
        return "♭";
      }
      if (self.hasMinorSeventhInterval()) {
        return "♭";
      }
      //otherwise
      return "♯";
    };
  
    /////console.log('self.name',self.name);
  
    self.intervals = function() {
      return spec.intervals.sort(function(a, b) {
        return a - b;
      });
    };
  
    self.invertDown = function() {
      var newSet = self.noteValues();
      var jumper = newSet.pop();
      jumper -= 12;
      newSet.push(jumper);
      newSet = newSet.sort(function(a, b) {
        return a - b;
      });
      var newRoot = Note(newSet[0]);
      var newIntervals = newSet.map(function(v) {
        return v - newRoot.value();
      });
      return self.constructor({ rootNote: newRoot, intervals: newIntervals });
    };
  
    self.invertUp = function() {
      var values = self.noteValues();
  
      var lowest = values[0];
      var rest = values.slice(1);
      rest.push(lowest + 12);
      rest = rest.sort(function(a, b) {
        return a - b;
      });
      var newRoot = Note(rest[0]);
      var newIntervals = rest.map(function(v) {
        return v - newRoot.value();
      });
      return self.constructor({ rootNote: newRoot, intervals: newIntervals });
    };
  
    self.octaveDown = function() {
      return self.constructor({
        rootNote: self.rootNote.plus(-12),
        intervals: self.intervals(),
      });
    };
  
    self.octaveUp = function() {
      return self.constructor({
        rootNote: self.rootNote.plus(12),
        intervals: self.intervals(),
      });
    };
  
    self.drop2 = function() {
      var nv = self.noteValues();
      ////console.log('nv before',nv);
  
      var dropped = nv.map(function(o, i) {
        if (i == nv.length - 2) {
          //2nd to highest
          return o - 12;
        }
        return o;
      });
  
      var sorted = dropped.sort();
  
      console.log("dropped after", dropped);
  
      var newGuy = JSMT.rnwiFromNoteValues(sorted);
      var result = self.constructor(newGuy.spec);
      return result;
    };
  
    self.noteFromInterval = function(interval) {
      return Note(
        self.rootNote.value() + interval,
        self.getAccidental()
        ////self.rootNote.accidental
      );
    };
  
    self.notes = function() {
      return self.intervals().map(function(interval) {
        return self.noteFromInterval(interval);
      });
    };
    self.noteNames = function() {
      return self.notes().map(function(note) {
        var useFlat =
          (!spec.rootNote.accidental && self.hasMinorQuality()) ||
          (spec.rootNote.accidental && spec.rootNote.accidental.match(/b|♭/));
        return note.name(spec.rootNote.accidental || (useFlat && "♭"));
      });
    };
  
    self.noteValues = function() {
      return self
        .notes()
        .map(function(note) {
          return note.value();
        })
        .sort(function(a, b) {
          return a - b;
        });
    };
    self.abstractNoteValues = function() {
      return self
        .notes()
        .map(function(note) {
          return note.abstractValue();
        })
        .sort(function(a, b) {
          return a - b;
        });
    };
  
    self.chromaticNoteValues = self.abstractNoteValues;
  
    self.highestNoteValue = function() {
      var them = self.noteValues();
      return them[them.length - 1];
    };
  
    self.lowestNoteValue = function() {
      var them = self.noteValues();
      return them[0];
    };
  
    self.fullName = function() {
      return self.rootNote.name() + " " + self.name;
    };
  
    self.fullAbbrev = function() {
      return self.rootNote.name() + " " + self.abbrev;
    };
  
    self.utf8FullAbbrev = function() {
      return self.rootNote.utf8Name() + JSMT.toUTF8(self.abbrev);
    };
  
    self.compatibleScales = function() {
      var result = [];
      JSMT.twelveNotes().each(function(n) {
        for (key in JSMT.scaleMap) {
          var spec = JSMT.scaleMap[key];
          var scale = Scale({
            rootNote: n,
            intervals: spec.intervals,
            name: spec.name,
            abbrev: key,
          });
          var outsiders = self.notesNotFoundIn(scale);
          if (outsiders.length == 0) {
            result.push(scale);
          }
        }
      });
  
      return result;
    };
  
    self.hasDominantQuality = function() {
      return self.hasMajorThirdInterval() && self.hasDominantSeventhInterval();
    };
    self.hasMajorSeventhQuality = function() {
      return self.hasMajorThirdInterval() && self.hasMajorSeventhInterval();
    };
    self.hasMinorSeventhQuality = function() {
      return self.hasMinorThirdInterval() && self.hasMinorSeventhInterval();
    };
  
    self.hasDominantSeventhInterval = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 10;
      });
      return hit !== false;
    };
    self.hasMinorSeventhInterval = self.hasDominantSeventhInterval;
  
    self.hasMajorSeventhInterval = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 11;
      });
      return hit !== false;
    };
  
    self.hasMinorThirdInterval = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 3;
      });
      return hit !== false;
    };
    self.hasMinorQuality = self.hasMinorThirdInterval;
  
    self.hasMajorThirdInterval = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 4;
      });
      return hit !== false;
    };
    self.hasMajorQuality = self.hasMajorThirdInterval;
  
    self.hasPerfectFifthInterval = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 7;
      });
      return hit !== false;
    };
  
    self.myThird = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 3 || i == 4;
      });
      if (!hit) {
        return false;
      }
      return self.noteFromInterval(hit);
    };
  
    self.mySeventh = function() {
      var hit = self.intervals().detect(function(i) {
        return i == 11 || i == 10 || i == 9;
      });
      if (!hit) {
        return false;
      }
      return self.noteFromInterval(hit);
    };
  
    self.myFifth = function() {
      var hit7 = self.intervals().detect(function(i) {
        return i == 7;
      });
      if (hit7) {
        return self.noteFromInterval(hit7);
      }
  
      var hit6 = self.intervals().detect(function(i) {
        return i == 6;
      });
      if (hit6) {
        return self.noteFromInterval(hit6);
      }
  
      var hit8 = self.intervals().detect(function(i) {
        return i == 8;
      });
      if (hit8) {
        return self.noteFromInterval(hit8);
      }
  
      return false;
    };
  
    self.compatibleScaleNames = function() {
      return self.compatibleScales().map(function(s) {
        return s.fullName();
      });
    };
    self.compatibleScaleAbbrevs = function() {
      return self.compatibleScales().map(function(s) {
        return s.fullAbbrev();
      });
    };
  
    self.abstractlyEqualTo = function(other) {
      ////console.log('otherzz',other);
      var lista = other.notesNotFoundIn(self);
      var listb = self.notesNotFoundIn(other);
      return lista.length == 0 && listb.length == 0;
    };
  
    self.noteAbove = function(other) {
      //console.log('other',other);
  
      var midival = other.value();
      midival += 1;
      var candidate = Note(midival);
      while (!self.containsNote(candidate)) {
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
      while (!self.containsNote(candidate)) {
        midival -= 1;
        candidate = Note(midival);
      }
      return candidate;
    };
  
    self.containsNote = function(otherNote) {
      return self.notes().detect(function(n) {
        return n.abstractlyEqualTo(otherNote);
      });
    };
  
    self.notesNotFoundIn = function(other) {
      var selfNotes = self.notes();
      return selfNotes.reject(function(n) {
        return other.containsNote(n);
      });
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
  
    self.notesLackedBy = function(other) {};
  
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
      var result = self.constructor({
        rootNote: nrn,
        intervals: spec.intervals,
        name: spec.name,
        abbrev: spec.abbrev,
      });
      return result;
    };
  
    return self;
  };
  export default RootNoteWithIntervals;