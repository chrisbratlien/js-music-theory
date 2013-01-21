  BSD.Widgets.Faker = function(spec) {
  
    var self = {};
    var map = {};
    var queue = [];
    
    var gossip = spec.gossip; //BSD.PubSub
    
    var backplane = BSD.PubSub({});
    
    self.enqueue = function(o) {
      queue.push(o);
    };
    self.go = function(progression) {    

      ////console.log("booo");
      var wrap = jQuery('#faker-wrap');
      var bars = progression.split('|');
      var last = false;
      
      
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

      var barDiv = false;

      queue.eachPCN(function(o) {
      
        if (o.current.newBar) {        
          barDiv = DOM.div().addClass('bar');        
        }
        wrap.append(barDiv);

        /*
        var chordNames = bar.split(/,|\ +/);
        chordNames.each(function(name) {
          var chord = makeChord(name);
        */
        var chordNames = o.current.bar.split(/,|\ +/);
        var chord = o.current.chord;

          var chordDiv = DOM.div().addClass('chord');
          if (chordNames.length == 2) {
            chordDiv.addClass('half');
          }
          if (chordNames.length == 3) {
            chordDiv.addClass('third');
          }
          if (chordNames.length == 4) {
            chordDiv.addClass('fourth');
          }
          
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
              spec.audioPlayer.playNote(n,1000);
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
                if (o.next.scales.length > 0 && ! o.next.scales[0].containsNote(n)) {
                  cell.addClass('old');
                }
                if (o.prev.scales.length > 0 && ! o.prev.scales[0].containsNote(n)) {
                  cell.addClass('young');
                }
              } 
              scaleUL.append(cell);
              cell.click(function() {
                spec.audioPlayer.playNote(n,500);
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
