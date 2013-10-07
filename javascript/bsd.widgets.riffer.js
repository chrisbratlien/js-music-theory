  BSD.Widgets.Riffer = function(spec) {
      
    var self = BSD.PubSub({}); //provides publish and subscribe methods
    
    self.renderOn = function(wrap) {

      var table1 = DOM.table().attr('cellpadding',0).attr('cellspacing',0);
      
      var headerRow = DOM.tr();
      
      headerRow.append(DOM.th('&nbsp;'));
      
      JSMT.twelveTones().each(function(t) {
        headerRow.append(DOM.th(t));
      });
      table1.append(headerRow);
      
      wrap.append(table1);
      
      
      
      var newBar = false;
      
      var bars = spec.progression.split('|');
      bars.each(function(bar) {
        newBar = true;
        var chordNames = bar.split(/,|\ +/);
        chordNames.each(function(name) {
        
        
        
          var chord = makeChord(name);      
          var row = DOM.tr();
          
          var chordCell = DOM.td(name).addClass('chord-name')
          chordCell.click(function(){
              self.publish('play-chord',chord);
          });

          row.append(chordCell);



          if (newBar) {
            newBar = false;
            row.addClass('new-bar');
          }
  
          JSMT.twelveNotes().each(function(note) {
            var cell = DOM.td(note.name());
            cell.addClass('cell');
            if (chord.containsNote(note)) {
              cell.addClass('on');
            }
            
            cell.click(function(){
              self.publish('play-note',note);
            });            
            
            row.append(cell);
          });
          
          var ul = DOM.ul();
          var sorted = chord.compatibleScaleAbbrevs().sort(function(a,b) {
            var aRoot = a.substr(0,1).match(chord.rootNote.name());
            var aMajor = a.match(/major/);
            var bRoot = b.substr(0,1).match(chord.rootNote.name());
            var bMajor = b.match(/major/);
            var aRootAndMajor = aRoot && aMajor;
            var bRootAndMajor = bRoot && bMajor;
            
            if (aRootAndMajor && ! bRootAndMajor) { return -3; }
            if (aMajor && ! bMajor) { return -2; }
            if (aRoot && ! bRoot) { return -1; }


            if (bRootAndMajor && ! aRootAndMajor) { return 3; }
            if (bMajor && ! aMajor) { return 2; }
            if (bRoot && ! aRoot) { return 1; }

            return a < b; 
          
          });
          
          sorted.each(function(s) {
            var li = DOM.li(s);
            ul.append(li);
          });
          row.append(DOM.td(ul));
          table1.append(row);
        });
      });
    };        
    return self;
  };