BSD.Widgets.TonalityGuru = function(spec) {
  var self = BSD.PubSub({});



  self.analyze = function(o) {

    var result = {};


    var tonalityRootNote = false;
    var tonalityScale = false;
    var just = 'no just';

    var bar = o.current.bar;
    var chord = o.current.chord;
    var currentChord = chord;
    var nextChord = o.next.chord;
    var nextChord2 = o.next.next.chord;
    var prevChord = o.prev.chord;
    var barCount = o.current.barCount;
    var isMinor7b5 = currentChord.abbrev == '-7b5';
    var nextChordDominant = nextChord.hasDominantQuality();
    var nextChordMinorThird = nextChord.hasMinorThirdInterval();
    var currentChordDominant = currentChord.hasDominantQuality();
    var currentChordMinorThird = currentChord.hasMinorThirdInterval();
    var isTwoToNextChord = (currentChord.rootNote.fourth().abstractValue() == nextChord.rootNote.abstractValue());
    var isSubstituteDominant = (currentChord.abbrev == '7' && currentChord.rootNote.plus(-1).abstractValue() == nextChord.rootNote.abstractValue());
        /////if (isSubstituteDominant) { alert('SUBST!'); }
        ///console.log('isTwoToNextChord',isTwoToNextChord);
    var isTwoInMinorTwoFive = (isTwoToNextChord && isMinor7b5 && nextChordDominant);
    //console.log('isTwoInMinorTwoFive',isTwoInMinorTwoFive);
    var isTwoInMajorTwoFive = (isTwoToNextChord && !isMinor7b5 && currentChordMinorThird && nextChordDominant);
    var isFiveInTwoFive = (prevChord.rootNote.fourth().abstractValue() == currentChord.rootNote.abstractValue());
        
    
    if (!tonalityScale && isTwoInMinorTwoFive) {
      tonalityRootNote = currentChord.rootNote.plus(-2);
      tonalityScale = tonalityRootNote.scale('harmonic minor');
      just = 1;
    }
        
    if (!tonalityScale && isTwoToNextChord && currentChordDominant && nextChordMinorThird) {
      tonalityRootNote = nextChord.rootNote;
      if (prevChord.abbrev == '-7b5' && isFiveInTwoFive) {
        tonalityRootNote = nextChord.rootNote;
        tonalityScale = tonalityRootNote.scale('harmonic minor');
      just = 2;
      }
      else {
        if (prevChord.abbrev == '-7' && isFiveInTwoFive) {
          /**
          tonalityRootNote = nextChord.rootNote;
          tonalityScale = tonalityRootNote.scale('major');
          ***/
          var tonalityRootNote = currentChord.rootNote.plus(2);
          tonalityScale = tonalityRootNote.scale('minor');
          just = 3;
        }
      }
    }
        
    if (!tonalityScale && isTwoToNextChord && currentChord.abbrev == '-7' && nextChord.abbrev == '7') {
          tonalityRootNote = nextChord.rootNote.plus(2);
          tonalityScale = tonalityRootNote.scale('minor');
          just = 4;
    }


    if (!tonalityScale && isTwoToNextChord && currentChord.abbrev == '7' && nextChord.abbrev == '6') {
          tonalityRootNote = currentChord.rootNote.plus(2);
          tonalityScale = tonalityRootNote.scale('minor');
          just = 5;
    }

    if (!tonalityScale && isFiveInTwoFive && prevChord.abbrev == '7' && currentChord.abbrev == '6') {
          tonalityRootNote = prevChord.rootNote.plus(2);
          tonalityScale = tonalityRootNote.scale('minor');
        just = 6;
    }


    if (!tonalityScale && currentChord.abbrev == '6') {
          tonalityRootNote = currentChord.rootNote;
          tonalityScale = tonalityRootNote.scale('major');
        just = 7;
    }

    if (!tonalityScale && currentChord.abbrev == '-6') {
          tonalityRootNote = currentChord.rootNote;
          //tonalityScale = tonalityRootNote.scale('minor');
          tonalityScale = tonalityRootNote.scale('dorian');
          just = 8;
    }

    if (!tonalityScale && currentChord.abbrev == '-7b5') {
          tonalityRootNote = currentChord.rootNote.plus(-2);
          tonalityScale = tonalityRootNote.scale('minor');
          just = 9;
    }


    if (!tonalityScale && isTwoToNextChord && currentChord.abbrev == '7' && nextChord.abbrev == '-6') {
          tonalityRootNote = nextChord.rootNote;
          tonalityScale = tonalityRootNote.scale('harmonic minor');
          just = 10;
    }
    

    if (!tonalityScale && isTwoToNextChord && currentChord.abbrev == '7' && nextChord.abbrev == '-6') {
          tonalityRootNote = nextChord.rootNote;
          tonalityScale = tonalityRootNote.scale('minor');
          just = 11;
    }
    
    /***
    if (!tonalityScale && isSubstituteDominant) {
          tonalityRootNote = nextChord.rootNote;
          tonalityScale = tonalityRootNote.scale('harmonic minor');
          just = 12;
    }
    ******/

    
    if (!tonalityScale && 
      currentChord.abbrev == '7'
      && currentChord.rootNote.fourth().abstractValue() == nextChord.rootNote.abstractValue()
      && nextChord.hasMinorThirdInterval()
      ) {
          tonalityRootNote = currentChord.rootNote;
          tonalityScale = tonalityRootNote.scale('half whole diminished');
          just = 13;
    }

    if (!tonalityScale && currentChord.abbrev == '-7') {
          tonalityRootNote = currentChord.rootNote;
          tonalityScale = tonalityRootNote.scale('dorian');
          just = 14;
    }
    if (!tonalityScale && currentChord.abbrev == '-') {
          tonalityRootNote = currentChord.rootNote;
          tonalityScale = tonalityRootNote.scale('dorian');
          just = 15;
    }


    if (!tonalityScale && currentChord.abbrev == 'M7') {
          tonalityRootNote = currentChord.rootNote;
          tonalityScale = tonalityRootNote.scale('major');
          just = 16;
    }


    if (!tonalityScale && currentChord.abbrev == '7') {

          tonalityRootNote = currentChord.rootNote;
          tonalityScale = tonalityRootNote.scale('dominant');
          just = 17;
          /*
          tonalityRootNote = currentChord.rootNote.fourth()
          tonalityScale = tonalityRootNote.scale('major');
          **/
    }
  
    result.rootNote = tonalityRootNote;
    result.tonalityScale = tonalityScale;
    result.justification = just;
    return result;
  };
  return self;
};