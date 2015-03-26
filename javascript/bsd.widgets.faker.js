//shows the bars and chords of a progression, with a little piano roll player inside.


  BSD.Widgets.FakerCell = function(spec) {
    var self = BSD.PubSub({});

    console.log('fakercell spec',spec);
    var chord = spec.chord;
  
    var third = chord.myThird();/////third = chord.notes()[1];
  
    var scale = false;
    var guru = BSD.Widgets.TonalityGuru({});

    var cDiv = DOM.div().addClass('faker-cell chord chord-' + spec.chordIndex);
    var nameKeyDiv = DOM.div().addClass('name-key');
    var chordNotesDiv = DOM.div().addClass('chord-notes');
    //var scaleModeDiv = DOM.div().addClass('scale-mode').html('waiting...');
    //var chordModeDiv = DOM.div().addClass('chord-mode').html('waiting...');
    //var melodyDiv = DOM.div().addClass('melody').html('melody...waiting...');



    self.subscribe('chord-change',function(o){
      //console.log('oh',o,o.current.chordIndex);
      if (o.current.chordIndex == spec.chordIndex) {  
        cDiv.addClass('current');
      }
      else {
        cDiv.removeClass('current');
      }
    
    
    });



    var table = DOM.table();

      var chordRow = DOM.tr();
      var smRow = DOM.tr();
      var cmRow = DOM.tr();
      var melodyRow = DOM.tr();

  
    self.refresh = function() {
      if (!scale) { return false; }
      //scale could change, so need o refresh the scalemode and chordmode divs
      /////scaleModeDiv.empty();

      smRow.empty();
      cmRow.empty();
      melodyRow.empty();
      
      
      
      var myNotes = scale.notes();
      while(! myNotes[0].abstractlyEqualTo(third)) {
        var x = myNotes.shift();
        var octave = x.plus(12);
        myNotes.push(octave);
      }
      myNotes.push(myNotes[0].plus(12));
      
      
      var foo = true;
      myNotes.each(function(note){
        var noteDiv = DOM.td().addClass('note');

        
        //////console.log('ok here is the chord',chord);
        ////BSD.chord = chord;
       
       
       
       
       
        /***
       
        var nextChordThird = chord.next.myThird();
        var diff = note.abstractValue() - nextChordThird.abstractValue();
        ///console.log('diff',diff);
        
        
        if (Math.abs(diff) <= 2 && diff != 0) {
          ///console.log('nearby');
          noteDiv.addClass('near-next-third');
        }
        if (note.abstractlyEqualTo(nextChordThird)) {
          noteDiv.addClass('next-third');
        }
        *****/



        if (foo) {
          foo = false;
          noteDiv.addClass('third');
        }
        
        
        noteDiv.html(note.name());
        noteDiv.on('click',function(e){
          e.preventDefault();        
          self.publish('play-note',note);
        });
        noteDiv.on('mouseover',function(e){
          e.preventDefault();        
          self.publish('div-hover',noteDiv);
        });
        ////scaleModeDiv.append(noteDiv);
        smRow.append(noteDiv);
      });
      /////scaleModeDiv.append(DOM.div().css('clear','both'));
      
      
      
      myNotes.each(function(note){
        var noteDiv = DOM.td().addClass('note');
        var nullDiv = DOM.td();
        
        noteDiv.html(note.name());
        noteDiv.on('click touchend',function(e){
          e.preventDefault();        
          self.publish('play-note',note);
        });
        noteDiv.on('mouseover',function(e){
          e.preventDefault();        
          self.publish('div-hover',noteDiv);
        });
        nullDiv.on('mouseover',function(e){
          e.preventDefault();        
          self.publish('div-hover',nullDiv);
          //null div has no click handler so the result is muted..
        });


        ////scaleModeDiv.append(noteDiv);
        
        if (chord.containsNote(note)){ 
          cmRow.append(noteDiv);
        }
        else {
          cmRow.append(nullDiv);
        }
      });
      
      
      ///table.append(cmRow);


      myNotes.each(function(note){
        var noteDiv = DOM.td().addClass('note');
        var nullDiv = DOM.td();
        
        var toggle = false;
        
        
        noteDiv.on('click touchend',function(){
          toggle = !toggle;
          if (toggle) {
            noteDiv.html(note.name());        
          }
          else {
            noteDiv.html('&nbsp;');                  
          }
          
          self.publish('play-note',note);
        });
        noteDiv.on('mouseover',function(e){
          e.preventDefault();        
          self.publish('div-hover',noteDiv);
        });
        nullDiv.on('mouseover',function(e){
          e.preventDefault();
          self.publish('div-hover',nullDiv);
          //null div has no click handler so the result is muted..
        });


        ////scaleModeDiv.append(noteDiv);
        
        melodyRow.append(noteDiv);
      });



      /////table.append(melodyRow);
      
    };
    
    self.renderOn = function(wrap){

      var title = DOM.span(chord.fullAbbrev());
      nameKeyDiv.append(title);
      ////nameKeyDiv.append(chord.fullAbbrev());
      title.on('click touchend',function(e){
        e.preventDefault();      
        self.publish('play-chord',chord);
      });
      title.on('mouseover',function(e){
        e.preventDefault();      
        self.publish('div-hover',title);
      });
      
      
      


      var compatibleScales = chord.compatibleScales();


      var scaleDropdown = DOM.select();
      var scaleItems = chord.compatibleScales().map(function(o){
        return { label: o.fullName(), object: o };
      });
      

      if (!scale) { scale = compatibleScales.detect(function(o) { return o.name == 'minor'; }) };
      if (!scale) { scale = compatibleScales.detect(function(o) { return o.name == 'major'; }) };
      if (!scale) { scale = compatibleScales.detect(function(o) { return o.name == 'harmonic minor'; }); };
      if (!scale) { scale = compatibleScales[0]; }

      
      scaleItems.each(function(o){
        var opt = DOM.option(o.label);        
        scaleDropdown.append(opt);
      });
      scaleDropdown.val(scale.fullAbbrev());
      
      scale = spec.advice.tonalityScale;
      
      /**
      nameKeyDiv.append(scaleDropdown);
      scaleDropdown.change(function() {            
        var selectedScale = chord.compatibleScales().detect(function(s) { 
          return s.fullAbbrev() == scaleDropdown.val(); 
        });
        scale = selectedScale;
        self.refresh();
      });
      
      *****/
      
      
      

      
      chord.notes().each(function(note){
        var noteDiv = DOM.td().addClass('note');
        noteDiv.html(note.name());
        noteDiv.on('click touchend',function(e){
          e.preventDefault();        
          self.publish('play-note',note);
        });
        noteDiv.on('mouseover',function(e){
          e.preventDefault();        
          self.publish('div-hover',noteDiv);
        });
        chordRow.append(noteDiv);
      });
    
      cDiv.append(nameKeyDiv);
      cDiv.append(chordNotesDiv);

      table.append(chordRow);
      table.append(smRow);
      table.append(cmRow);
      ////table.append(melodyRow);


      cDiv.append(table);
      ///cDiv.append(scaleModeDiv);
      ///cDiv.append(chordModeDiv); 
      //////cDiv.append(melodyDiv); 
      wrap.append(cDiv); 
    
    
      self.refresh();
    };
  
    return self;  
  }

  BSD.Widgets.Faker = function(spec) {

    var chordIndex = 0;
  
    var self = BSD.PubSub({});
    var map = {};
    var queue = [];
    
    var gossip = spec.gossip; //BSD.PubSub
    
      var wrap = jQuery('#faker-wrap');

    
    self.enqueue = function(o) {
      queue.push(o);
    };

    
    self.subscribe('new-progression',function(items) {
    
    
      var guru = BSD.Widgets.TonalityGuru({});
      
      

    
      wrap.empty();
      items.eachPCN(function(o){
        var advice = guru.analyze(o);      
        //console.log('who',o);
        self.renderChordOn(wrap,o.current.chord,advice);
      });
      
    });
    
    
    self.refresh = function() {};


    self.renderChordOn = function(wrap,chord,advice) {
    
      var cell = BSD.Widgets.FakerCell({
        chord: chord,
        chordIndex: chordIndex,
        advice: advice
      });
      cell.renderOn(wrap);

      self.subscribe('chord-change',function(o){
        cell.publish('chord-change',o);
      });
 


      //relay/route outgoing msgs
      ['play-note','play-chord','div-hover'].each(function(topic){
        cell.subscribe(topic,function(payload){
          self.publish(topic,payload);
        });
      });
    
      chordIndex += 1;
    };
    
    self.go = function(progression) {    

      ////console.log("booo");
      wrap.append('faker');
      
      
      var legend = DOM.div().addClass('legend');
      
      legend.append(DOM.div('on').addClass('on'));
      legend.append(DOM.div('scale').addClass('on').addClass('scale'));
      legend.append(DOM.div('young').addClass('on').addClass('young'));
      legend.append(DOM.div('old').addClass('on').addClass('old'));
      legend.append(DOM.div('temporary').addClass('on').addClass('young').addClass('old'));
      legend.append(DOM.div().css('clear','both'));
      wrap.append(legend);


      var rangeLabel = DOM.label('width of bars');
      var range = DOM.input().attr('type','range').attr('min',14).attr('max',100).val(25).addClass('barWidth');
      range.change(function(){
        jQuery('#faker-wrap .bar').css('width',this.value + '%');
        //jQuery('#faker-wrap').css('width',this.value + '%');
      });


      rangeLabel.append(range);
      wrap.append(DOM.br());
      wrap.append(rangeLabel);
      
      
      /********
      bars.each(function(bar) {
        var chordNames = bar.split(/,|\ +/);
        var newBar = true;
        chordNames.each(function(name) {
          var chord = makeChord(name);
          var scales = chord.compatibleScales();
          self.enqueue({ chord: chord, scales: scales, bar: bar, newBar: newBar });
          newBar = false;
        });
      });

      *******/      
      var barDiv = false;
      
      queue = spec.progression;
      

      var saveBar = -1;

      queue.eachPCN(function(o) {
      
        if (o.barIndex != saveBar) {
          barDiv = DOM.div().addClass('bar');        
          wrap.append(barDiv);
          saveBar = o.barIndex;        
        }





        /**********
        var chordNames = o.current.bar.split(/,|\ +/);
        ********/
        var chord = o.current.chord;
        var chordDiv = DOM.div().addClass('chord');

          /********
          if (chordNames.length == 2) {
            chordDiv.addClass('half');
          }
          if (chordNames.length == 3) {
            chordDiv.addClass('third');
          }
          if (chordNames.length == 4) {
            chordDiv.addClass('fourth');
          }
          ********/
          
          barDiv.append(chordDiv);


          var chordName = chord.fullAbbrev();
          
          chordDiv.append(DOM.div(chordName).addClass('chord-name'));         

          //scale selector
          var sel = DOM.select();
          chordDiv.append(sel);
          chord.compatibleScales().each(function(scale) {
            var opt = DOM.option(scale.fullAbbrev());
            sel.append(opt);          
          });           


          var chordNotesDiv = DOM.div();
          chordNotesDiv.addClass('notes');
          chordNotesDiv.addClass('chord-notes');
          chordNotesDiv.append(DOM.label('chord'));

          var scaleNotesDiv = DOM.div();
          scaleNotesDiv.addClass('notes');
          scaleNotesDiv.addClass('scale-notes');
          scaleNotesDiv.append(DOM.label('scale'));
          
          
          chordDiv.append(chordNotesDiv);
          chordDiv.append(scaleNotesDiv);

          var scaleUL = DOM.ul();
          scaleNotesDiv.append(scaleUL);

          var chordUL = DOM.ul();
          chordNotesDiv.append(chordUL);


          //show the chord notes
          JSMT.twelveNotes().reverse().each(function(n) {
            var cell = DOM.li(n.name());
            cell.addClass('cell');
            if (chord.containsNote(n)) {
              cell.addClass('on');              
              if (! o.next.chord.containsNote(n)) {
                cell.addClass('old');
              }
              if (! o.prev.chord.containsNote(n)) {
                cell.addClass('young');
              }
            }
            cell.click(function() {            
              gossip.publish('noteClicked',n);
            });
            
            
            
            
            chordUL.append(cell);
          });

          var compatScales = chord.compatibleScales();
          if (compatScales.length > 0) {

            var scale = chord.compatibleScales().shift();  
            scaleUL.empty();
            JSMT.twelveNotes().reverse().each(function(n) {
              var cell = DOM.li(n.name());
              cell.addClass('cell');
              cell.addClass('scale');
              if (scale.containsNote(n)) {
                cell.addClass('on');
                ////console.log('scale',o.next.scales[0].fullName(),'note',n.name());

                /***
                if (o.next.scales.length > 0 && ! o.next.scales[0].containsNote(n)) {
                  cell.addClass('old');
                }
                if (o.prev.scales.length > 0 && ! o.prev.scales[0].containsNote(n)) {
                  cell.addClass('young');
                }
                ****/
              } 
              scaleUL.append(cell);
              cell.click(function() {
                gossip.publish('noteClicked',n);
              });              
            });

            sel.change(function() {            
              ///console.log('chord',chord);
            
              var scale = chord.compatibleScales().detect(function(s) { 
              //console.log(s.fullAbbrev(),'<->',sel.val());
              
              return s.fullAbbrev() == sel.val() });
              
              ///console.log('scale?',scale);
              
              scaleUL.empty();
              JSMT.twelveNotes().reverse().each(function(n) {
                var cell = DOM.li(n.name());
                cell.addClass('cell');
                cell.addClass('scale');
                if (scale.containsNote(n)) {
                  cell.addClass('on');
                  ////console.log('scale',o.next.scales[0].fullName(),'note',n.name());
                if (o.next.scales.length > 0 && ! o.next.scales[0].containsNote(n)) {
                  cell.addClass('old');
                }
                if (o.prev.scales.length > 0 && ! o.prev.scales[0].containsNote(n)) {
                  cell.addClass('young');
                }



                } 
                scaleUL.append(cell);
              });
            });
          }
          
          //show the currently selected scale          
          
          last = chord;
      });
      
      wrap.append(DOM.div().css('clear','both'));
    };        
    return self;
  };
