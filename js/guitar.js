var Fret = function(spec) {

  //private
  var div = DOM.div();
  div.addClass('fret');

  var elem = div;
  var showNoteName = spec.showNoteName ? spec.showNoteName : true;
  //interface
  var self = BSD.PubSub({});
  
  self.number = spec.number || 0;
  self.value = spec.value || 0;
  self.fretted = spec.fretted || false;
  self.degree = spec.degree || false;
  self.lit = spec.lit || false;
  self.string = spec.string || false;
  
  
  div.addClass('fret-number-' + self.number);
  
  
  self.toString = function() {
    return '(' + 's: ' + self.string.number + ', f: ' + self.number + ')';
  };
  
  
  self.guitar = function() {
    return self.string.guitar;
  };



  self.higherFrets = function() {
    return self.string.frets.select(function(f) {
      return f.number > self.number;
    });
  };

  self.higherFrettedFrets = function() {
    return self.higherFrets().select(function(f) {
      return f.fretted;
    });
  };

  self.harmonics = function() {
    return self.string.frets.select(function(f) {
      return self.number % 12 == f.number %12; 
    });
  };
  
  self.unlitHarmonics = function() {
    return self.harmonics().select(function(h) { return h.unlit();})
  };

  self.changeColor = function(color){
    var wait = false;
    if (typeof color == "undefined") {
      wait = true;
    }
  
    div.css('background','#' + color.toHex());
    var darker = color.minus(BSD.Color({ r: 0.5 * color.r, g: 0.5 * color.g, b: 0.5 * color.b }));   
    ////console.log(color.toHex(),'darker >>',darker.toHex()); 
    ///alert(darker.toHex());
    /////div.css('text-shadow','0px 1px 1px #' + darker.toHex());
  };

  self.toggleLight = function(hexColor) {
    if (self.lit) {
      self.dim();
    }
    else {
      self.lightUp(hexColor);
    }
  };
  self.lightUp = function(color) {
    self.lit = true;
    if (self.lit) {
      self.changeColor(color);
    }
    self.redraw();
  };
  self.dim = function() {
    self.lit = false;
    /**
    if (self.fretted) {
      self.changeColor(BSD.Color({ r: 119, g: 119, b: 119 })); //'#777'
    }
    else
    {
    **/
      self.changeColor(BSD.Color({ r: 221, g: 221, b: 221 })); //#ddd
      //div.html(null);
  };
  
  self.recolor = function(c) {
    self.harmonics().each(function(f) { //harmonics() includes itself
      f.toggleLight(c);
    });
  };

  self.renderOn = function(wrap) {
    if (self.fretted) {
      div.addClass('fretted');
      //////div.css('background','#777');          
    }  
          
    div.on('click',function() {
      ////console.log('obserrr',self);
      var grip = self.guitar().firstGrip;
      grip.frets.push(self);
      self.recolor(BSD.chosenColor);

      self.publish('fret-clicked',{ number: self.number, value: self.value, string: self.string });   
    });
   
   
    /////cell.on('mouseout	mouseenter touchmove mouseover touchend',function(e){
    
    div.on('mouseout	mouseenter touchmove mouseover touchend',function(){
      //possibly obsolete self.publish('fret-hover',{ number: self.number, value: self.value, string: self.string, div: div }); 
      
      self.publish('note-hover', Note(self.value));////////{ number: self.number, value: self.value, string: self.string, div: div }); 
      
      
      
    });
      
      

    self.redraw();
      
    ////div.html(Note(self.value).name());
    
     
    
          
      
    wrap.append(div);
  };
  
  
  self.redraw = function() {
  
 
    var note = Note(self.value);
    var nn = note.name();
    if (nn.length == 1) {
      
      if (showNoteName) {
        div.html(nn);
      }
      else {
        div.html(JSMT.goShort(self.degree));  
      }
      
      
    }
  };
  
  self.subscribe('histogram',function(histogram){
    var myAbstVal = self.value % 12;
    
    var count = histogram[myAbstVal];
    
    div.attr('class',
           function(i, c){
              return c.replace(/count-\d+/g, '');
           });
    div.addClass('count-' + count);
    
    if (count > 12) { div.addClass('count-high'); }
    
    /**    
    if (count > 5) {
      ////div.addClass('popular');
      div.css('background','yellow');
    }
    else {
      ///div.removeClass('popular');
      div.css('background','#ddd');          
    }
    ****/
    /////console.log('histogram',histogram,myAbstVal);
  
  });
  
  self.subscribe('toggle-show-note-name',function(){
    showNoteName = ! showNoteName;
    self.redraw();
  });
  
  
  return self;
}



var GuitarString = function(spec) {
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','flat6','6'];

  var self = BSD.PubSub({});
  
  
  self.number = spec.number || false;
  self.rootNote = spec.rootNote;
  self.frettedDegrees = spec.frettedDegrees;
  self.guitar = spec.guitar;

  //console.log(spec.frettedDegrees);
  self.frets = [];


  self.frettedFrets = function() {
    return self.frets.select(function(f) { return f.fretted; });
  };
  
  self.litFrets = function() {
    return self.frets.select(function(f) { return f.lit; });
  };
  
  self.unlitFrets = function() {
    return self.frets.select(function(f) { return ! f.lit; });
  };
  
  self.litFrettedFrets = function() {
    return self.frettedFrets().select(function(f) { return f.lit; });
  };

  self.unlitFrettedFrets = function() {
    return self.frettedFrets().select(function(f) { return ! f.lit; });
  };





  self.renderOn = function(wrap) {
    var div = DOM.div();
    div.addClass('string');
    div.addClass('string-number-' + self.number);
    wrap.append(div);
    for (var i = 0, l = self.frets.length; i < l; i += 1) {
      self.frets[i].renderOn(div);
    }
    
    var clearMe = DOM.div();///document.createElement('div');
    clearMe.addClass('clear');
    wrap.append(clearMe);
    
  };

  //var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','flat6','6'];
  var foo = ['1','flat2','2','flat3','3','4','flat5','5','flat6','6','flat7','7'];

  ////console.log('what is my root note?',spec.rootNote);


  for(var i = 0; i < spec.maxFrets; i++){   
    var deg = foo[(self.rootNote.value()+i)%12];
    
    
    /////console.log('fd',self.frettedDegrees);
    
    var newFret = Fret({
      number: i,
      value: self.rootNote.value() + i,
      fretted: function() { return self.frettedDegrees.detect(function(x) { return x == deg; }) != false; } (),
      degree: deg,
      string: self
    });
    
    newFret.subscribe('fret-clicked',function(payload) {
      self.publish('fret-clicked',payload);
    });
    newFret.subscribe('fret-hover',function(payload) {
      self.publish('fret-hover',payload);
    });



    newFret.subscribe('note-hover',function(payload) {
      ///console.log('okay!!!',payload);
      self.publish('note-hover',payload);
    });
    
    self.frets.push(newFret);  
  }
  JSMT.strings.push(self);
  
  self.subscribe('histogram',function(histogram) {
    self.frets.each(function(f) { f.publish('histogram',histogram); });
  });
  
  
  self.subscribe('update',function(chosen){
    ///console.log('new and improved recv',chosen);
    self.frets.each(function(f){ 
      var hit = chosen.detect(function(o) { return o == f.degree; });
      //////console.log('f',f);
      hit ? f.lightUp(BSD.chosenColor) : f.dim();
    });
    
    //self.degreeList = chosen;
    //self.redraw();
    //self.strings.each(function(s) { s.publish('update',chosen); });
  });
  
  
  self.subscribe('toggle-show-note-name',function(){
    self.frets.each(function(o){  o.publish('toggle-show-note-name'); });
  });
  
  
  return self;
}



var Guitar = function(spec) {
  var container = false;

  var clickHistory = [];  
  var maxClickHistory = 25;

  
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','flat6','6'];
   //var foo = ['f7',7,1,'f2',2,'f3',3,4,'f5',5,'s5',6];
  ///var starter = [0,7,3,10,5,0];

  ////var starter = [0,7,3,10,5,0];
  var starter = [64,59,55,50,45,40];




/***
  var rootOffsets = {
    'G': 0,
    'G#': 11,
    'Ab': 11,
    'A': 10,
    'A#': 9,
    'Bb': 9,
    'B': 8,
    'C': 7,
    'C#': 6,
    'Db': 6,
    'D': 5,
    'D#': 4,
    'Eb': 4,
    'E': 3,
    'F': 2,
    'F#': 1,
    'Gb': 1
  };
****/





  var div = DOM.div().addClass('guitar');
  var hoveredNote = DOM.div().addClass('hovered-note');


  var fretLegend = DOM.div().addClass('fret-legend string');
  var showFretLegend = true;
  
  var rootNote = spec.rootNote || Note("G");
  

  var self = BSD.PubSub({});

  self.degreeList = spec.degreeList || [];
  self.strings = [];

  self.firstGrip = Grip({});

  var showDegreePicker = true;
  if (typeof spec.showDegreePicker != "undefined") {
    showDegreePicker = spec.showDegreePicker;
  }
  

  var picker = JSMT.DegreePicker({
    degreeString: '1,2,3,4,5,6,7',
  });

      /////console.log('chosen',chosen,typeof chosen);
  picker.subscribe('update',function(chosen){
    ////console.log('new and improved',chosen);
    self.degreeList = chosen;
    self.redraw();
    self.strings.each(function(s) { s.publish('update',chosen); });
  });
  
  
  
  self.toggleShowName = function() {
    self.strings.each(function(o){  o.publish('toggle-show-note-name'); });
  };
  self.toggleShowFretLegend = function() {
    showFretLegend  = ! showFretLegend;
    
    showFretLegend ? fretLegend.removeClass('hidden') : fretLegend.addClass('hidden');

  };


  self.harmonizeFirstGrip = function() {
    var bail = 100;
    ///self.reset();
    
    var session = JSMT.HarmonizeSession();


    
    var cidx = 0;
    var grip = self.firstGrip;////.nextGrip(); //the user has already done the first one!

    while (grip.hasFrets() && bail > 0) {
      ///console.log(grip.frets);
      if (grip.unlit() || grip == self.firstGrip) {
      
        ////console.log(grip.shape());
        var shape = grip.shape();
        
        ///console.log('shape',shape);
        
        
        session.addShape(shape);

        var color = session.getColorForShape(shape);
        //console.log('color',color);
        grip.lightUpWithHarmonics(color);
        cidx +=1;
      }
      bail -= 1;
      grip = grip.nextGrip();
    }
    self.firstGrip = Grip({});    //reset
  };


  self.parseDegrees = function(degreeStr) {
    d2 = degreeStr.split(',');
    ////console.log('parseDegrees',d2);
    //var degrees = eval('[' + degreeStr + ']');
    return d2;
  };

  self.renderOn = function(wrap) {
    ///console.log('qqq list',self.degreeList);
    wrap = jQuery(wrap);
    

    self.container = wrap;


    var harmonizeButton = jQuery('<button>Harmonize This!</button>');
    var clearButton = jQuery('<button>Clear</button>');
    var stickyNoteButton = DOM.button('Sticky Note');
    
    
    var btnToggleName = DOM.button('Toggle Name');
    var btnToggleFretLegend = DOM.button('Toggle Fret Legend');
    
    stickyNoteButton.click(function(e) {
    
      console.log(e,'sticky');
    
      var sticky = BSD.Widgets.StickyNote(e);
      sticky.renderOn(jQuery(document.body));
    });
    
    btnToggleName.click(function(){
      self.toggleShowName();
    });

    btnToggleFretLegend.click(function(){
      self.toggleShowFretLegend();
    });



    if (showDegreePicker) {
      picker.renderOn(wrap);  
    }

    wrap.append(harmonizeButton);
    harmonizeButton.click(function() {
      self.harmonizeFirstGrip();
    });


    wrap.append(clearButton);
    clearButton.click(function() {
      self.redraw();
      self.firstGrip = Grip({});
    });

    wrap.append(stickyNoteButton);
    wrap.append(btnToggleName);
    wrap.append(btnToggleFretLegend);
    
    wrap.append(div);
    
    /*
    for(var i = 0; i < spec.maxFrets; i++){   
    
    }
    **/
    
    
    
    for (var i = 0; i < spec.maxFrets; i += 1) {
      fretLegend.append(DOM.span(i).addClass('fret'));
    }
    
    div.append(fretLegend);
    
    for (var i = 0, l = self.strings.length; i < l; i += 1) {
      self.strings[i].renderOn(div);
    }
    
    wrap.append(hoveredNote);
    
  };


  /**
  self.redraw = function() {
    ////console.log('redraw: degreeList',self.degreeList,typeof self.degreeList);
    ////$(self.container).empty();
    //self.strings = self.buildStrings();
    ////self.renderOn(self.container);
  };
  **/
  
  self.reset = function() {
    self.strings.each(function(s) {
      s.litFrets().each(function(f) {
        f.dim();
      });
    });
  
  };

  self.redraw = self.reset;
  
  
  
  self.renderHistory = function() {
    clickHistory.shift(); //lose one
  
    var histogram = self.histogram();
    self.strings.each(function(s) { s.publish('histogram',histogram); });
  };
  
  
  self.buildStrings = function() {
    /////console.log('buildstrings: degreeList',self.degreeList,typeof self.degreeList);

    var result = [];
    for (var i = 0, l = starter.length; i < l; i += 1) {
      var string = GuitarString({
        number: i+1,
        //////////"rootNote": starter[i] + rootOffsets[rootNote.name()],
        
        rootNote: Note(starter[i]),
        
        frettedDegrees: self.degreeList,
        maxFrets: spec.maxFrets,
        guitar: self
      });
      
      string.subscribe('fret-clicked',function(payload) {
        payload.guitar = self;
        self.publish('fret-clicked',payload);
      });
      string.subscribe('fret-hover',function(payload) {
        self.publish('fret-hover',payload);
      });
      string.subscribe('note-hover',function(payload) {
        ///console.log('okay2!!!',payload);
        self.publish('note-hover',payload);
      });
      
      
      result.push(string);    
    }
    
    return result;
  };
  
  self.strings = self.buildStrings();


  self.subscribe('fret-clicked',function(o){
    var note = Note(o.value);
    clickHistory.push(note.abstractValue());
    
    while (clickHistory.length > maxClickHistory) {
      clickHistory.shift();
    }
    
  });
  
  
  self.histogram = function() {
    var result = [];
    var stats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 };
    
    clickHistory.each(function(abstVal){
      stats[abstVal] += 1;
    });
    //console.log('click stats',stats);
    return stats;

  };
  
  self.subscribe('fret-hover',function(o) {
    /////BSD.currentFretDiv = o.div;
    hoveredNote.html(Note(o.value).name());
  });



  return self; 
};


function rotateBackgroundColor(elem) {
  jElem = $(elem);
  ////console.log(jElem.css('background'));
  jElem.css('background',$('#color').val());
}

function build_guitar_table(fretboardID,strings,degrees) {
  //console.log('degrees:',degrees);
    
    
    
  var fretboardDiv = document.createElement('div');
  fretboardDiv.id = fretboardID;
  $(fretboardDiv).addClass('fretboard');
  $('#main').append(fretboardDiv);


  var includeDegrees = document.createElement('input');
  includeDegrees.value = degrees;
  includeDegrees.id = 'include_degrees-' + fretboardID.replace(/fretboard-/,'');
  /////console.log(includeDegrees.id);
  $(includeDegrees).addClass('includeDegrees');

  $(includeDegrees).blur(function(e) {update_guitar(fretboardID,parse_degrees(this.value));});

  $(fretboardDiv).append(includeDegrees);
  
  var table = document.createElement('table');
  //$(table).attr('cellpadding','0');
  $(table).attr('cellspacing','1');
  $(fretboardDiv).append(table);


/**  
   var opens = [40,45,50,55,59,64];
    
    
    opens.reverse().each(function(open) { 
 **/ 
  
    var headRow = DOM.tr();
    table.append(headRow);
    for(var j = 0; j < 30; j++) {  
      headRow.append(DOM.th(j));
    }
  
  for (var i = 0; i < strings.length; i++) {
    var tr = document.createElement('tr');
    $(tr).addClass('string');
    $(tr).addClass('string-' + i);
    for(var j = 0; j < 30; j++) {
      var td = document.createElement('td');
      $(tr).append(td);
      $(td).addClass('fret');
      $(td).addClass('fret-' + j);
      var sf = 's' + i.toString() + 'f' + j.toString();
      $(td).addClass(sf);
      var className = 'degree-' + strings[i][j];
      $(td).addClass(className);
      ////console.log(className);
      $(td).click(function() {
          var defaultColor = this.style.backgroundColor;
          console.log(this);
          console.log(this.style.backgroundColor)
          rotateBackgroundColor(this);
        //$('#' + fretboardID + ' .' + sf).css('background','#fa0000');
      });
    }
    $(table).append(tr);
  }
  update_guitar(fretboardID,parse_degrees(degrees));
  //console.log('afterwards');
}

function build_guitar() {

  var strings = Array(
    build_string(0),
    build_string(1),
    build_string(2),
    build_string(3),
    build_string(4),
    build_string(5)
    );
return strings;  
}
