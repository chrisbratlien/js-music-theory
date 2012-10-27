var Fret = function(spec) {

  //private
  var div = document.createElement('div');
  var elem = jQuery(div);


  //interface
  var that = {};
  that.number = spec.number || 0;
  that.value = spec.value || 0;
  that.fretted = spec.fretted || false;
  that.degree = spec.degree || false;
  that.lit = spec.lit || false;
  that.string = spec.string || false;
  
  that.toString = function() {
    return '(' + 's: ' + that.string.number + ', f: ' + that.number + ')';
  };
  
  
  that.guitar = function() {
    return that.string.guitar;
  };



  that.higherFrets = function() {
    return that.string.frets.select(function(f) {
      return f.number > that.number;
    });
  };

  that.higherFrettedFrets = function() {
    return that.higherFrets().select(function(f) {
      return f.fretted;
    });
  };

  that.harmonics = function() {
    return that.string.frets.select(function(f) {
      return that.number % 12 == f.number %12; 
    });
  };
  
  that.unlitHarmonics = function() {
    return that.harmonics().select(function(h) { return h.unlit();})
  };

  that.changeColor = function(color){
    var wait = false;
    if (typeof color == "undefined") {
      wait = true;
    }
  
    elem.css('background','#' + color.toHex());
    var darker = color.minus(BSD.Color({ r: 0.5 * color.r, g: 0.5 * color.g, b: 0.5 * color.b }));   
    ////console.log(color.toHex(),'darker >>',darker.toHex()); 
    ///alert(darker.toHex());
    elem.css('text-shadow','0px 1px 1px #' + darker.toHex());
  };

  that.toggleLight = function(hexColor) {
    if (that.lit) {
      that.dim();
    }
    else {
      that.lightUp(hexColor);
    }
  };
  that.lightUp = function(color) {
    that.lit = true;
    if (that.lit) {
      that.changeColor(color);
    }
  };
  that.dim = function() {
    that.lit = false;
    if (that.fretted) {
      that.changeColor(BSD.Color({ r: 119, g: 119, b: 119 })); //'#777'
    }
    else {
      that.changeColor(BSD.Color({ r: 221, g: 221, b: 221 })); //#ddd
    }
  };

  that.renderOn = function(html) {
    $(div).addClass('fret');
    $(div).addClass('fret-number-' + that.number);
    if (that.fretted) {
      $(div).addClass('fretted');
      $(div).html(JSMT.goShort(that.degree));  
      $(div).css('background','#777');          
    }  
          
    $(div).click(function() {
      ////console.log('obserrr',that);

      var grip = that.guitar().firstGrip;
      grip.frets.push(that);
      
      
      ////that.toggleLight($('#color').val()); //harmonics() includes itself

      that.harmonics().each(function(f) { //harmonics() includes itself
        f.toggleLight(BSD.chosenColor);
      });
    });  
    $(html).append(div);
  };
  return that;
}



var GuitarString = function(spec) {
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','flat6','6'];

  var that = {};
  that.number = spec.number || false;
  that.rootNote = spec.rootNote;
  that.frettedDegrees = spec.frettedDegrees;
  that.guitar = spec.guitar;

  //console.log(spec.frettedDegrees);
  that.frets = [];


  that.frettedFrets = function() {
    return that.frets.select(function(f) { return f.fretted; });
  };
  
  that.litFrets = function() {
    return that.frets.select(function(f) { return f.lit; });
  };
  
  that.unlitFrets = function() {
    return that.frets.select(function(f) { return ! f.lit; });
  };
  
  that.litFrettedFrets = function() {
    return that.frettedFrets().select(function(f) { return f.lit; });
  };

  that.unlitFrettedFrets = function() {
    return that.frettedFrets().select(function(f) { return ! f.lit; });
  };





  that.renderOn = function(html) {
    var div = document.createElement('div');
    $(div).addClass('string');
    $(div).addClass('string-number-' + that.number);
    $(html).append(div);
    for (var i = 0, l = that.frets.length; i < l; i += 1) {
      that.frets[i].renderOn(div);
    }
    
    var clearMe = document.createElement('div');
    $(clearMe).addClass('clear');
    $(html).append(clearMe);
    
  };

  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','flat6','6'];

  for(var i = 0; i < JSMT.MAXFRETS; i++){   
    var deg = foo[(that.rootNote+i)%12];
    
    
    /////console.log('fd',that.frettedDegrees);
    
    that.frets.push(Fret({
      number: i,
      value: that.rootNote + i,
      fretted: function() { return that.frettedDegrees.detect(function(x) { return x == deg; }) != false; } (),
      degree: deg,
      string: that
    }));  
  }
  JSMT.strings.push(that);
  
  return that;
}



var Guitar = function(spec) {
  var container = false;
  
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','flat6','6'];
   //var foo = ['f7',7,1,'f2',2,'f3',3,4,'f5',5,'s5',6];
  ///var starter = [0,7,3,10,5,0];

  var starter = [0,7,3,10,5,0];

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
  
  
  var rootNote = spec.rootNote || 'G';
  

  var that = {};
  that.degreeList = spec.degreeList || [];
  that.strings = [];

  that.firstGrip = Grip({});

  var showDegreePicker = true;
  if (typeof spec.showDegreePicker != "undefined") {
    showDegreePicker = spec.showDegreePicker;
  }
  

  var picker = JSMT.DegreePicker({
    degreeString: '1,2,3,4,5,6,7',
    onUpdate: function(chosen) {
      /////console.log('chosen',chosen,typeof chosen);

      that.degreeList = chosen;
      that.redraw();
    }
  });



  that.harmonizeFirstGrip = function() {
    var bail = 100;
    ///that.reset();
    
    var session = JSMT.HarmonizeSession();


    
    var cidx = 0;
    var grip = that.firstGrip;////.nextGrip(); //the user has already done the first one!

    while (grip.hasFrets() && bail > 0) {
      ///console.log(grip.frets);
      if (grip.unlit() || grip == that.firstGrip) {
      
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
    that.firstGrip = Grip({});    //reset
  };


  that.parseDegrees = function(degreeStr) {
    d2 = degreeStr.split(',');
    ////console.log('parseDegrees',d2);
    //var degrees = eval('[' + degreeStr + ']');
    return d2;
  };

  that.renderOn = function(html) {
    ///console.log('renderOn list',that.degreeList);
    html = jQuery(html);
    

    that.container = html;


    var harmonizeButton = jQuery('<button>Harmonize This!</button>');
    var clearButton = jQuery('<button>Clear</button>');
    var stickyNoteButton = DOM.button('Sticky Note');
    stickyNoteButton.click(function() {
      var sticky = BSD.Widgets.StickyNote();
      sticky.renderOn(jQuery(document.body));
    });

    



    if (showDegreePicker) {
      picker.renderOn(html);  
    }

    $(html).append(harmonizeButton);
    harmonizeButton.click(function() {
      that.harmonizeFirstGrip();
    });


    $(html).append(clearButton);
    clearButton.click(function() {
      that.redraw();
      that.firstGrip = Grip({});
    });

    $(html).append(stickyNoteButton);


    
    var div = document.createElement('div');
    $(div).addClass('guitar');
    $(html).append(div);

    for (var i = 0, l = that.strings.length; i < l; i += 1) {
      that.strings[i].renderOn(div);
    }
  };

  that.redraw = function() {
    ////console.log('redraw: degreeList',that.degreeList,typeof that.degreeList);
    $(that.container).empty();
    that.strings = that.buildStrings();
    that.renderOn(that.container);
  };
  
  that.reset = function() {
    that.strings.each(function(s) {
      s.litFrets().each(function(f) {
        f.dim();
      });
    });
  
  };
  
  
  
  that.buildStrings = function() {
    /////console.log('buildstrings: degreeList',that.degreeList,typeof that.degreeList);

    var result = [];
    for (var i = 0, l = starter.length; i < l; i += 1) {
      var string = GuitarString({
        number: i+1,
        "rootNote": starter[i] + rootOffsets[rootNote],
        frettedDegrees: that.degreeList,
        guitar: that
      });
      result.push(string);    
    }
    
    return result;
  };
  
  that.strings = that.buildStrings();

  return that; 
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
  for (i = 0; i < strings.length; i++) {
    var tr = document.createElement('tr');
    $(tr).addClass('string');
    $(tr).addClass('string-' + i);
    for(j = 0; j < 30; j++) {
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
