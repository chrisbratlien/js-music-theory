var GuitarString = function(spec) {
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','sharp5','6'];

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

  var starter = [0,7,3,10,5,0];
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','sharp5','6'];

  for(var i = 0; i < JSMT.MAXFRETS; i++){   
    var deg = foo[(that.rootNote+i)%12];
     
    that.frets.push(Fret({
      number: i,
      value: that.rootNote + i,
      fretted: function() { return that.frettedDegrees.indexOf(deg) > -1; }(),
      degree: deg,
      string: that
    }));  
  }
  JSMT.strings.push(that);
  
  return that;
}



var Guitar = function(spec) {
  var container = false;
  
  var foo = ['flat7','7','1','flat2','2','flat3','3','4','flat5','5','sharp5','6'];
   //var foo = ['f7',7,1,'f2',2,'f3',3,4,'f5',5,'s5',6];
  var starter = [0,7,3,10,5,0];
  
  

  var that = {};
  that.degreeList = spec.degreeList || '';
  that.strings = [];

  that.firstGrip = Grip({});

  var picker = JSMT.DegreePicker({
    degreeString: '1,2,3,4,5,6,7',
    onUpdate: function(chosen) {
      ///console.log(state,'state');
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


    /***************
    var includeDegrees = document.createElement('input');
    includeDegrees.value = that.degreeList;
    $(includeDegrees).addClass('includeDegrees');
    $(includeDegrees).blur(function(e) { 
      //console.log(that.degreeList);
      ///console.log('blur',this.value);
      that.degreeList = this.value;
      that.redraw(); 
    });
    $(html).append(includeDegrees);
    *************/
    
    picker.renderOn(html);

    $(html).append(harmonizeButton);
    harmonizeButton.click(function() {
      that.harmonizeFirstGrip();
    });


    $(html).append(clearButton);
    clearButton.click(function() {
      that.redraw();
      that.firstGrip = Grip({});
    });
    
    var div = document.createElement('div');
    $(div).addClass('guitar');
    $(html).append(div);

    for (var i = 0, l = that.strings.length; i < l; i += 1) {
      that.strings[i].renderOn(div);
    }
  };

  that.redraw = function() {
    ////console.log('redraw list',that.degreeList);  
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
    var result = [];
    for (var i = 0, l = starter.length; i < l; i += 1) {
      var string = GuitarString({
        number: i+1,
        rootNote: starter[i],
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
