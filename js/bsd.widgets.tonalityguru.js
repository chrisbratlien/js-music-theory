BSD.Widgets.TonalityGuru = function(spec) {
  var self = BSD.PubSub({});



  self.analyze = function(o) {

    var result = {};

    ///o.current = o;

    var tonalityRootNote = false;
    var tonalityScale = false;
    var just = 'no just';

    ///var bar = o.current.bar;
    var chord = o.chord;
    var currentChord = chord;
    var currentChordRootNoteName = currentChord.rootNote.name();


    var nextChord = o.next.chord;
    var nextChord2 = o.next.next.chord;
    ///var prevChord = o.prev.chord;
    //var barCount = o.current.barCount;
    var isMajor = currentChord.hasMajorQuality();
    var isMinor = currentChord.hasMinorQuality();
    var isMinor7 = currentChord.hasMinorSeventhQuality();
    var isMajor7 = currentChord.hasMajorSeventhQuality();
    var isMinor7b5 = currentChord.abbrev == '-7b5';
    var isDominant = chord.hasDominantQuality();

    var nextChordMinor7 = nextChord.hasMinorSeventhQuality();
    var nextChordMajor7 = nextChord.hasMajorSeventhQuality();


    var nextChordDominant = nextChord.hasDominantQuality();
    var nextChordMinorThird = nextChord.hasMinorThirdInterval();
    var currentChordDominant = currentChord.hasDominantQuality();
    var currentChordMinorThird = currentChord.hasMinorThirdInterval();
    var isTwoToNextChord = (currentChord.rootNote.fourth().abstractValue() == nextChord.rootNote.abstractValue());

    var isFunctioningDominant = isTwoToNextChord && isDominant; //is it "going home?"
    var isNonFunctioningDominant = isDominant && !isFunctioningDominant;

    var isSubstituteDominant = (currentChord.abbrev == '7' && currentChord.rootNote.plus(-1).abstractValue() == nextChord.rootNote.abstractValue());
        /////if (isSubstituteDominant) { alert('SUBST!'); }
        ///console.log('isTwoToNextChord',isTwoToNextChord);
    var isTwoInMinorTwoFive = (isTwoToNextChord && isMinor7b5 && nextChordDominant);
    //console.log('isTwoInMinorTwoFive',isTwoInMinorTwoFive);
    var isTwoInMajorTwoFive = (isTwoToNextChord && !isMinor7b5 && currentChordMinorThird && nextChordDominant);
    ////var isFiveInTwoFive = (prevChord.rootNote.fourth().abstractValue() == currentChord.rootNote.abstractValue());
  

    var solutions = [];

    

    console.log('guru:',o.chord.fullAbbrev(),o.next.chord.fullAbbrev());//,'isFunctioningDominant',isFunctioningDominant);


    if (solutions.length == 0 && isMinor7b5) { 
      solutions.push({ advice: currentChordRootNoteName + ' locrian', just: 'cb1'  });
      solutions.push({ advice: currentChordRootNoteName + ' HM2', just: 'cb2'  });
      solutions.push({ advice: currentChordRootNoteName + ' MM6', just: 'cb3' });
    }

    if (solutions.length == 0 && isMinor7 && isTwoToNextChord && nextChordDominant) { 
      solutions.push({ advice: currentChordRootNoteName + ' dorian', just: 'cb4'  });
      solutions.push({ advice: currentChordRootNoteName + ' MM2', just: 'cb5'  }); //maybe restrict this more to ensure heading towards a i-7 after the dominant?
    }

    if (solutions.length == 0 && isFunctioningDominant) {
      if (nextChordMinor7) {
        solutions.push({ advice: currentChordRootNoteName + ' HM5', just: 'cb6'  });
      }
      else {

        if (nextChordMajor7) {
          solutions.push({ advice: currentChordRootNoteName + ' mixolydian', just: 'cb7'  });
        }
        solutions.push({ advice: currentChordRootNoteName + ' MM7', just: 'cb8'  });
      }
    }



    if (solutions.length == 0 && isNonFunctioningDominant) {
      solutions.push({ advice: currentChordRootNoteName + ' MM4', just: 'cb10'  });
    }


    //some catch-alls
    if (solutions.length == 0 && isMajor7) {
      solutions.push({ advice: currentChordRootNoteName + ' ionian', just: 'catch-all 11'  });
      solutions.push({ advice: currentChordRootNoteName + ' lydian', just: 'catch-all 11b'  });
    }
    if (solutions.length == 0 && isMinor7) {
      solutions.push({ advice: currentChordRootNoteName + ' dorian', just: 'catch-all 12'  });
      solutions.push({ advice: currentChordRootNoteName + ' aeolian', just: 'catch-all 13'  });
      solutions.push({ advice: currentChordRootNoteName + ' MM1', just: 'catch-all 14'  });
    }
    if (solutions.length == 0 && isMajor) {
      solutions.push({ advice: currentChordRootNoteName + ' major', just: 'catch-all 15'  });
    }
    if (solutions.length == 0 && isMinor) {
      solutions.push({ advice: currentChordRootNoteName + ' minor', just: 'catch-all 16'  });
    }


    result = solutions.atRandom();
    console.log('tonality guru picked:',result);
    return result;

    return "FAIL";


        
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