if (typeof BSD == "undefined") { var BSD = {};    }


BSD.RulerItem = function(spec) {
  var self = spec;
  
  
  return self;
};





BSD.Ruler = function(spec) {
  ///console.log('spec',spec);
  var self = {};
  var backplane = BSD.PubSub({});
  
  self.publish = backplane.publish;
  self.subscribe = backplane.subscribe;

  var firstTime = true;

  var wrap = DOM.div().addClass('ruler');
  
  var drug = Draggy(wrap[0],{ 
    direction: 'y',
    onUpdate: function(p) {
      ////console.log('p',p);
      
      spec.onUpdate(p); //bubble up
      return false;/////confused…think it needs to know direction or else it'll always snap to what it's near to.
      
      
      var current = parseInt(wrap.css('top'));
      var diff = current % spec.snap;
      var nearestA = current - diff;
      var nearestB = nearestA + spec.snap;
      var diffA = diff;
      var diffB = nearestB - current;
      var tolerance = 5;
      
      //console.log('nearestA',nearestA,'nearestB',nearestB,'diffA',diffA,'diffB',diffB);
      
      if (diffA > spec.snap / 2) {
        console.log('SNAP B');
        wrap.css('top',nearestB + 'px');            
        wrap[0].onmousemove = null;
        wrap[0].onmouseup = null;
        return false;
      }
      if (diffB > spec.snap / 2) {
        console.log('SNAP B');
        wrap.css('top',nearestB + 'px');            
        wrap[0].onmousemove = null;
        wrap[0].onmouseup = null;
        return false;
      }    
    }
  }); //do this late…
  self.nowBeHere = function(aPoint) {
    console.log('nbh');
  };

  /*
  self.rootNote = false;
  self.getRootNote = function() {
    if (!self.rootNote) { 
      self.rootNote = prompt('Root Note');
    }
    return self.rootNote;
  };
  */
  self.allDivs = [];
  self.tonicDivs = [];
  
  
  
  
  self.tonicOffsets = function() {
    return self.tonicDivs.collect(function(d) { return d.offset(); });
  };
  self.allOffsets = function() {
    return self.allDivs.collect(function(d) { return d.offset(); });
  };
  
  self.offsetLeft = function() {
    return self.allOffsets().shift().left;
  }
  
  self.nearNoteRulers = function() {
    var nrs = BSD.noteRulers.select(function(nr) {
        return nr.offsetLeft() < self.offsetLeft();
    });  
    return nrs;  
  };

  self.nearScaleRulers = function() {
    var nrs = BSD.rulers.select(function(r) {
        return r.spec.isScale && nr.offsetLeft() < self.offsetLeft();
    });  
    return nrs;  
  };
  
  self.nearestNoteRuler = function() {
  
    var them = self.nearNoteRulers();
    
    if (them.length == 0) {
      return false;
    }
    
    var sorted = them.sort(function(a,b) {
      return b.offsetLeft() -  a.offsetLeft();
    });
    //var collected = sorted.collect(function(nr) { return nr.offsetLeft(); });
    //console.log('sorted',sorted,'collected',collected);

    return sorted.shift();    
      
  };


  self.nearestScaleRuler = function() {  
    var them = self.nearScaleRulers();
    
    if (them.length == 0) {
      return false;
    }    
    var sorted = them.sort(function(a,b) {
      return b.offsetLeft() -  a.offsetLeft();
    });
    return sorted.shift();    
  };
    
  self.divsNear = function(y) {
    var tolerance = 10;
    return self.allDivs.select(function(d) { return Math.abs(y - d.offset().top) < tolerance; });
  };
  
  self.renderOn = function(html) {
    var classes = spec.classes || []; 
    classes.each(function(c) {
      wrap.addClass(c);
    });
    wrap.css('display','inline');
    wrap.css('position','relative');
    wrap.css('float','left');
    wrap.click(function() { //make draggy!!
      if (firstTime) { return false; 
        wrap.css('left',(parseInt(wrap.css('left'),10) || 0) +'px');
        wrap.css('position','absolute');
        wrap.css('float','none');  
      }
      firstTime = false;
    });

    var close = DOM.div().addClass('close');
    wrap.append(close);
    close.click(function(){
      wrap.remove();    
    });
    close.bind('touchend',function() { close.trigger('click'); }); //touchstart could cause too many things to accidentally get touched if the DOM shifts neighbors over
    
    var hoverdiv = jQuery('<div id="hover"></div>');
    var iframe = jQuery('<iframe></iframe>');

    spec.items.reverse().each(function(item) {      
      var div = DOM.div().addClass('note');
      var clickState = false;
      var priorColors = [];
      priorColors.push(BSD.colorFromHex('#ffffff'));
      
      div.click(function() {
        clickState = ! clickState;
        if (clickState) {
          var color = BSD.chosenColor;
          priorColors.push(color);
          div.css('background-color','#' + color.toHex());
        
        }
        else {
          ////console.log('what?',console.log(spec.onColor));
          if (item.on) {
            div.css('background-color','#' + spec.onColor.toHex());
          }        
          else {
            div.css('background-color','#fff');
          }   
        }
        
        self.publish('click',item); 
      });
      
      hoverdiv.append(iframe);
      hoverdiv.css('position','absolute');
      hoverdiv.css('z-index','3000');
      
      var content = '';      
      var tonic = item.names.detect(function(n) { return n == '1'; });

      self.allDivs.push(div);
      
      if (tonic) {
        self.tonicDivs.push(div);
        
        div.addClass('tonic');
        content = spec.title;
        div.html(content);
      };
      
      if (spec.showDegrees) {
        var span1 = jQuery('<span class="name-1"></span>');
        span1.html(item.names[0]);
        div.append(span1);
        
        if (item.names.length > 1) { 
          var span2 = jQuery('<span class="name-2"></span>');

          span2.html(item.names[1]);

          div.append(span2);
          
        }
      }
      
      var toggle = false;
      //div.hover(function(e){ div.css('text-indent','0px'); },function(e) { div.css('text-indent','-3000px'); });
      div.dblclick(function() {
        toggle = ! toggle; 
        if (toggle) { 
          iframe.attr('src','http://lucid.bratliensoftware.com/js-music-theory/lookup.html?degrees=' + spec.degrees + '&rootNote=' + self.getRootNote());
          div.append(hoverdiv); 
        }
        else { hoverdiv.remove(); }
      });          
      
      if (item.on) { 
        div.addClass('on'); 
        div.css('background-color','#' + spec.onColor.toHex());

      }  
      wrap.append(div);
    });
    html.append(wrap);

    drug.hookupEvents();
  };
  return self;
};


BSD.notePattern = [
  { name: 'A', names: ['A'], on: false },
  { name: 'Bb', names: ['A#','Bb'], on: false },
  { name: 'B', names: ['B'], on: false },
  { name: 'C', names: ['C'], on: false },
  { name: 'Db', names: ['C#','Db'], on: false },
  { name: 'D', names: ['D'], on: false },
  { name: 'Eb', names: ['D#','Eb'], on: false },
  { name: 'E', names: ['E'], on: false },
  { name: 'F', names: ['F'], on: false },
  { name: 'Gb', names: ['F#','Gb'], on: false },
  { name: 'G', names: ['G'], on: false },
  { name: 'Ab', names: ['G#','Ab'], on: false }
];

BSD.twoOctavePattern = [
    { name: '1', names: ['1','8'], on: false },
    { name: 'b2', names: ['b2','b9'], on: false },
    { name: '2', names: ['2','9'], on: false },
    { name: 'b3', names: ['b3','b10','#9','#2'], on: false },
    { name: '3', names: ['3','10'], on: false },
    { name: '4', names: ['4','11'], on: false },
    { name: 'b5', names: ['b5','b12'], on: false },
    { name: '5', names: ['5','12'], on: false },
    { name: 'b6', names: ['b6','b13'], on: false },
    { name: '6', names: ['6','13'], on: false },
    { name: 'b7', names: ['b7','b14'], on: false },
    { name: '7', names: ['7','14'], on: false },
    { name: '8', names: ['8','1'], on: false },
    { name: 'b9', names: ['b9','b2'], on: false },
    { name: '9', names: ['9','2'], on: false },
    { name: 'b10', names: ['b10','b3','#9','#2'], on: false },
    { name: '10', names: ['10','3'], on: false },
    { name: '11', names: ['11','4'], on: false },
    { name: 'b12', names: ['b12','b5'], on: false },
    { name: '12', names: ['12','5'], on: false },
    { name: 'b13', names: ['b13','b6'], on: false },
    { name: '13', names: ['13','6'], on: false },
    { name: 'b14', names: ['b14','b7'], on: false },
    { name: '14', names: ['14','7'], on: false }   
    
  ];


BSD.modifiedPattern = function(notes) {
  var startPattern = BSD.twoOctavePattern;
  ///console.log('startPattern',startPattern);
  
  
  
  /*
  var modified = startPattern.collect(function(item) {
    var hit = notes.detect(function(n) { return item.name == n; });
  
    return { name: item.name, on: (hit == item.name) }
  });
  */

  var modified = startPattern.collect(function(item) {
    var hit = notes.detect(function(n) {
		////console.log(item,'item',item.names,item.name);
      var hit2 = item.names.detect(function(name) {
        return name == n;
      });
      return (hit2 != false);
    });
  
    return { name: item.name, names: item.names, on: (hit != false) }
  });
  
  ////console.log('modified',modified);
  return modified;
};

BSD.rulers = [];
BSD.noteRulers = [];

BSD.rulerSnapSize = 20;

BSD.DegreeRuler = function(spec) {
  var pattern = BSD.modifiedPattern((spec.degrees).split(','));
  var myItems = pattern.concat(pattern);
  var myRulerItems = myItems.map(function(i) { return BSD.RulerItem(i); });
  var self = BSD.Ruler({
    onUpdate: function(point) {
      
      ////console.log(self.fooNote());
      self.renameTonics(self.fooNote());
    
      //self.renameFromPoint(point);
    },
    showDegrees: false,
    title: spec.title,
    items: myRulerItems,
    classes: spec.classes || [],
    degrees: spec.degrees,
    snap: BSD.rulerSnapSize,
    onColor: spec.onColor || BSD.colorFromHex('#aaaaff')
  });


  self.fooNote = function() {
  
      var firstTonicOffset = self.tonicOffsets().shift();
      /////////console.log('fto',firstTonicOffset);      
      
      var nnr = self.nearestNoteRuler();

	  ////console.log('nnr',nnr);
	  if (!nnr) { 
		return ''; 
	  }
	  
      var cand = nnr.divsNear(firstTonicOffset.top);

      if (cand.length == 0 ) {
        return false;
      }

      return cand.shift().find('.name-1').html();
  
  };



  self.renameTonics = function(str) {
    self.tonicDivs.each(function(d) { d.html(str + spec.title); });
  };


  BSD.rulers.push(self);

  return self;
};

BSD.NoteRuler = function(spec) {
  var pattern = BSD.notePattern;
  var myItems = pattern.concat(pattern).concat(pattern);
  var myRulerItems = myItems.map(function(i) { return BSD.RulerItem(i); });
    
  var self = BSD.Ruler({
    onUpdate: function() {},
    showDegrees: true,
    title: 'notes',
    items: myRulerItems,
    classes: ['chromatic','notes','scale'],
    snap: BSD.rulerSnapSize,
    onColor: BSD.colorFromHex('#88bbff')
  });
  
  self.items = function() {
    return spec.items;
  };
  
  self.spec = spec;
  
  
  
  BSD.rulers.push(self);
  BSD.noteRulers.push(self);
  return self;
};



BSD.NullRuler = function() {
  return BSD.DegreeRuler({ title: '(empty)', degrees: '' });
};



BSD.MajorScaleRuler = function() {
  return BSD.DegreeRuler({ title: 'M', degrees: '1,2,3,4,5,6,7,8,9,10,11,12,13,14', classes: ['scale','major'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};
BSD.MinorScaleRuler = function() {
  return BSD.DegreeRuler({ title: '-', degrees: '1,2,b3,4,5,b6,b7,8,9,b10,11,12,b13,b14', classes: ['scale','minor'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};
BSD.HarmonicMinorScaleRuler = function() {
  return BSD.DegreeRuler({ title: 'HM', degrees: '1,2,b3,4,5,b6,7,8,9,b10,11,12,b13,14', classes: ['scale','harmonic-minor'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};


BSD.MajorPentatonicScaleRuler = function() {
  return BSD.DegreeRuler({ title: 'MP', degrees: '1,2,3,5,6,8,9,10,12,13', classes: ['scale','major-pentatonic'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};
BSD.MinorPentatonicScaleRuler = function() {
  return BSD.DegreeRuler({ title: 'mP', degrees: '1,b3,4,5,b7,8,b10,11,12,b14', classes: ['scale','minor-pentatonic'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};
BSD.BluesScaleRuler = function() {
  return BSD.DegreeRuler({ title: 'blues', degrees: '1,b3,4,b5,5,b7,8,b10,11,b12,12,b14', classes: ['scale','blues'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};
BSD.MajorPentatonicPatternRuler = function() {
  return BSD.DegreeRuler({ title: 'MPP', degrees: '1,b3,3,5,6,8,b10,10,12,13', classes: ['scale','major-pentatonic-pattern'], isScale: true,     onColor: BSD.colorFromHex('#88bb88') });
};






BSD.MajorSixChordRuler = function() {
  return BSD.DegreeRuler({ title: '6', degrees: '1,3,5,6,8,10,12,13' });
};
BSD.MajorSixNineChordRuler = function() {
  return BSD.DegreeRuler({ title: '6/9', degrees: '1,2,3,5,6,8,9,10,12,13' });
};

BSD.MinorSixChordRuler = function() {
  return BSD.DegreeRuler({ title: '-6', degrees: '1,b3,5,6,8,b10,12,13' });
};




//major/minor
BSD.MajorChordRuler = function() {
  return BSD.DegreeRuler({ title: '', degrees: '1,3,5,8,10,12' });
};
BSD.MinorChordRuler = function() {
  return BSD.DegreeRuler({ title: '-', degrees: '1,b3,5,8,b10,12' });
};



//sevenths

BSD.Minor7ChordRuler = function() {
  return BSD.DegreeRuler({ title: '-7', degrees: '1,b3,5,b7,8,b10,12,b14' });
};
BSD.Minor7Flat5ChordRuler = function() {
  return BSD.DegreeRuler({ title: '-7b5', degrees: '1,b3,b5,b7,8,b10,b12,b14' });
};


BSD.Dominant7ChordRuler = function() {
  return BSD.DegreeRuler({ title: '7', degrees: '1,3,5,b7,8,10,12,b14' });
};
BSD.Dominant7Flat5ChordRuler = function() {
  return BSD.DegreeRuler({ title: '7b5', degrees: '1,3,b5,b7,8,10,b12,b14' });
};
BSD.Dominant7Flat9ChordRuler = function() {
  return BSD.DegreeRuler({ title: '7b9', degrees: '1,b2,3,5,b7,8,b9,10,12,b14' });
};
BSD.Dominant7Sharp9ChordRuler = function() {
  return BSD.DegreeRuler({ title: '7#9', degrees: '1,#2,3,5,b7,8,#9,10,12,b14' });
};
BSD.Major7ChordRuler = function() {
  return BSD.DegreeRuler({ title: 'M7', degrees: '1,3,5,7,8,10,12,14' });
};
BSD.Diminished7ChordRuler = function() {
  return BSD.DegreeRuler({ title: 'o7', degrees: '1,b3,b5,6,8,b10,b12,13' });
};



BSD.Minor9ChordRuler = function() {
  return BSD.DegreeRuler({ title: '-9', degrees: '1,2,b3,5,b7,8,9,b10,12,b14' });
};

BSD.Dominant9ChordRuler = function() {
  return BSD.DegreeRuler({ title: '9', degrees: '1,2,3,5,b7,8,9,10,12,b14' });
};

BSD.Major9ChordRuler = function() {
  return BSD.DegreeRuler({ title: 'M9', degrees: '1,2,3,5,7,8,9,10,12,14' });
};











BSD.ChordRulerPanel = function(spec) {
  var self = {};
  
  var backplane = BSD.PubSub({});
  
  self.subscribe = backplane.subscribe;
  self.publish = backplane.publish;
  
  var rulersWrap = jQuery('#rulers');
  self.renderOn = function(html) {
    spec.builders.each(function(b) {
      /////console.log('b',b);
      var button = jQuery('<button></button>');
      button.html(b.name);
      button.click(function() {
        var ruler = b.constructor();
        ruler.subscribe('click',function(o){
          self.publish('click',o);
        });
        ruler.renderOn(rulersWrap);
      });
      html.append(button);
    });
  };
  return self;
};


