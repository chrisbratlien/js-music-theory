<?php


add_action('wp_head', function () {
?>
  <title>Spatial</title>

  <link rel="stylesheet" href="style.css" media="screen" />
  <script type="text/javascript">
    if (typeof BSD == "undefined") {
      var BSD = {};
    }
    if (typeof BSD.Widgets == "undefined") {
      BSD.Widgets = {};
    }
  </script>
  <script type="text/javascript" src="js/array.js"></script>
  <script type="text/javascript" src="js/eachify.js"></script>
  <script type="text/javascript" src="js/color.js"></script>
  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
  <script src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">

  <script type="text/javascript" src="js/bsd.pubsub.js"></script>
  <script type="text/javascript" src="js/bsd.storage.js"></script>
  <script type="text/javascript" src="js/bsd.remotestorage.js"></script>
  <script type="text/javascript" src="js/dom.js"></script>


  <!--

  <script type="text/javascript" src="js/draggy.js"></script>
  <script type="text/javascript" src="js/sticky-note.js"></script>
  -->

  <script type="text/javascript" src="js/js-music-theory.js"></script>
  <script type="text/javascript" src="js/bsd.widgets.procrastinator.js"></script>


  <script src="js/bsd.widgets.simpleplayer.js"></script>

  <!--
  <script type="text/javascript" src="js/bsd.widgets.lightbox.js"></script>


  <script src="js/bsd.widgets.baseplayer.js"></script>
  <script src="js/bsd.widgets.stringoscillator.js"></script>
  <script src="js/bsd.widgets.mandolinplayer.js"></script>
  -->
  <script src="js/bsd.spatialnote.js"></script>

  <style type="text/css">
    #pickers {
      height: 40px;
    }

    #progression {
      width: 100%;
      font-size: 1.5em;
      padding: 0.2em;
    }
  </style>
  <style type="text/css">
    body {
      font-size: 16px;
      font-family: Helvetica;
    }

    table {
      border-bottom: 1px solid black
    }

    table {
      border-right: 1px solid black
    }

    table td {
      padding: 0.2em;
      text-align: center;
      min-width: 23px;
      cursor: pointer;
    }

    table td {
      border-top: 1px solid #666;
    }

    table td {
      border-left: 1px solid #666;
    }

    table td sub {
      font-size: 0.5em;
    }

    .midpoint {
      background: #eee;
    }

    .root {
      background: purple;
      color: white;
    }

    .start {
      background: yellow;
      color: black;
    }

    .active {
      background: #f07;
      color: white;
    }

    .active-alt {
      background: #70f;
      color: white;
    }








    .slider-control label input {
      width: 50%;
      margin: 10px;
    }

    .slider-wrap {
      display: inline;
      float: left;
    }


    .sticky-note textarea {
      font-size: 1.5em;
    }

    pre {
      width: 50%;
      height: 100px;
    }
  </style>
<?php
});

get_header();
?>
<div id="content" class="content seventy">
  <div class="pull-right">
    <button id="sticky-note-button">Sticky Note</button>
  </div><!-- pull-right -->
  <div class="pull-right">
    <label><strong>Progression</strong><br />
      <input id="progression" type="text" />
    </label>
    <button id="progression-clear">Clear</button>
    <button id="progression-help">Help</button>
    <div id="progression-help-content" style="display: none;">
      <h5>Help</h5>
      <p><strong>1</strong><br /> Type in a Chord progression into the box. Separate the chords with spaces or the "|"
        pipe character. <br /><br /><strong>2</strong><br /> Tab out of the text box to cause those rulers to appear.
        <br /><br /><strong>3</strong><br /> Hit the green button to sound that chord
        <br /><br /><strong>4</strong><br /> Hit other buttons too
        <br /><br /><strong>5</strong><br /> Click a note to toggle it on/off
      </p>
      <h3>Example progressions</h3>
      <p>A- B-7b5 C D- E- F G A-</p>
      <p>CM7 D-7 E-7 FM7 G7 A-7 B-7b5 CM7</p>
      <p>D-7 G7 C-7 F7 Bb-7 Eb7 Ab-7 Db7 Gb-7 B7 E-7 A7 D-7 G7 C-7 F7 Bb-7 Eb7 Ab-7 Db7 Gb-7 B7 E-7 A7</p>
      <p>F#-7b5 B7b9 E-7b5 A7b9 F#-7b5 B7b9 E-7b5 A7b9</p>
      <h3>Tips</h3>
      <p>Root notes by themselves are assumed major, ex: A</p>
      <p>Use - or m for minor, ex: A- Em</p>
      <p>Use M7 for major 7, ex: CM7</p>
      <p>Use 7 for dominant 7, ex: G7</p>
    </div>
  </div><!-- pull-right -->

  <!--
        <label for="volume-input">Volume
          <input id="volume-input" type="range" min="0" max="1" step="0.01" value="0.05" />
        </label>
        -->
  <div class="slider-wrap">
    Volume: <br /><span id="volume-amount"></span>
    <div class="slider" id="volume-input"></div>
  </div>
  <div class="slider-wrap">
    Speed:<br /><span id="speed-amount"></span>
    <div class="slider" id="speed-input"></div>
  </div>
  <div class="slider-wrap">
    Detune:<br /> <span id="detune-amount"></span>
    <div class="slider" id="detune-input"></div>
  </div>
  <div class="slider-wrap">
    Start: <br /><span id="start-amount"></span>
    <div class="slider" id="start-input"></div>
  </div>
  <div class="slider-wrap">
    Highest: <br /><span id="highest-amount"></span>
    <div class="slider" id="highest-input"></div>
  </div>
  <div style="clear: both;">&nbsp;</div>




  <div class="fretboard-wrap">
  </div>
  <pre class="tablature">
    tab goes here...
    </pre>
</div><!-- content -->
<script type="text/javascript">
  var campfire = BSD.PubSub({});



  function makeTable(wrap, options) {

    var scale = options.scale;
    var noteNames = scale.noteNames();

    var table = DOM.table().addClass('fretboard-table');
    table.attr('cellspacing', 0);
    table.attr('cellpadding', 0);


    table.empty();

    var openValues = [64, 59, 55, 50, 45, 40];
    var fretRange = [];
    var maxFrets = 22;

    for (var i = options.minFret; i < options.maxFret; i += 1) {
      fretRange.push(i);
    };

    //console.log('cscale',cscale);
    [0, 1, 2, 3, 4, 5].each(function(stringIndex) {

      var open = openValues[stringIndex];

      var row = DOM.tr();
      fretRange.each(function(fret) {

        var valley = open + fret;
        var note = Note(valley);

        var cell = DOM.td().addClass('cell');
        cell.on('click touchend', function() {
          campfire.publish('play-note', {
            note: note,
            duration: 1000
          });
        });

        cell.on('mouseover', function() {
          campfire.publish('div-hover', cell);
        });

        ////console.log('double check',note.value());


        var spatialNote = BSD.SpatialNote({
          note: note,
          cell: cell,
          position: [fret, stringIndex]
        });

        BSD.spatialNotes.push(spatialNote);

        var noteName = note.name();
        if (noteNames.indexOf(noteName) > -1) {
          cell.append(noteName);
          cell.append(DOM.sub(valley));
        }

        if (options.rootNote && note.abstractlyEqualTo(options.rootNote)) {
          cell.addClass('root');
        }

        row.append(cell);
        //console.log(note.name());
      });
      table.append(row);
    });

    //wrap.append(DOM.label(scale.fullName));
    wrap.append(DOM.label(scale.fullName()));
    wrap.append(DOM.br());
    wrap.append(DOM.label().addClass('chord-name'));
    wrap.append(table);

    wrap.append(DOM.div().css('clear', 'both'));

  }

  if (true) {


    var fretboardWrap = jQuery('.fretboard-wrap');

    makeTable(jQuery(fretboardWrap), {
      minFret: 0,
      maxFret: 22,
      scale: makeScale('C major'),
      //pick a root note below //
      rootNote: Note('C'),
      //rootNote: Note('D'),
      //rootNote: Note('E'),
      //rootNote: Note('F'),
      //rootNote: Note('G'),
      //rootNote: Note('A'),
      //rootNote: Note('B'),
      //rootNote: false
      foo: false //ignore this
    });
  }


  /***** stuff starts happening here **/
  function loadImpulseResponse(url, convolver) {
    // Load impulse response asynchronously

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function() {
      context.decodeAudioData(xhr.response,
        function onSuccess(decodedBuffer) {
          // Decoding was successful, do something useful with the audio buffer
          convolver.buffer = decodedBuffer;
          isImpulseResponseLoaded = true;
        },
        function onFailure() {
          alert("Decoding the audio buffer failed");
        });
    }

    xhr.onerror = function() {
      alert("error loading reverb");
    }

    xhr.send();
  }


  BSD.chosenColor = BSD.colorFromHex('#000000');
  BSD.ColorPicker = function(spec) {
    var interface = {};
    interface.renderOn = function(html) {
      var square = DOM.div('').addClass('color-picker');
      square.css('background-color', '#' + spec.color.toHex());
      square.click(function() {
        BSD.chosenColor = spec.color;
      });
      html.append(square);
    };
    return interface;
  };
  BSD.grey = BSD.Color({
    r: 300,
    g: 300,
    b: 300
  });
  BSD.lightGrey = BSD.Color({
    r: 200,
    g: 200,
    b: 200
  });
  BSD.penDown = false;
  jQuery(document).keypress(function(e) {
    if (e.charCode == 96) { //backtick
      BSD.penDown = !BSD.penDown;
    }
  });




  var polyphonyCount = 8;


  let mixer;
  var waiter = BSD.Widgets.Procrastinator({
    timeout: 250
  });


  function onAppLoad() {
    mixer = App.BSDMixer(context);

    BSD.leader = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles,
      range: [40, 128]
    });
    BSD.chunker = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles,
      range: [40, 128]
    });

    ///waiter.beg(BSD.audioPlayer, 'set-master-volume', BSD.volume);
    BSD.leader.publish('set-master-volume', BSD.volume || 0.06);
    BSD.chunker.publish('set-master-volume', BSD.volume || 0.06);
  }






  campfire.subscribe('play-note', function(payload) {
    BSD.leader.playNote(payload.note, payload.duration);
  });

  campfire.subscribe('play-chord', function(o) {
    BSD.chunker.playChord(o.chord, o.duration);
  });

  var speedms = 700;
  var start = 60;
  var highest = 60;

  var speedFunction = function() {
    return speedms;
  }

  campfire.subscribe('set-speed-ms', function(ms) {
    speedms = ms;
  });


  var waiter = BSD.Widgets.Procrastinator({
    timeout: 250
  });

  $("#volume-input").slider({
    orientation: "horizontal",
    range: "min",
    min: 0,
    max: 1,
    step: 0.1,
    value: 0,
    slide: function(event, ui) {
      var newVolume = ui.value;
      waiter.beg(BSD.leader, 'set-master-volume', ui.value);
      ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
      jQuery("#volume-amount").text(newVolume);
    }
  });


  $("#speed-input").slider({
    orientation: "vertical",
    range: "min",
    min: 250,
    max: 800,
    step: 20,
    value: 700,
    slide: function(event, ui) {
      var n = ui.value;

      waiter.beg(campfire, 'set-speed-ms', n);
      //////campfire.publish('set-speed-ms',n);
      jQuery("#speed-amount").text(n);
    }
  });


  $("#detune-input").slider({
    orientation: "vertical",
    range: "min",
    min: -7.0,
    max: 7.0,
    step: 0.25,
    value: 0.0,
    slide: function(event, ui) {
      var n = ui.value;

      waiter.beg(BSD.leader, 'set-detune-semis', n);
      //////campfire.publish('set-speed-ms',n);
      jQuery("#detune-amount").text(n);
    }
  });



  $("#start-input").slider({
    orientation: "vertical",
    range: "min",
    min: 40,
    max: 85,
    step: 1,
    value: 60,
    slide: function(event, ui) {
      var n = ui.value;
      start = BSD.spatialNotes.select(function(o) {
        return o.value() == n;
      }).atRandom();
      jQuery("#start-amount").text(n);
    }
  });
  start = BSD.spatialNotes.select(function(o) {
    return o.value() == 60;
  }).atRandom();



  $("#highest-input").slider({
    orientation: "vertical",
    range: "min",
    min: 40,
    max: 85,
    step: 1,
    value: 60,
    slide: function(event, ui) {
      var n = ui.value;
      highest = BSD.spatialNotes.select(function(o) {
        return o.value() == n;
      }).atRandom();
      jQuery("#highest-amount").text(n);
    }
  });
  highest = BSD.spatialNotes.select(function(o) {
    return o.value() == 60;
  }).atRandom();


  var queue = [];
  var lastSN = false;
  var snHistory = BSD.SpatialNoteCollection([]);
  var idealMPSN = false; //idealized midpoint SN
  var discreteMPSN = false; //real-world midpoint SN
  var maxHistory = 3; //default;


  var progInput = jQuery('#progression');
  progInput.blur(function() {
    if (progInput.val().length == 0) {
      return false;
    }
    var result = [];
    var bars = progInput.val().split('|');
    bars.each(function(bar) {
      var chordNames = bar.split(/,|\ +/);
      chordNames.each(function(name) {
        var chord = makeChord(name);
        result.push(chord);
      });
    });
    campfire.publish('new-progression', result);
  });


  campfire.subscribe('empty-queue', function(o) {

    while (queue.length > 0) {
      queue.pop();
    }
  });


  campfire.subscribe('strategy-three', function(progression) {
    var firstChord = progression[0];
    var topNote = firstChord.mySeventh();
    var startingAbstract = topNote.abstractValue();
    var currentTopAbstract = startingAbstract; //7
    var currentTopReal = topNote.value();

    progression.each(function(chord) {
      console.log('CTR', currentTopReal);

      var vals = chord.abstractNoteValues();
      var overTop = [];
      while (overTop.length == 0) {
        vals = vals.map(function(n) {
          return n + 12;
        });
        ///console.log('vals getting bigger',vals);
        overTop = vals.select(function(v) {
          return v > currentTopReal;
        });
      }
      while (overTop.length > 0) {
        /////console.log('whoahhh too high',vals);
        vals.unshift(vals.pop() - 12);
        overTop = vals.select(function(v) {
          return v > currentTopReal;
        });
      }
      /////console.log('thats better, now flip...',vals);

      vals.reverse();
      console.log('yessss', vals);

      vals.each(function(v) {
        queue.push({
          noteValue: v,
          chordName: chord.fullName(),
          direction: 'sideways'
        });
      });
      currentTopReal = vals[0] - 1;

    });
    console.log('queue', queue);
    campfire.publish('process-queue', null);

  });



  campfire.subscribe('new-progression', function(progression) {
    console.log('newp', progression);
    campfire.publish('strategy-three', progression);
  });

  campfire.subscribe('process-queue', function(o) {

    ////console.log('123');
    var startCandy = BSD.spatialNotes.select(function(sn) {
      return sn.note.name() == 'D';
    });

    lastSN = start;

    start.cell.addClass('start');

    console.log('start', start.note.value());

    var sequence = [];

    eachify(queue).eachPCN(function(o) {
      if (o.c == 0) {
        maxHistory = [5, 7, 9].atRandom();
        console.log('maxHistory', maxHistory);
      }
      var note = Note(o.current.noteValue);
      var candidates = BSD.spatialNotes.abstractlyEqualTo(note);
      if (snHistory.length < 2) {
        idealMPSN = lastSN;
        discreteMPSN = lastSN;
      } else {
        var midpoint = snHistory.midpoint();
        idealMPSN = BSD.SpatialNote({
          note: lastSN.note, //dummy
          cell: lastSN.cell, //dummy
          position: midpoint
        });
        discreteMPSN = BSD.spatialNotes.closestTo(idealMPSN); //from ideal to real-world
      }



      //restrict candidates to under the highest.
      candidates = candidates.noteValueLE(highest); ///////select(function(o){ return o.value() <= highest.value(); });

      console.log('candidates', candidates);


      var hit = candidates.closestTo(idealMPSN);
      snHistory.push(hit); //new ones onto the end
      while (snHistory.length > maxHistory) {
        snHistory.shift(); //old ones come off the front
      }
      sequence.push({
        spatialNote: hit,
        chordName: o.current.chordName,
        direction: o.current.direction
      });

      ////console.log('snHistory',snHistory.map(function(o) { return o.note.value(); }));
      lastSN = hit;
      ///console.log('note',note);  
    });

    campfire.publish('tablature', sequence);




    var alt = false;

    eachify(sequence).eachPCN(function(o) {

      //////console.log('oh',o);
      ///var note = Note(o.current.noteValue);
      var spatialNote = o.current.spatialNote;
      var chordName = o.current.chordName;
      var direction = o.current.direction;

      if (o.current.chordName != o.prev.chordName) {
        alt = !alt;
      }

      ///console.log('spatialNote',spatialNote);
      campfire.publish('play-note', {
        note: spatialNote,
        duration: 1000
      });


      jQuery('.chord-name').html(chordName + ' ' + direction);
      jQuery('.midpoint').removeClass('midpoint'); //clear them all first



      //////console.log('oh?',o);

      /**
        discreteMPSN.cell.addClass('midpoint');
      lastSN.cell.removeClass('active');
      hit.cell.addClass('active');
      **/

      jQuery('.cell').removeClass('active');
      jQuery('.cell').removeClass('active-alt');


      if (alt) {
        o.current.spatialNote.cell.addClass('active-alt');
      } else {
        o.current.spatialNote.cell.addClass('active');
      }

    }, speedFunction);

  }); //process-queue// (was new-progression

  ///no need to artificially spin-up the queue///campfire.publish('new-progression',[makeChord('C')]);
  campfire.publish('process-queue', null);



  campfire.subscribe('plot-spatial-note', function(o) {

    campfire.publish('play-note', {
      note: o,
      duration: 1000
    });

    var note = o;
    var candidates = BSD.spatialNotes.abstractlyEqualTo(note);
    if (snHistory.length < 2) {
      idealMPSN = lastSN;
      discreteMPSN = lastSN;
    } else {
      var midpoint = snHistory.midpoint();
      idealMPSN = BSD.SpatialNote({
        note: lastSN.note, //dummy
        cell: lastSN.cell, //dummy
        position: midpoint
      });
      discreteMPSN = BSD.spatialNotes.closestTo(idealMPSN); //from ideal to real-world
    }



    //restrict candidates to under the highest.
    candidates = candidates.noteValueLE(highest); ///////select(function(o){ return o.value() <= highest.value(); });

    console.log('candidates', candidates);

    jQuery('.cell').removeClass('active');
    jQuery('.cell').removeClass('active-alt');


    var hit = candidates.closestTo(idealMPSN);
    hit.cell.addClass('active');


    snHistory.push(hit); //new ones onto the end
    while (snHistory.length > maxHistory) {
      snHistory.shift(); //old ones come off the front
    }

  });




  BSD.chunkify = function(ary, chunkSize) {
    var chunks = [];
    var copy = ary.map(function(o) {
      return o;
    });
    while (copy.length > chunkSize) {
      chunks.push(copy.splice(0, chunkSize));
    }
    chunks.push(copy);
    return chunks;
  };

  var pre = jQuery('.tablature');
  campfire.subscribe('tablature', function(sequence) {
    var output = '';
    var eventsPerRow = 30;
    var staves = BSD.chunkify(sequence, eventsPerRow);

    var stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];


    output += "\n";
    staves.each(function(staff) {

      [0, 1, 2, 3, 4, 5].each(function(string) {


        var stringName = stringNames[string];

        output += stringName + '--';


        staff.each(function(o) {
          var spatialNote = o.spatialNote;
          var ch = '---';
          if (spatialNote.y == string) {
            ch = '---' + spatialNote.x;
          }

          ch = ch.substr(-3, 3);

          output += ch;
          ///console.log('spatialNote',spatialNote,spatialNote.y);
        });
        output += "\n";
      });
      output += "\n";
    });

    ////console.log('output',output);


    pre.html(output);



  });


  var progHelp = jQuery('#progression-help');
  progHelp.click(function() {
    var lightbox = BSD.Widgets.Lightbox({
      content: jQuery('#progression-help-content')
    });
    lightbox.show();
  });


  jQuery(document).on('keydown', function(e) {
    var c = e.keyCode || e.which;
    ////console.log('BSD.currentFretDiv',BSD.currentFretDiv);
    if (BSD.currentFretDiv && c == BSD.keycodes.f) {
      BSD.currentFretDiv.trigger('click');
    }
  });

  campfire.subscribe('div-hover', function(div) {
    BSD.currentFretDiv = div;
  });

  var stickyNoteButton = jQuery('#sticky-note-button');
  stickyNoteButton.click(function() {
    var sticky = BSD.Widgets.StickyNote();
    sticky.renderOn(jQuery(document.body));
  });
</script>
<?php

get_footer();
