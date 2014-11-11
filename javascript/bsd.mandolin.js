if (typeof BSD == "undefined") {  var BSD = {};  }
BSD.Mandolin = function(spec) {
  var self = BSD.PubSub({});
  var noteNames = makeScale('Cmajor').noteNames();


  self.renderOn = function(wrap) {
    var palette = BSD.randomPalette2(11,200);
    var table = DOM.table().addClass('fretboard-table');
    table.attr('cellspacing',0);
    table.attr('cellpadding',0);
    table.empty();
    
    

    
    
    //var opens = [43,50,57,64];
    var opens = [55,62,69,76];
    
    
    
    
    opens.reverse().each(function(open) { 
      var row = DOM.tr();     
      
      var fretSequence = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
      
      
      
      fretSequence.each(function(fret){   
      
        var midiNote = open + fret;
        var fundamental = midiNote % 12;
        var note = Note(midiNote);
        var fundamentalNote = Note(fundamental);
        
      
        var cell = DOM.td().addClass('cell fret-' + fret + ' fundamental-' + fundamental + ' string-' + open);
        var noteName = note.name();
        var state = {};
        
          
        cell.click(function() {
        
          self.publish('fundamental-note-click',fundamentalNote);
          self.publish('note-click',note);
        
        
          if (typeof state[fundamental] == "undefined") {
            state[fundamental] = false;
          }
          state[fundamental] = ! state[fundamental];
          var group = table.find('.fundamental-' + fundamental + '.string-' + open);
          if (state[fundamental]) {
            group.css('background','#' + BSD.chosenColor.toHex());
            group.css('color','white');                
          } else {
            group.css('background','white');  
            group.css('color','black');
          }
        });

        ////cell.append(corner);
        if (noteNames.indexOf(noteName) > -1) {
          cell.append(DOM.span(noteName).addClass('note-name'));
        }  
        row.append(cell);
        //console.log(note.name());
      });
      table.append(row);
    });
    wrap.append(table);
  
    var nameToggle = DOM.input().attr('type','checkbox');
    nameToggle.change(function(){
      if (this.checked) {
        table.find('span').removeClass('hidden');
      }
      else { 
        table.find('span').addClass('hidden');
      }
    });
    wrap.append(nameToggle);
    wrap.append('Show notes');
    wrap.append(DOM.div().css('clear','both'));
  };
  return self;
};