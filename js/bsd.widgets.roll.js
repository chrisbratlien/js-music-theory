BSD.Widgets.Roll = function(spec) {
  
  var gossip = spec.gossip;
  var wrap = spec.wrap;
  

  var chordUL = DOM.ul();
  var chordNotesDiv = DOM.div();
  var chordLabel = DOM.h2();
  

  var self = {};

  ///var cells = [];

  var cache = [];


  //init sutff
  wrap.empty();
  chordNotesDiv.addClass('notes');
  chordNotesDiv.addClass('chord-notes');
  chordNotesDiv.append(chordLabel);
  chordNotesDiv.append(chordUL);  
  wrap.append(chordNotesDiv);

  //show the chord notes
  JSMT.twelveNotes().reverse().each(function(n) {
    var cell = DOM.li(n.name());
    ///cells.push(cell);
    cache.push({ cell: cell, note: n });
    
    cell.addClass('cell');
    cell.click(function() {
      //////spec.gossip.publish('playNote',{ note: n, duration: 1000 });
      spec.gossip.publish('noteClicked',n);
      
    });
    chordUL.append(cell);
  });
  
  self.refresh = function(o) {    
    var chord = o.current.chord;    
  
    ///console.log(chord.fullAbbrev());
    chordLabel.html(chord.fullAbbrev());

    cache.each(function(cob) {
      var n = cob.note;
      var cell = cob.cell;
    
      cell.removeClass('on old young');
      if (chord.containsNote(n)) {
        cell.addClass('on');              
        if (! o.next.chord.containsNote(n)) {
          cell.addClass('old');
        }
        if (! o.prev.chord.containsNote(n)) {
          cell.addClass('young');
        }
      }
    });
  };
  
  gossip.subscribe('chordChange',function(o) {
    self.refresh(o);     
  });
  
  return self;
};