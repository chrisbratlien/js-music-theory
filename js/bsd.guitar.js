if (typeof BSD == "undefined") {  var BSD = {};  }
BSD.Guitar = function(spec) {
  var self = BSD.PubSub({});
  var noteNames = makeScale('Cmajor').noteNames();


    var palette = BSD.randomPalette2(11,200);
    var table = DOM.table().addClass('js-bsd-guitar fretboard-table');


  var fromFret = 0;
  var toFret = 30;


  var cells = [];
  var cellMap = {};
  
  var cellsByFret = {};
  
  for (var i = 0; i < 12; i += 1) { 
    cellMap[i] = []; 
  }






  var fretSequence = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

  fretSequence = fretSequence.select(function(n){
    return (n >= spec.fretRange[0] && n <= spec.fretRange[1]);
  });


  fretSequence.each(function(n){
    cellsByFret[n] = []; 
  });



  self.plotNote = function(note,options) {
    cellMap[note.abstractValue()].each(function(o){
      //o.css('background','#e3f');
      o.addClass('selected');
      
      if (typeof options.class != "undefined") {
        o.addClass(options.class);
      }
      
      ///o.css('color','white');
    });
  };
  
  self.plotAll = function(o) {
    o.each(function(note){
      self.plotNote(o);
    });
  };  

  
  self.updateRange = function(from,to) {
  ///
  
    self.fretRange = [from,to];
    self.refresh();
  
    /***  
    fretSequence.each(function(n){
      ///console.log('n',n);
      
      if (n < from || n > to) {
        //console.log('hide me!! n',n,'from',from,'to',to);
        table.find('.fret-' + n).addClass('hidden');
      }    
    });
    ***/
  };
  
 

  self.refresh = function() {
  
  
    
  
    table.attr('cellspacing',0);
    table.attr('cellpadding',0);
    table.empty();
    
    
    //var opens = [43,50,57,64];
    var opens = [40,45,50,55,59,64];
    
    
    opens.reverse().each(function(open) { 
      var row = DOM.tr();     
      
      
      
      var ring = [1,2,3,0];//[1,2,3,0];
      var rp = 0;
      
      
      fretSequence.each(function(fret){   
      
        var midiNote = open + fret;
        var fundamental = midiNote % 12;
        var note = Note(midiNote);
        var fundamentalNote = Note(fundamental);
        
      
        var cell = DOM.td().addClass('cell fret fret-' + fret + ' fundamental-' + fundamental + ' string-' + open);
        
        cell.addClass('bg bg1 bg2 fg');
        
        var noteName = note.name();
        var state = {};
        
        /***
        var bg1 = DOM.div().addClass('bg bg1');
        var bg2 = DOM.div().addClass('bg bg2');
        var fg = DOM.div().addClass('fg');
        
        
        cell.append(bg1);
        cell.append(bg2);
        cell.append(fg);
        ***/
        var bg1 = cell, bg2 = cell, fg = cell;
        
        
          var colors = ['red','blue','magenta','white'];
          //var colors = ['yellow','cyan','green','white'];
        
          
        cell.on('mouseover',function(){
          self.publish('note-hover',note);
        
        });          
          
        cell.on('click touchend',function() {
        
          self.publish('fundamental-note-click',fundamentalNote);
          self.publish('note-click',note);
        
        
          if (typeof state[fundamental] == "undefined") {
            state[fundamental] = 0;
          }
          else {
            state[fundamental] = ring[state[fundamental]];        
          }
        });
        
        
        

        ////cell.append(corner);
        if (noteNames.indexOf(noteName) > -1) {
          ///fg.text(noteName);
          cell.text(noteName);
          cell.addClass('note-name');
          
          //////cell.append(DOM.span(noteName).addClass('note-name'));
        }  
        row.append(cell);
        
        cellMap[fundamental].push(cell);
        cells.push(cell);
        cellsByFret[fret].push(cell);
        
        //console.log(note.name());
      });
      table.append(row);
    });
  };


  self.renderOn = function(wrap) {
    wrap.append(table);  
    wrap.append(DOM.div().css('clear','both'));
    self.refresh();
  };






  return self;
};