<?php


add_filter('wp_title', function ($o) {
  return 'Prog Fretboards';
});
add_action('wp_head', function () {
?>

  <title>12 Fretboards</title>
  <style>
    @import 'css/prog-fretboards.css';
    @import 'css/piano-roll.css';
    @import 'css/lcd.css';
    @import 'css/vindow.css';
    @import 'css/svg-fretboard.css';
    @import 'css/prog-transport.css';
    @import 'css/song-list.css';

  </style>

<?php
});
add_action('dynamic-header-content',function(){
  ?>
    <button class="btn-auto-arrange">Auto Arrange</button>
  <?php
  });
  
get_header(); ?>


<div class="navbar-spacer screen-only noprint">
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
</div>




<div class="navbar-spacer screen-only noprint">
</div>

<div class="controls noprint">

  <div class="color-palette-wrap noprint">
  </div>
  <label>Beats per Measure</label>
  <select class="beats-per-measure">
    <option value="3">3</option>
    <option value="4">4</option>
  </select>

  <label>Note Resolution</label>
  <select class="note-resolution">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="4">4</option>
    <option value="8">8</option>
    <option value="16">16</option>
  </select>


  <div class="form-inline form-progression">
    <label>Progression</label>
    <div class="form-group">
      <button class="btn btn-info btn-start">Start</button>
      <textarea  class="form-control progression"></textarea>
    </div>
  </div>


  <div class="clear-both">&nbsp;</div>

  <button class="btn btn-info btn-pause"><i class="fa fa-pause"></i> Pause</button>
  <button class="btn btn-info btn-toggle-text noprint">Toggle Text</button>
  <button class="btn btn-info btn-save-prog"><i class="fa fa-save"></i> Save Prog</button>
  <button class="btn btn-info btn-toggle-tiny">Tiny</button>
  <button class="btn btn-info btn-toggle-tables">Tables</button>
  <br />


  <div class="slider-wrap bsd-control">
    <label>Min-Max Frets</label>
    <span class="fret-range-amount">0-17</span>
    <div class="slider fret-range-input"></div>
    <div style="clear: both;">&nbsp;</div>
  </div>
  <label>String Set</label>

  <select class="stringset">
    <optgroup label="All">
      <option value="654321">654321</option>
    </optgroup>
    <optgroup label="Drop 2">
      <option value="4321">4321</option>
      <option value="5432">5432</option>
      <option value="6543">6543</option>
    </optgroup>
    <optgroup label="Drop 3">
      <option value="6432">6432</option>
      <option value="5321">5321</option>
    </optgroup>
    <optgroup label="Other">
      <option value="64321">64321</option>
      <option value="54321">54321</option>
      <option value="6532">6532</option>
      <option value="321">321</option>
      <option value="432">432</option>
      <option value="543">543</option>
      <option value="654">654</option>
      <option value="643">643</option>
      <option value="531">531</option>
      <option value="21">21</option>
    </optgroup>
  </select>


  <br />
</div>


<div class="svg-wrap">
</div>
<div class="svg-controls noprint">
  <div class="btn-group svg-buttons">
    <button class="btn btn-sm btn-primary btn-chord">chord</button>
    <button class="btn btn-sm btn-primary btn-scale">scale</button>
    <button class="btn btn-sm btn-primary btn-clear">clear</button>
    <button class="btn btn-sm btn-default btn-color">&nbsp;color&nbsp;</button>
  </div>
  <input class="form-input fret-plotter-input" type="text" />
  <input class="svg-alpha" type="range" min="0" max="1" step="0.01" value="0.7" />
</div>

<div class="venue">
  <h3 class="song-name"></h3>
  <h5 class="stringset-name"></h5>
</div>
<div class="venue-footer"></div>


<div class="song-list-wrap noprint">
</div>
<div class="piano-roll-wrap noprint">
</div>
<div class="monitor-wrap noprint"></div>



<!-- modal lightbox -->
<div class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Basic Modal</h4>
      </div>
      <div class="modal-body">
        <h3>Modal Body</h3>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
      </div>
    </div>
  </div>
</div><!-- modal -->


<?php

add_action('wp_footer', function () {
?>
  <script>
    let jvtool = {};
  </script>
  <script src="<?php home_url();  ?>/lib/CodingMath/utils.js"></script>
  <script src="<?php home_url();  ?>/lib/dat.gui.js"></script>
  <script src="<?php home_url();  ?>/lib/la.js"></script>
  <script src="<?php home_url();  ?>/lib/async.min.js"></script>
  <script src="<?php home_url();  ?>/js/draggy.js"></script>
  <script src="<?php home_url();  ?>/js/sticky-note.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.widgets.colorpicker.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.widgets.simpleplayer.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.widgets.tonalityguru.js"></script>

  <script src="<?php home_url();  ?>/js/patchList.js"></script>


  <script type="module">
    import JSMT, { Note, makeChord, makeChordFromNotes, makeScale } from "./js/js-music-theory.js";
    import DOM from "./js/DOM.js";
    import Chord from "./js/Chord.js";

    import FreakySeq from "./js/FreakySeq.js";
    import PianoRoll from "./js/PianoRoll.js";
    import { parseProgression } from "./js/Progression.js";
    import MIDIOutMonitor from "./js/MIDIOutMonitor.js";
    import MIDIRouter from "./js/MIDIRouter.js";
    import MIDIInfo from "./js/MIDIInfo.js";
    import BSDMixer from "./js/BSDMixer.js";
    import ColorPalette from "./js/ColorPalette.js";
    import {
      MIDI_CONST,
      MIDI_MSG
    } from "./js/MIDIConstants.js";
    import Vindow, {autoArrange, allVindows} from "./js/Vindow.js";
    import Draggable from "./js/Draggable.js";
    import Point from "./js/Point.js"

    import {
      setBackgroundHue
    } from "./js/Utils.js";

    import SongList from "./js/SongList.js";
    import SVGFretboard, {getFretsByChromaticHash, getFrets, getIntervalFill} from "./js/SVGFretboard.js";

    import Fretboard, {
      makeFretboardOn
    } from "./js/Fretboard.js";

    import {lerp,invlerp, remap} from './js/Lerpy.js';

    import {RemoteStorage} from "./js/RemoteStorage.js";
    import Procrastinator from "./js/Procrastinator.js";
    import PubSub from "./js/PubSub.js";
    import ProgTransport from "./js/ProgTransport.js";
    import Dropdown from "./js/Dropdown.js"

    window.lerp = lerp;
    window.invlerp = invlerp;
    window.remap = remap;

    let router;


    const campfire = PubSub();


    function handleExternallyReceivedNoteOn(msg, noteNumber, velocity) {
      if (router && router.outPort && BSD.options.improv.midi) {
        let noteOnChannel = MIDI_MSG.NOTE_ON + (BSD.options.improv.channel - 1);
        return router.outPort.send([noteOnChannel, noteNumber, velocity]);
      }
      //okay, we'll synthesize using WekAudio LFO.
      campfire.publish('play-note', {
        note: Note(noteNumber),
        duration: BSD.durations.note
      });
    }

    function handleExternallyReceivedNoteOff(msg, noteNumber, velocity) {
      let needToBother = router && router.outPort && BSD.options.improv.midi;
      if (!needToBother) {
        return false;
      }
      let noteOffChannel = MIDI_MSG.NOTE_OFF + (BSD.options.improv.channel - 1);
      return router.outPort.send([noteOffChannel, noteNumber, velocity]);
    }

    router = MIDIRouter({
      onMIDIMessage: function(e) {
        //NOTE: this comes from the external app/controller/gear input

        ///console.log("eeeeee",e);
        //console.log("BSD?",BSD)

        let [msg, noteNumber, velocity] = e.data;
        console.log('msg', msg);

        if (msg == MIDI_MSG.NOTE_ON) {
          return handleExternallyReceivedNoteOn(msg, noteNumber, velocity);
        }
        if (msg == MIDI_MSG.NOTE_OFF) {
          return handleExternallyReceivedNoteOff(msg, noteNumber, velocity);
        }

        if (msg == MIDI_MSG.PITCH_BEND) {
          //i guess i don't understand this yet. why can't I just pass it thru?
          console.log('bend?', e.data);
          return router.outPort.send(e.data);
        }


      }

    });

    //toss this variable over the module/non-module fence for now until further refactoring is done.
    /////window.router = router;

    //why is campfire visible inside the module?
    console.log('campfire?', campfire);


    // XXXXXXXX
    //this is where we crossed over from module to regular js.....
    // XXXXXXXX
    var body = DOM.from(document.body);



    BSD.timeout = false;



    let defaultOptions = {
      progCycles: 3,
      progression: "Ab7 Db Gb- DbMaj7",
      showCurrentChordFretboardOnly: true,
      scrollToBoard: false,
      tempo: 120,
      bass: {
        enabled: true,
        midi: false,
        channel: 1,
        volume: 0.7,
        bank: 1,
        patch: 1,
        pan: 64
      },
      chord: {
        enabled: true,
        midi: false,
        channel: 2,
        volume: 0.7,
        bank: 1,
        patch: 1,
        pan: 64
      },
      hihat: {
        enabled: true,
        midi: false,
        channel: 10,
        noteNumber: 64,
        volume: 0.2,
        pan: 64
      },
      improv: {
        enabled: true,
        midi: false,
        channel: 3,
        bank: 1,
        patch: 1,
        volume: 0.7,
        pan: 64,
        insideChord: true
      }
    };
    BSD.options = {
      ...defaultOptions
    };


    var progInput = DOM.from('.progression');
    progInput.attr('placeholder','Type a Chord Progression here... Example: C | Em | G7 | % ');
    progInput.on('touchend', function() { //for iOS bug
      ///alert('hey');
      BSD.handleFirstClick();
    });


    campfire.on('options-loaded', function() {
      if (BSD.options.progression) {
        progInput.val(BSD.options.progression);
      }
      loadDatGUI();
    });



    storage.getItem('options', function(o) {

      let stored = JSON.parse(o);
      BSD.options = {
        ...BSD.options,
        ...stored
      }

      campfire.publish('options-loaded', BSD.options); //needed?
    }, function() {
      //not found, but still go with what we have...
      //FIXME: rethink
      campfire.publish('options-loaded', BSD.options); //needed?

    });

    ///BSD.remoteStorage.getItem('foo',function(){ alert('foo'); });



    BSD.itemTitles = ['fundamental', 'octave', 'dominant', 'dominant+fourth(octave2)'];
    if (BSD.iOS) {
      BSD.itemTitles = ['fundamental'];
    }
    ////alert(BSD.itemTitles);


    BSD.progressions = [];


    BSD.durations = {
      bass: 1500,
      chord: 1000,
      hihat: 300,
      note: 1000
    };





    BSD.tests = [];


    var remoteStorage = RemoteStorage({
      prefix: 'JSMT::',
      url: BSD.baseURL + '/remote-storage'
    });


    remoteStorage.getItem('progressions', function(err,o) {
      if (err) { throw err; }
      var them = o && o.length ? JSON.parse(o) : [];
      them.forEach(function(o) {
        BSD.progressions.push(o);
      });
      campfire.publish('progressions-loaded', BSD.progressions); //needed?
    });



    campfire.on('progressions-loaded', function() {
      BSD.songlist.clear();
      BSD.progressions.forEach(function(progression) {
        ///console.log('whoah',progression);
        BSD.songlist.addSong({
          title: progression.title,
          progression: progression.prog || progression.progression
        });
      });
    });


    remoteStorage.getItem('progressions', function(o) {
      var them = o && o.length ? JSON.parse(o) : [];
      them.forEach(function(o) {
        BSD.progressions.push(o);
      });
      campfire.publish('progressions-loaded', BSD.progressions); //needed?
    });

    function saveOptions(e) {
      storage.setItem('options', JSON.stringify(BSD.options));
    }


    campfire.on('save-progressions', function() {
      BSD.progressions = BSD.progressions.sort(BSD.sorter(function(o) {
        return o.title;
      }));
      BSD.progressions = BSD.progressions.map(function(o) {
        if (!o.progression && o.prog) {
          o.progression = o.prog;
          delete o.prog;
        }
        return o;
      });


      var unique = {};

      function slugger(o) {
        return btoa(JSON.stringify(o.progression + o.title));
      }
      var uniqueSpecs = [];
      BSD.progressions.forEach(function(o) {
        var hit = unique[slugger(o)];
        if (!hit) {
          unique[slugger(o)] = o;
          uniqueSpecs.push(o);
        }
      });



      if (BSD.progressions.length == 0) {
        alert('something messed up');
        return false;
      }
      if (uniqueSpecs.length == 0) {
        alert('something messed up');
        return false;
      }

      var data = JSON.stringify(uniqueSpecs);

      ////////console.log('data!!!!!',data);
      /////return false;

      var backupDate = (new Date).toISOString().replace(/T.*$/, '');


      storage.setItem('progressions', data);
      storage.setItem('progressions-' + backupDate, data);

      remoteStorage.setItem('progressions', data);
      remoteStorage.setItem('progressions-' + backupDate, data);

    });

    var btnSaveProg = DOM.from('.btn-save-prog');
    btnSaveProg.on('click', function() {
      var title = prompt('Title');
      if (title) {
        var spec = {
          title: title,
          progression: progInput.val()
        };
        BSD.progressions.push(spec);
        BSD.songlist.addSong(spec);
        BSD.songlist.sort();
        BSD.songlist.refresh();
        campfire.publish('save-progressions');

      }
    });



    function checkTiny() {
      BSD.options.tiny ? venue.addClass('tiny') : venue.removeClass('tiny');
      BSD.options.tiny ? btnToggleTiny.html('Big') : btnToggleTiny.html('Tiny');
    }


    function checkTables() {

      var show = BSD.options.showTables;
      var them = DOM.from('.table-stage, .fretboard-table');
      show ? them.removeClass('hidden') : them.addClass('hidden')



      show ? btnToggleTables.html('No Tables') : btnToggleTables.html('Tables');
    }

    var venue = DOM.from('.venue');
    var songName = DOM.from('.song-name');


    var btnToggleTiny = DOM.from('.btn-toggle-tiny');
    btnToggleTiny.on('click', function() {
      BSD.options.tiny = !BSD.options.tiny;
      storage.setItem('options', JSON.stringify(BSD.options));
      checkTiny();
    });
    checkTiny();

    var btnToggleTables = DOM.from('.btn-toggle-tables');
    btnToggleTables.on('click', function() {
      BSD.options.showTables = !BSD.options.showTables;
      storage.setItem('options', JSON.stringify(BSD.options));
      checkTables();
    });
    checkTables();





    BSD.foo = [];

    BSD.chosenColor = BSD.colorFromHex('#bbbbbb');
    BSD.chosenColors = [BSD.chosenColor];




    var cscale = makeScale('Cmajor');
    var noteNames = cscale.noteNames();



    BSD.boards = [];
    var colorHash = {};

    let mixer, bassist, keyboardist;


    mixer = BSDMixer(context);
    BSD.audioPlayer = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles,
      range: [40, 128]
    });


    bassist = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles, //['fundamental','octave','dominant','dominant+fourth(octave2)'],
      range: [28, 100]
    });


    keyboardist = BSD.Widgets.SimplePlayer({
      context: context,
      destination: mixer.common,
      polyphonyCount: 48, //polyphonyCount,
      itemTitles: BSD.itemTitles, //['fundamental','octave','dominant','dominant+fourth(octave2)'],
      range: [28, 100]
    });


    const debounce = Procrastinator();

    

    BSD.songlist = SongList({});

    var songListWrap = DOM.from('.song-list-wrap');
    //BSD.songlist.renderOn(songlistWrap);
    let wSongList = Vindow({
      title: "Song List"
    });
    //let [toolbar,pane] = pianoRoll.ui();
    ///w.appendToToolbar(toolbar);
    wSongList.renderOn(songListWrap);
    BSD.songlist.renderOn(wSongList.pane);


    BSD.songlist.on('song-selected', function(song) {
      BSD.currentSong = song;
      songName.html(song.title);
      ////console.log('Z>>EEEEE>>>song',song);
      /////campfire.publish('lets-do-this',song.progression);
      progInput.val(song.progression);
      BSD.options.progression = song.progression;
      storage.setItem('options', JSON.stringify(BSD.options));
      var prog = parseProgression(song.progression);
      campfire.publish('do-it', prog);
    });












    function get7bitMSBAndLSB(orig) {
      let msb = Math.floor(orig / 128);
      let lsb = orig % 128;
      //return console.log('bankSelect','decimalBankNumber',decimalBankNumber,'msb',msb,'lsb',lsb);
      return [msb, lsb];
    }

    function bankSelect(channelFrom1, msb, lsb) {
      /*
      http://midi.teragonaudio.com/tutr/rolarc.htm
      
      http://midi.teragonaudio.com/tutr/bank.htm
      
      http://www.andrelouis.com/qws/art/art009.htm
      
      http://www.mutools.com/info/M8/docs/mulab/using-bank-select-and-prog-changes.html
      
      https://beatbars.com/blog/what-is-program-change.html    
      */
      //return console.log('bankSelect','decimalBankNumber',decimalBankNumber,'msb',msb,'lsb',lsb);
      ////let [msb, lsb] = get7bitMSBAndLSB(decimalBankNumber);
      if (!router || !router.outPort) {
        return console.log("bankSelect: no MIDI output currently open");
      }
      router.outPort.send([
        MIDI_CONST.CONTROL_CHANGE | (channelFrom1 - 1),
        0,
        msb
      ]);
      router.outPort.send([
        MIDI_CONST.CONTROL_CHANGE | (channelFrom1 - 1),
        0x20, //32
        lsb
      ]);
    }




    let empty = {
      name: false
    }

    function patchSelectorUL(opts) {

      let manifold = PubSub();
      manifold.on('click',({ label, opts, bankOpts, patch }) => {
        //console.log("we got a megaOption!!",megaOption);
        let p = +patch.number - 1;
        console.log('opts', opts, 'bankOpts', bankOpts, 'patch', patch, 'p', p);
        bankSelect(opts.channel, bankOpts.msb, bankOpts.lsb, p);
        if (!router.outPort) {
          return false;
        }
        router.outPort.send([
          MIDI_CONST.PROGRAM_CHANGE | (opts.channel - 1),
          p
        ]);
      });

      Object.keys(jvtool.banks).map((bankName, i) => {
        let megaOptions = [];
        let bankOpts = jvtool.banks[bankName];
        bankOpts.patches.forEach(patch => {
          let megaOption = {
            label: `${bankName} :: ${patch.number} ${patch.name}`,
            opts,
            bankOpts,
            patch
          }
          megaOptions.push(megaOption)
        })
        let dd = Dropdown({ 
          options: megaOptions,
          label: bankName
        })
        opts.wrap.append(dd.ui());
        dd.relay('click',manifold)
      })


    }

    function hookupPanControl(guiFolder, voiceOptions) {
      guiFolder.add(voiceOptions, 'pan')
        .min(1)
        .max(128)
        .onChange(function(e) {
          saveOptions();
          if (!router.outPort) {
            return false;
          }
          router.outPort.send([
            MIDI_CONST.CONTROL_CHANGE | (voiceOptions.channel - 1),
            MIDI_CONST.CC_PAN,
            voiceOptions.pan - 1
          ]);
        });
    }

    function setupMIDIEnabledVoicePatches() {
      ['improv', 'bass','chord','hihat']
        .filter(voiceName => BSD.options[voiceName].midi && BSD.options[voiceName].enabled)
        .map(voiceName => {
          console.log(voiceName, 'needs setup')
          setMIDIChannelPatch(BSD.options[voiceName]);
        })
    }

    function setMIDIChannelPatch({ channel, patch }) {
      if (!router || !router.outPort) {
        return false;
      }
      router.outPort.send([
        MIDI_CONST.PROGRAM_CHANGE | (channel - 1),
        patch - 1
      ]);
    }

    function hookupPatchControl(guiFolder, voiceOptions) {
      guiFolder.add(voiceOptions, 'patch')
        .min(1)
        .max(128)
        .step(1)
        .onChange(function(v) {
          saveOptions();
          setMIDIChannelPatch(voiceOptions)
        });
    }


    function hookupChannel(guiFolder, voiceOptions) {
      guiFolder.add(voiceOptions, 'channel')
        .min(1)
        .max(16)
        .step(1)
        .onChange(saveOptions);
    }

    function hookupVolume(guiFolder, voiceOptions) {
      guiFolder.add(voiceOptions, 'volume')
        .min(0)
        .max(1)
        .onChange(saveOptions);
    }

    function hookupJV(parentFolder, opts) {

      let goob = {
        doIt: function() {
          lightbox('wee', function(wrap) {
            patchSelectorUL({
              ...opts,
              wrap
            });
          });
        }
      }
      parentFolder.add(goob, 'doIt').name('Change Patch');
    }



    var volumeInput = DOM.from('.volume-input');
    var volumeAmount = DOM.from('.volume-amount');
    volumeInput.on('change',function(e){
      var newVolume = parseFloat(e.target.value);
      BSD.volume = newVolume;
      debounce('set-master-volume',
        () => {
          campfire.emit('set-master-volume', newVolume);
          storage.setItem('volume', newVolume);        
      },250);
      volumeAmount.text(newVolume);
    });

    BSD.volume = 0.06;
    storage.getItem('volume', function(o) {
      BSD.volume = parseFloat(o);
      campfire.emit('set-master-volume',BSD.volume);
      volumeAmount.text(BSD.volume);
    });



    campfire.on('render-fret-range-control', function() {
      DOM.from('.fret-range-amount').text(
        BSD.options.fretRange.toString().replace(/,/, '-')
      );
      jQuery('.fret-range-input').slider({
        orientation: 'horizontal',
        range: 'min',
        min: 0,
        max: 20,
        step: 1,
        values: BSD.options.fretRange,
        slide: function(event, ui) {
          var n = ui.values;
          BSD.options.fretRange = n;
          storage.setItem('options', JSON.stringify(BSD.options));
          console.log('n', n);
          DOM.from('.fret-range-amount').text(
            n.toString().replace(/,/, '-')
          );
          campfire.publish('fret-range-updated', BSD.options.fretRange);
        }
      });
    });


    BSD.beatsPerMeasure = 4;
    var ddBeatsPerMeasure = DOM.from('.beats-per-measure');
    ddBeatsPerMeasure.on('change', function() {
      BSD.beatsPerMeasure = parseInt(this.value, 10);
    });
    ddBeatsPerMeasure.find('option[value="' + BSD.beatsPerMeasure + '"]').attr('selected', true);

    BSD.noteResolution = 4;
    var ddNoteResolution = DOM.from('.note-resolution');
    ddNoteResolution.on('change', function() {
      BSD.noteResolution = parseInt(this.value, 10);
    });
    ddNoteResolution.find('option[value="' + BSD.noteResolution + '"]').attr('selected', true);


    if (!BSD.options.stringSet) {
      BSD.options.stringSet = '654321';
      storage.setItem('options', JSON.stringify(BSD.options));
    }
    var ddStringSet = DOM.from('.stringset');
    ddStringSet.on('change', function() {
      ///////BSD.beatsPerMeasure = parseInt(this.value,10);
      BSD.options.stringSet = this.value;
      storage.setItem('options', JSON.stringify(BSD.options));
    });
    ddStringSet.find('option[value="' + BSD.options.stringSet + '"]').attr('selected', true);









    if (!BSD.options.fretRange) {
      BSD.options.fretRange = [0, 18];
    }
    campfire.publish('render-fret-range-control');




    campfire.on('fret-range-updated', function(o) {
      BSD.boards.forEach(function(board) {
        board.publish('visible-fret-range', o);
      });
    });


    campfire.on('set-master-volume', function(o) {
      BSD.audioPlayer.publish('set-master-volume', o);
      bassist.publish('set-master-volume', o);
      keyboardist.publish('set-master-volume', o);
    });


    campfire.on('stop-note', function(payload) {
      BSD.audioPlayer.stopNote(payload.note);
    });

    //LEAD / IMPROV
    campfire.on('play-note', function(payload) {
      if (!BSD.options.improv.enabled) {
        return false;
      }

      if (router.outPort && BSD.options.improv.midi) {
        let noteOnChannel = MIDI_CONST.NOTE_ON + (BSD.options.improv.channel - 1);
        let noteOffChannel = MIDI_CONST.NOTE_OFF + (BSD.options.improv.channel - 1);
        let noteNum = payload.note.value();
        let vel = BSD.options.improv.volume * BSD.volume; 
        vel = Math.floor(127 * vel);////[0..1] -> [0..127]

        router.outPort.send([noteOnChannel, noteNum, vel]);
        return setTimeout(function() {
          router.outPort.send([noteOffChannel, noteNum, vel]);
        }, BSD.durations.note);
      }
      // okay, currently no MIDI output, we'll use our WebAudio API synth
      BSD.audioPlayer.playNote(payload.note, payload.duration, payload.velocity);
    });


    //CHORD
    campfire.on('play-notes', function(notes) {

      //console.log('notes??',notes);
      var chord = makeChordFromNotes(notes);

      ///console.log('chord??',chord);

      campfire.publish('play-chord', {
        chord: chord,
        duration: BSD.durations.chord
      });
    });



    //FIXME: ugly, but needed for datGUI to have a slot on an object for this function.

    campfire.on('play-chord', function(o) {
      if (!BSD.options.chord.enabled) {
        return false; //done
      }

      var filtered = o.chord.spec.intervals
        .select(function(n) {
          return n > 0 && n !== 7;
        }) //no root, no 5
        .map(function(n) {
          //if (n == 10) { return n - 12; }
          return n;
        })
      var rootless = Chord({
        rootNote: o.chord.rootNote,
        intervals: filtered
      });
      let midiNoteValues = rootless.notes().map(n => n.value());


      if (!BSD.options.chord.midi) {
        BSD.audioPlayer.playChord(rootless, o.duration);
        return false; //done
      }

      ///console.log('rooteless notes',rootless.notes());

      if (router.outPort && router.outPort.connection == 'open') {

        let vel = BSD.options.chord.volume * BSD.volume; 
        vel = Math.floor(127 * vel);////[0..1] -> [0..127]

        let noteOnWithzeroBasedChannel = 143 + BSD.options.chord.channel;
        let noteOffWithzeroBasedChannel = 127 + BSD.options.chord.channel;

        midiNoteValues.map(v => {
          router.outPort.send([noteOnWithzeroBasedChannel, v, vel]);
        });

        //schedule the NOTE OFF
        setTimeout(function() {
          midiNoteValues.map(v => {
            router.outPort.send([noteOffWithzeroBasedChannel, v, vel]);
          })
        }, o.duration);


      }


    });




    campfire.on('note-hover', function(note) {
      //console.log('note',note.name());
      BSD.currentNote = note;
      if (BSD.strum) {
        BSD.audioPlayer.playNote(note, BSD.durations.note);
      }

    });
    campfire.on('fret-hover', ({ fret }) => {
      BSD.currentNote = Note(fret.noteValue);
    })


    DOM.from(document).on('keydown', function(e) {
      var c = e.keyCode || e.which;

      /* rethink */
      let noteNumber = BSD.currentNote ? BSD.currentNote.value() : 60;
      let noteOnChanByte = 0x90 + (BSD.options.improv.channel - 1);
      let noteOffChanByte = 0x80 + (BSD.options.improv.channel - 1);

      if (BSD.currentNote && c == BSD.keycodes.f) {

        if (BSD.options.improv.midi && router.outPort) {
          router.outPort.send([noteOnChanByte, noteNumber, 0x7f]);
          return setTimeout(function() {
            router.outPort.send([noteOffChanByte, noteNumber, 0x7f]);
          }, 250);
        }
        BSD.audioPlayer.playNote(BSD.currentNote, BSD.durations.note);
      }

      if (BSD.currentChord && c == BSD.keycodes.f) {
        BSD.audioPlayer.playChord(BSD.currentChord, BSD.durations.chord);
      }



      if (BSD.currentNote && c == BSD.keycodes.d) {
        BSD.strum = true;
        ////BSD.audioPlayer.playNote(BSD.currentNote,BSD.durations.note);    
      }

      if (e.shiftKey) {
        BSD.strum = true;
      }



    });

    DOM.from(document).on('keyup', function(e) {
      BSD.strum = false;
    });


    BSD.importJSON(BSD.baseURL + '/data/guitar.json', function(err, data) {
      if (err) {
        throw err;
        return err;
      }
      BSD.guitarData = data;
      campfire.publish('guitar-data-loaded', data);
    });

    var btnToggleText = DOM.from('.btn-toggle-text');
    var hideText = false;
    let html = DOM.from('html')
    btnToggleText.on('click', function() {
      hideText = !hideText;
      hideText ? html.addClass('hide-text') : html.removeClass('hide-text');
    });




    var btnPause = DOM.from('.btn-pause');
    btnPause.on('click', function() {


      campfire.publish('first-click');
      BSD.pause = !BSD.pause;
      if (BSD.pause) {
        campfire.publish('stop-it');
      } else {
        if (BSD.sequence && BSD.sequence.length > 0) {
          tick(BSD.sequence[0]);
        }
      }
    });




    function loadDatGUI() {
      //https://stackoverflow.com/questions/18366229/is-it-possible-to-create-a-button-using-dat-gui
      const gui = new dat.GUI({ width: 400 });
      gui.remember(BSD.options);


      let mainFolder = gui.addFolder('main', 'Main');
      mainFolder.add(router, 'allNotesOff');
      mainFolder.add(BSD.options, 'tempo')
        .min(50)
        .max(250)
        .step(1)
        .onChange(function(bpm) {
          saveOptions();
          campfire.publish('tempo-change', bpm)
        });
      mainFolder.add(BSD.options, 'progCycles')
        .min(1)
        .max(64)
        .step(1)
        .onChange(saveOptions);

      mainFolder.add(BSD.options, 'showCurrentChordFretboardOnly')
        .onChange(saveOptions);
      mainFolder.add(BSD.options, 'scrollToBoard')
        .onChange(saveOptions);

      let improvFolder = gui.addFolder('improv', 'Improv');
      improvFolder.add(BSD.options.improv, 'enabled')
        .onChange(saveOptions);
      improvFolder.add(BSD.options.improv, 'midi')
        .onChange(saveOptions);

      hookupChannel(improvFolder, BSD.options.improv);
      hookupVolume(improvFolder, BSD.options.improv);
      hookupJV(improvFolder, BSD.options.improv);
      hookupPatchControl(improvFolder, BSD.options.improv);
      hookupPanControl(improvFolder, BSD.options.improv);

      improvFolder.add(BSD.options.improv, 'insideChord')
        .onChange(saveOptions);


      let bassFolder = gui.addFolder('bass', 'Bass');
      bassFolder.add(BSD.options.bass, 'enabled')
        .onChange(saveOptions);
      bassFolder.add(BSD.options.bass, 'midi')
        .onChange(saveOptions);
      
      hookupChannel(bassFolder, BSD.options.bass);
      hookupVolume(bassFolder, BSD.options.bass);
      hookupPanControl(bassFolder, BSD.options.bass);
      hookupPatchControl(bassFolder, BSD.options.bass);
      hookupJV(bassFolder, BSD.options.bass);


      let chordFolder = gui.addFolder('chord', 'Chords');

      chordFolder.add(BSD.options.chord, 'enabled').onChange(saveOptions);
      chordFolder.add(BSD.options.chord, 'midi').onChange(saveOptions);

      hookupChannel(chordFolder, BSD.options.chord);
      hookupVolume(chordFolder, BSD.options.chord);
      hookupPanControl(chordFolder, BSD.options.chord);
      hookupPatchControl(chordFolder, BSD.options.chord);
      hookupJV(chordFolder, BSD.options.chord);




      let hatFolder = gui.addFolder('hihat', 'High-hat');
      hatFolder.add(BSD.options.hihat, 'enabled').onChange(saveOptions);
      hatFolder.add(BSD.options.hihat, 'midi').onChange(saveOptions);
      hatFolder.add(BSD.options.hihat, 'noteNumber')
        .min(0)
        .max(127)
        .step(1)
        .onChange(saveOptions);
      hookupChannel(hatFolder, BSD.options.hihat);
      hookupVolume(hatFolder, BSD.options.hihat);
      hookupPanControl(hatFolder, BSD.options.hihat);
      hookupPatchControl(hatFolder, BSD.options.hihat);

    }





    var btnStart = DOM.from('.btn-start');
    btnStart.on('click', function() {
      campfire.publish('gather-inputs-and-do-it');
    });
    btnStart.on('touchend', function() {
      BSD.handleFirstClick();
    });


    var activeStringsInput = DOM.from('.active-strings');
    activeStringsInput.on('blur', function() {
      campfire.publish('gather-inputs-and-do-it');
    });

    campfire.on('stop-it', function() {
      clearTimeout(BSD.timeout);
    });

    campfire.on('gather-inputs-and-do-it', function() {
      if (progInput.val().length === 0) {
        campfire.publish('stop-it');
        return false;
      }

      setupMIDIEnabledVoicePatches();

      BSD.options.progression = progInput.val(); //just the text
      storage.setItem('options', JSON.stringify(BSD.options));


      var prog = parseProgression(progInput.val());
      ///////campfire.publish('do-it-prog',prog);



      campfire.publish('do-it', prog);
    });


    var headerHeight = document
      .querySelector('header')
      .getBoundingClientRect()
      .height
      
    var delayMS = {

    };



    function distScore(a, b) {
      var min, max, diff, dist;

      if (typeof a != "number" || typeof b != "number") {
        return 15;
      }
      /***
      if (a !== 0 && !a) { min = b; max = b; diff = 0; }
      if (b !== 0 && !b) { min = a; max = a; diff = 0; }
      if (a !== 0 && b !== 0 && !a && !b) { return 0; }
      ***/
      min = Math.min(a, b);
      max = Math.max(a, b);
      diff = max - min;
      dist = Math.min(diff, 12 - diff);
      dist = Math.abs(dist);
      return dist;
    }



    function outsideJudge(o, env) {
      var hit6 = env.majorSixthAV == o.chromaticValue;
      var hit9 = env.ninthAV == o.chromaticValue;
      var hit6or9 = hit6 || hit9;

      var hit11 = env.eleventhAV == o.chromaticValue;
      var hitSharp11 = env.sharpEleventhAV == o.chromaticValue;


      if (BSD.options.fretRange && o.fret > BSD.options.fretRange[1]) {
        return 'fret > maxFret';
      }
      if (BSD.options.fretRange && o.fret < BSD.options.fretRange[0]) {
        return 'fret < minFret';
      }

      if (BSD.options.improv.insideChord && abstractNoteValues.indexOf(o.chromaticValue) < 0) {
        return 'must be inside chord, yet outside chord';
      }



      /** THIS IS OK, NEVERMIND
      if (hit6 && meta.hasMinor7Quality) {
        ///console.log('NOPE!!!!',env);
        return 'minor7 with 6th clashes (7b with 6)';
      }
      ***/

      if (hit6 && meta.isStrongBeat) {
        return '6th on strong beat';
      }

      if (env.hasMinor3rd && hit11) {
        return "OK";
      }



      /** not always fond of this..
      if (env.hasMajor7thQuality && hitSharp11) {
        return "OK";
      }
      ***/

      /* sometimes this is ok, but going back to keeping chord tones strictly on strong beat 12/9
      if (hit6or9 && meta.hasPerfectFifth) {
        //if (hit6) { alert('hit6'); }
        //if (hit6) { console.log('hit6',meta); }
        //console.log('hit6or9 meta',env);
        return 'OK';
      }
      ****/



      //FIXME: need UI toggle to determine which combo of outside tonalityScale and outside chord will disqualify a candidate
      //otherwise, outside chord will always further whittle down and reduce the candidates to a set smaller than the tonalityScale, making tonalityScale useless as a filter.


      if (meta.isStrongBeat && abstractNoteValues.indexOf(o.chromaticValue) < 0) {
        return 'strong beat and outside chord';
      }


      if (meta.tonalityScaleAbstractValues && meta.tonalityScaleAbstractValues.indexOf(o.chromaticValue) < 0) {
        return 'outside of tonalityScale';
      }


      if (o.fret > 13) {
        return 'too high';
      }
      if (BSD.activeStrings && !BSD.activeStrings.find(function(as) {
          ///console.log('as',as,'o.string',o.string);
          return as == o.string;
        })) {
        return "not active string: " + o.string;
      }


      return 'OK';
    }



    var avgFret,
      avgString,
      drift3,
      drift2,
      candidates,
      abstractNoteValues,
      result,
      idealFret,
      lastResult,
      lastAbstractValue,
      lastValue,
      lastString,
      lastStrings,
      lastFret,
      lastFrets,
      lastFretDiff,
      lastFretDiffs,
      lastDiff,
      lastNote,
      meta;





    function tick(cursor) {
      if (!cursor) {
        return false;
      }
      delayMS.even4 = BSD.tempoToMillis(BSD.options.tempo);
      delayMS.even1 = delayMS.even4 * BSD.beatsPerMeasure; //whole notes
      delayMS.even2 = delayMS.even4 * 2; //half notes
      delayMS.even8 = delayMS.even4 / 2; //eighth notes
      delayMS.even16 = delayMS.even4 / 4; //eighth notes
      delayMS.swung81 = delayMS.even4 * 2 / 3;
      delayMS.swung82 = delayMS.even4 * 1 / 3;
      ///var midSwung81 = (swung81;////////+even8DelayMS) / 2;/////].sum() /2;
      delayMS.midSwung81 = delayMS.swung81;
      //var midSwung81 = (swung81+even8DelayMS) / 2;/////].sum() /2;
      delayMS.midSwung82 = delayMS.swung82;
      campfire.publish('tick', cursor); //that a tick happened, 

      clearTimeout(BSD.timeout);
      delayMS.next = delayMS['even' + BSD.noteResolution];
      if (!delayMS.next) {
        console.log('invalid delayMS.next for resolution' + BSD.noteResolution);
      }
      cursor = cursor.next;
      BSD.timeout = setTimeout(function() {
        tick(cursor);
      }, delayMS.next);
    }






    BSD.noteResolution = 4;

    var direction = (Math.random() > 0.5) ? 'up' : 'down'; //initial direction.
    var nextDirection = {
      'up': 'down',
      'down': 'up'
    };



    ////var bunches = chords.map(function(o){ return o.abstractNoteValues(); });
    var rejections = [];
    var outsideRejections = [];

    var chordIdx = 0;

    var myNote = false;

    var songFormPosition = DOM.from('.song-form-position');
    var songCyclePosition = DOM.from('.song-cycle-position');

    let progTransport = ProgTransport();
    let transportVindow = Vindow({
      title: 'Transport',
      className: 'noprint'
    });
    transportVindow.append(progTransport.ui());
    transportVindow.renderOn(body);


    function initLast() {
      meta = {};
      avgFret = false;
      avgString = false;
      drift2 = false;
      drift3 = false;

      idealFret = 9; //starter...will get overriden
      abstractNoteValues = [];
      candidates = [];
      lastAbstractValue = false;
      lastValue = false; //60
      lastDiff = false;
      lastString = false; /////2; //5
      lastStrings = []; ///[5];
      lastFret = false; ////BSD.idealFret || 7;//3;
      lastFrets = []; ////////[3];
      lastFretDiff = 0;
      lastFretDiffs = [];
      lastNote = Note(60);
      result = false;
      lastResult = false;
      BSD.sequence = [];

      meta.maxNoteValue = BSD.guitarData.find(function(o) {
        var result = o.string == 1 && o.fret == BSD.options.fretRange[1];
        return result;
      }).noteValue;

      meta.minNoteValue = BSD.guitarData.find(function(o) {
        var result = o.string == 6 && o.fret == BSD.options.fretRange[0];
        return result;
      }).noteValue;


    }





    function judge(o, env) {
      var diff = lastValue ? o.noteValue - lastValue : 0;
      //if (Math.abs(diff) > 6) { return 'diff>6:' + diff; }
      //if (Math.abs(diff) > 5) { return 'diff>5:' + diff; }
      if (Math.abs(diff) > env.maxDiff) {
        return 'diff > ' + env.maxDiff + ': ' + diff;
      }
      var idealFretDiff = Math.abs(o.fret - idealFret);
      if (idealFretDiff > 9) {
        return 'idealFretDiff>9';
      }
      if (env.chordNoteIdx > 0 && diff > 0 && direction == 'down') {
        return 'wrong dir, direction=' + direction + ', diff=' + diff;
      }
      if (env.chordNoteIdx > 0 && diff < 0 && direction == 'up') {
        return 'wrong dir, direction=' + direction + ', diff=' + diff;
      }
      if (lastValue && diff == 0) {
        return 'no diff';
      }
      var fretDiff = lastFret ? o.fret - lastFret : 0;
      //FIXME: can probably simplify this once my goals are better understood
      if (drift3 && Math.abs(drift3 + fretDiff) > 4) {
        return 'drift3: drifting too much in one direction, drift3: ' + drift3 + ' fretDiff: ' + fretDiff;
      }
      if (drift2 && Math.abs(drift2 + fretDiff) > 4) {
        return 'drift2: drifting too much in one direction, drift2: ' + drift2 + ' fretDiff: ' + fretDiff;
      }
      if (lastFretDiff && Math.abs(lastFretDiff + fretDiff) > 4) {
        return 'lastFretDiff: drifting too much in one direction, lastFretDiff: ' + lastFretDiff + ' fretDiff: ' + fretDiff;
      }
      var fretDistance = Math.abs(fretDiff);
      if (fretDistance > env.maxFretDistance) {
        return 'fretDistance > ' + env.maxFretDistance;
      }
      ///if (fretDistance > 3) { return 'fretDistance > 3'; }
      if (lastFretDiff && Math.abs(lastFretDiff + fretDiff) > 4) {
        return 'lastFretDiff+fretDiff >4';
      } ///if they don't cancel each other out and their total is too big

      var stringDiff = lastString ? Math.abs(o.string - lastString) : 0;
      if (stringDiff > 2) {
        return 'stringDiff>2';
      }

      //now for the avg
      var avgFretDistance = avgFret ? Math.abs(o.fret - avgFret) : 0;
      var avgStringDiff = avgString ? Math.abs(o.string - avgString) : 0;
      if (avgFretDistance > 4) {
        return 'avgFretDistance>4';
      }
      ///if (avgStringDiff > 2) { return 'avgStringDiff>2'; }

      return 'OK';
    }

    function criteria(o, env) {
      var outsideDecision = outsideJudge(o, env);
      if (outsideDecision !== 'OK') {
        outsideRejections.push({
          candidate: o,
          decision: outsideDecision,
          lastResult: lastResult
        });
        return outsideDecision;
      }
      //console.log('decision',decision);
      var judgeDecision = judge(o, env);

      if (judgeDecision != 'OK') { //chordNoteIdx == 0 && 
        rejections.push({
          candidate: o,
          decision: judgeDecision,
          lastResult: lastResult
        });
      }
      return judgeDecision;
    };

    var guru = BSD.Widgets.TonalityGuru({});

    var svgWrap = DOM.from('.svg-wrap');

    var venue = DOM.from('.venue');

    campfire.on('do-it', function(prog) {
      BSD.pause = false;
      initLast();


      BSD.boards.forEach(function(board) {
        board.close();
      });
      BSD.boards = [];

      clearTimeout(BSD.timeout);
      var pa = '#FF0000-#E6DF52-#FFDD17-#4699D4-#4699D4-#000000-#000000-#000000-#bbbbbb-#67AFAD-#8C64AB-#8C64AB'.split(/-/);


      var palette = pa.map(function(o) {
        return BSD.colorFromHex(o);
      });
      ///palette = BSD.randomPalette2(12,200);
      palette.forEach(function(color, i) {
        ///var color = palette.shift();
        colorHash[i] = color;
      });


      //link up the prog
      var last = false;
      prog.forEach(function(o) {
        if (last) {
          last.next = o;
        }
        last = o;
      });
      last.next = prog[0];


      prog.forEach(function(o) {
        let cursor = o;
        let tries = 9;
        while (tries > 0 && cursor.chord.abstractlyEqualTo(cursor.next.chord)) {
          cursor = cursor.next;
          tries -= 1;
        }
        o.nextChordChange = cursor.next.chord;
      });

      console.log('PROG W CHANGES?', prog);



      prog.forEach(function(o) {
        var advice = guru.analyze(o);
        console.log('advice', advice);
        /////result.tonalityScale = advice.tonalityScale;
        o.scaleAdvice = advice;
      });



      var venueColumn = false;


      var stage = DOM.div().addClass('stage extra noprint');

      venue.empty();

      venue.append(stage);
      // extraBoard = makeFretboardOn(stage, {
      //   colorHash,
      //   activeStrings: '654321'.split('')
      // });


      DOM.from('.stringset-name').html(BSD.options.stringSet);

      var activeStrings = BSD.options.stringSet.split('');
      BSD.activeStrings = activeStrings; //FIXME, this won't work in the long run
      prog.forEach(function(progItem, progItemIdx) {

        let cursor = progItem;
        var chord = progItem.chord;
        if (progItemIdx % 8 == 0) {
          venueColumn = DOM.div()
            .addClass('column venue-column flex-column')
          venue.append(venueColumn);
        }
        var tableStage = DOM.div()
          .addClass('stage table-stage hidden noprint stringset-' + BSD.options.stringSet);
        venueColumn.append(tableStage);
        // var board = makeFretboardOn(tableStage, {
        //   chord,
        //   colorHash,
        //   activeStrings: activeStrings
        // });
        //BSD.boards.push(board);

        var thisFred = SVGFretboard()
        .on('wake-up', () => console.log('WOKE!!'))
        .relay('fret-hover', campfire);

        var svgStage = DOM.div().addClass("stage svg-stage margin4 flex-row");
        venueColumn.append(svgStage);

        svgStage.append([
          DOM.div()
            .addClass('chord-name pad4 one-tenth-width')
            .append(DOM.span(chord.fullAbbrev())),
          thisFred.ui()
        ]);
        thisFred.bootup();
        thisFred.plotChordChange({
          cursor,
          fretRange: BSD.options.fretRange,
          strings: BSD.options.stringSet.split('').map(o => +o)
        });

      });


      campfire.publish('fret-range-updated', BSD.options.fretRange); //this affects boards..



      var errors = 0;
      var cycleRange = [];
      for (var i = 0; i < BSD.options.progCycles; i += 1) {
        cycleRange.push(i);
      }






      cycleRange.forEach(function(cycleIdx) {
        prog.forEach(function(progItem, progItemIdx) {
          if (errors) {
            return false;
          }


          rejections = [];
          outsideRejections = [];
          ///var barIdx = Math.floor(i / BSD.noteResolution);
          var barIdx = progItem.barIndex;
          //var chordIdx = barIdx % chords.length;
          var chordIdx = progItemIdx;
          var barChordIdx = progItem.barChordIndex;
          //var myChord = chords[chordIdx];
          var myChord = progItem.chord;
          ///var cycleIdx = Math.floor(barIdx / prog.length);
          //var cycleIdx = Math.floor(barIdx / chords.length);
          ///cycleIdx = Math.floor(cycleIdx / chords.length);
          ////console.log('barIdx',barIdx,'chordIdx',chordIdx,'cycleIdx',cycleIdx);

          if (!myChord) {
            errors += 1;
            return false;
          }
          abstractNoteValues = myChord.abstractNoteValues();

          meta.defaults = {
            maxDiff: 3, //max chromatic distance between notes....
            maxFretDistance: 3,
          };



          meta.rootAbstractValue = myChord.rootNote.abstractValue();
          meta.majorSixthAV = (meta.rootAbstractValue + 9) % 12;
          meta.ninthAV = (meta.rootAbstractValue + 2) % 12;
          meta.eleventhAV = (meta.rootAbstractValue + 5) % 12;
          meta.sharpEleventhAV = (meta.rootAbstractValue + 6) % 12;


          meta.hasPerfectFifth = myChord.hasPerfectFifthInterval(); ///move this to o itself?
          meta.hasMinor3rd = myChord.hasMinorThirdInterval();
          meta.hasMajor3rd = myChord.hasMajorThirdInterval();
          meta.hasDominant7th = myChord.hasDominantSeventhInterval();
          meta.hasMajor7thQuality = myChord.hasMajorSeventhQuality();
          meta.hasMinor7thQuality = myChord.hasMinorSeventhQuality();
          meta.maxFretDistance = meta.defaults.maxFretDistance;
          meta.maxDiff = meta.defaults.maxDiff;
          meta.isStrongBeat = true;
          if (progItem.scaleAdvice && progItem.scaleAdvice.advice) {
            meta.tonalityScale = makeScale(progItem.scaleAdvice.advice);
            meta.tonalityScaleAbstractValues = meta.tonalityScale.abstractNoteValues();
          }


          var totQuarterNoteBeats = BSD.beatsPerMeasure; //for this chord.
          if (progItem.halfBar) {
            if (BSD.beatsPerMeasure == 3) {
              if (barChordIdx == 0) {
                totQuarterNoteBeats = 2;
              } else {
                totQuarterNoteBeats = 1;
              }
            } else {
              totQuarterNoteBeats = 2;
            }
          }

          var totNoteEvents = Math.ceil(totQuarterNoteBeats * BSD.beatsPerMeasure / BSD.noteResolution);
          var eventRange = [];
          for (var i = 0; i < totNoteEvents; i += 1) {
            eventRange.push(i);
          }

          eventRange.forEach(function(o, chordNoteIdx) {
            if (errors) {
              return false;
            }

            meta.chordNoteIdx = chordNoteIdx;


            meta.isStrongBeat = chordNoteIdx % 2 === 0;


            if (Math.random() > 0.85) {
              ///console.log('random flip!');
              direction = nextDirection[direction];
            }
            if (lastValue <= 44) { //low E
              direction = 'up';
            }

            candidates = BSD.guitarData;


            var scale = 10; //12; //rightmost fret to idealize.
            var tot = 256; //range.length;
            var progress = i; //step
            var loopsPerTotal = 1;


            if (BSD.idealFret) {
              idealFret = BSD.idealFret;
            } else {
              //TODO: really undestand scaling trig unit radius circle and scaling better.
              /**
              idealFret = Math.round(scale * (Math.cos ((2 * Math.PI) / tot * progress * loopsPerTotal ) + 1) / 2);
              **/
              var start = 7; //gets blown away..
              if (BSD.options.fretRange) {
                start = Math.floor(BSD.options.fretRange.average());
              }


              var width = BSD.options.fretRange[1] - BSD.options.fretRange[0];
              var total = BSD.options.progCycles;
              var centerShift = 0;
              var offset = start;
              idealFret = offset + (Math.cos(cycleIdx / total * 2 * Math.PI) * (width / 2) + centerShift);


            }


            ///console.log('i/idealFret',i,idealFret);

            if (lastFrets.length > 0) {
              avgFret = Math.round(lastFrets.sum() / lastFrets.length);
            }


            if (lastStrings.length > 0) {
              avgString = Math.round(lastStrings.sum() / lastStrings.length);
            }

            if (lastFretDiffs.length > 0) {
              drift3 = lastFretDiffs.slice(-3).sum(); //sum the latest 3
            }

            if (lastFretDiffs.length > 0) {
              drift2 = lastFretDiffs.slice(-2).sum(); //sum the latest 3
            }

            rejections = [];
            outsideRejections = [];
            candidates = candidates.select(function(o) {
              return criteria(o, meta) == 'OK';
            });


            var solutions = [
              function() {
                meta.maxDiff += 1;
                console.log("increased meta.maxDiff to " + meta.maxDiff);
              },
              function() {
                meta.maxFretDistance += 1;
                console.log("increased meta.maxFretDistance to " + meta.maxFretDistance);
              },
              function() {
                direction = nextDirection[direction];
                console.log("changed direction to " + direction);
              },
              //function() { idealFret -= 1; console.log('changed idealFret to '  + idealFret) }
            ];

            var retries = 0;
            while (retries < 110 && candidates.length == 0) {
              console.log('pre-proto uh oh retry#', retries);

              var last;
              if (BSD.sequence.length > 0) {
                last = BSD.sequence[BSD.sequence.length - 1];
                //console.log('last barIdx',last.barIdx,'cycleIdx',last.cycleIdx,'last',last);
              }

              var solution = solutions.atRandom();

              solution();

              ///console.log('flip! (necessity)');
              rejections = [];
              outsideRejections = [];
              candidates = BSD.guitarData.select(function(o) {
                return criteria(o, meta) == 'OK';
              });
              retries += 1;
            }




            if (candidates.length == 0) {
              errors += 1;
              return false;
            }



            meta.maxFretDistance = meta.defaults.maxFretDistance;
            meta.maxDiff = meta.defaults.maxDiff


            if (chordNoteIdx == 0) { //first note in new chord change... try to get nearest pitch to last note played.


              var sorted = candidates.sort(BSD.sorter(function(o) {
                return distScore(o.chromaticValue, lastAbstractValue);
              }));

              console.log('remaining choices', sorted.map(function(o) {
                return Note(o.chromaticValue).name();
              }).join(','));


              var sortedScores = sorted.map(function(o) {
                return [Note(o.chromaticValue).name(), distScore(o.chromaticValue, lastAbstractValue)];
              });
              console.log('sorted Scores', sortedScores);

              result = sorted[0];
              console.log('*FN* i', i,
                myChord.fullAbbrev(),
                'chose', Note(result.noteValue).name(),
                'lastNote', lastNote.name(),
                'distScore()', distScore(result.chromaticValue, lastAbstractValue),
                'result.chromaticValue', result.chromaticValue,
                'lastAbstractValue', lastAbstractValue
              );
            } else {
              result = candidates.atRandom();
              console.log('i', i,
                myChord.fullAbbrev(),
                'chose', Note(result.noteValue).name(),
                'lastNote', lastNote.name(),
                'distScore()', distScore(result.chromaticValue, lastAbstractValue),
                'result.chromaticValue', result.chromaticValue,
                'lastAbstractValue', lastAbstractValue
              );
            }

            result = JSON.parse(JSON.stringify(result));
            result.barIdx = barIdx;
            result.totQuarterNoteBeats = totQuarterNoteBeats;
            result.totNoteEvents = totNoteEvents;

            result.direction = direction;
            result.chordIdx = chordIdx;
            result.board = BSD.boards[chordIdx];
            result.chord = myChord;
            result.chordNoteIdx = chordNoteIdx;
            result.cycleIdx = cycleIdx;

            result.idealFret = idealFret;
            result.avgFret = avgFret;
            ///result.idx = i;
            result.nextChordChange = progItem.nextChordChange;
            result.progItem = progItem;


            console.log('result', result);


            if (!result) {
              errors += 1;
            }

            BSD.sequence.push(result);

            lastResult = result;
            ///sequence[i] = result;
            lastDiff = lastValue ? result.noteValue - lastValue : 0;
            console.log('lastDiff', lastDiff);
            lastValue = result.noteValue;
            lastNote = Note(lastValue);
            lastAbstractValue = lastNote.abstractValue();
            lastString = result.string;

            lastFretDiff = lastFret ? result.fret - lastFret : 0;
            lastFretDiffs.push(lastFretDiff);


            lastFret = result.fret;


            if (lastFrets.length > 4) {
              lastFrets.shift();
            } //having a average of 5 was too limiting in candidates.
            lastFrets.push(lastFret);

            if (lastStrings.length > 3) {
              lastStrings.shift();
            } //having a average of 5 was too limiting in candidates.
            lastStrings.push(lastString);

          }); //eventRange

        }); //prog

      }); //BSD.options.progCycles
      ///console.log('sequence',sequence);


      if (errors) {
        alert('Oops, I had an error. Try a few more times (5x max) before you give up on me.');
        return false;
      }

      BSD.sequence.forEach(function(o, idx) {
        o.idx = idx;
        var ndx = idx + 1;
        ndx = ndx % BSD.sequence.length;
        o.next = BSD.sequence[ndx];
      });
      //console.log('sequence',sequence);
      ///BSD.sequence = sequence;
      //////sequence.forEach(function(o){})
      BSD.timeout = false;


      campfire.publish('reset-song-form-ui')

      //initial tick
      tick(BSD.sequence[0]);
    });


    progTransport.on('tick',tick);

    campfire.on('reset-song-form-ui', function() {
      BSD.totalBars = BSD.sequence[BSD.sequence.length - 1].barIdx + 1;
      progTransport.reset({ totalBars: BSD.totalBars })
    });


    campfire.on('play-chord', function(o) {
      DOM.from('.extra .chord-name').html(o.chord.fullAbbrev());
    });


    BSD.firstClick = true;
    BSD.handleFirstClick = function() {
      if (!BSD.firstClick) {
        return false;
      }
      BSD.firstClick = false;
      var buffer = context.createBuffer(1, 1, 22050);
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      if (source.play) {
        source.play(0);
      } else if (source.noteOn) {
        source.noteOn(0);
      }
    };



    function periodicA(current, total, shift, scale, func) {
      return (func(Math.PI * 2 * current / total) + shift) * scale;
    }


    function periodicB(current, total, shift, scale, func) {
      return (func(Math.PI * 2 * current / total) * scale) + shift;
    }

    var shiftThenScale = periodicA;
    var scaleThenShift = periodicB;




    campfire.on('test-periodic', function(o) {
      for (var i = 0; i < o.total; i += 1) {
        var resA = periodicA(i, o.total, o.shift, o.scale, Math.cos);
        console.log('A (cos) i', i, 'result', resA);
      }
      for (var i = 0; i < o.total; i += 1) {
        var resA = periodicA(i, o.total, o.shift, o.scale, Math.sin);
        console.log('A (sin) i', i, 'result', resA);
      }

      for (var i = 0; i < o.total; i += 1) {
        var resB = periodicB(i, o.total, o.shift, o.scale, Math.cos);
        console.log('B scale then shift (cos) i', i, 'result', resB);
      }

      for (var i = 0; i < o.total; i += 1) {
        var resB = periodicB(i, o.total, o.shift, o.scale, Math.sin);
        console.log('B scale then shift (sin) i', i, 'result', resB);
      }

    });

    campfire.on('song-form-position', function(event) {
      progTransport.updatePosition(event);
    });

    var saveBarIdx = false;
    BSD.currentBarIdx = false;
    campfire.on('tick', function(cursor) {
      if (cursor.barIdx != BSD.currentBarIdx || cursor.cycleIdx != BSD.currentCycleIdx) {
        saveBarIdx = cursor.barIdx;
        BSD.currentBarIdx = cursor.barIdx;
        BSD.currentCycleIdx = cursor.cycleIdx;
        campfire.publish('song-form-position', cursor);
      }
    });




    campfire.on('tick', function(cursor) {
      BSD.boards.forEach(function(board) {
        board.unfeatureFrets();
      });

      if (cursor.chordIdx > 0) {
        let x = 123;
      }

      fred.clearFretted();
      fred.plotChordChange({
        cursor,
        fretRange: BSD.options.fretRange,
        strings: BSD.options.stringSet.split('').map(o => +o)
      });

      if (BSD.options.improv.enabled) {
        fred.featureFret(cursor)
      }
      //fred.swapGroups();

    });

    //BASS
    campfire.on('tick', function(cursor) {
      if (!BSD.options.bass.enabled) {
        return false;
      }
      if (cursor.chordNoteIdx == 0) {
        var beatOneNote = [
            cursor.chord.rootNote,
            cursor.chord.myThird(),
            cursor.chord.mySeventh()
          ].filter(o => o)
          .atRandom();

        let pedal = beatOneNote.plus(-12);
        let pedalValue = pedal.value();

        if (router && router.outPort && BSD.options.bass.midi) {

          let noteOnChannel = MIDI_CONST.NOTE_ON + (BSD.options.bass.channel - 1);
          let noteOffChannel = MIDI_CONST.NOTE_OFF + (BSD.options.bass.channel - 1);

          let noteNum = pedalValue;
          let vel = BSD.options.bass.volume * BSD.volume; 
          vel = Math.floor(127 * vel);////[0..1] -> [0..127]

          router.outPort.send([noteOnChannel, noteNum, vel]);
          setTimeout(function() {
            router.outPort.send([noteOffChannel, noteNum, vel]);
          }, BSD.durations.bass);


        } else {
          bassist.playNote(
            pedal,
            BSD.durations.bass
          );
        }

      }
      if (cursor.totQuarterNoteBeats == 4 && BSD.noteResolution == 4 && cursor.chordNoteIdx == 2) { //3rd beat in [0,1,2,3]

        let pedal5 = cursor.chord.myFifth().plus(-12);
        let pedal5Value = pedal5.value();
        if (router && router.outPort && BSD.options.bass.midi) {

          let noteOnChannel = MIDI_CONST.NOTE_ON + (BSD.options.bass.channel - 1);
          let noteOffChannel = MIDI_CONST.NOTE_OFF + (BSD.options.bass.channel - 1);

          let noteNum = pedal5Value;
          let vel = BSD.options.bass.volume * BSD.volume; 
          vel = Math.floor(127 * vel);////[0..1] -> [0..127]

          router.outPort.send([noteOnChannel, noteNum, vel]);
          setTimeout(function() {
            router.outPort.send([noteOffChannel, noteNum, vel]);
          }, BSD.durations.bass);

        } else {
          bassist.playNote(pedal5, BSD.durations.bass);
        }
      }
    });


    //improv
    campfire.on('tick', function(cursor) {

      //FIXME: does this need midi/webAudio synth checks? 
      // do we fully trust that protection from play-note?
      if (BSD.options.improv.enabled) {
        campfire.publish('play-note', {
          note: Note(cursor.noteValue),
          duration: BSD.durations.note
        });
      }
    });

    //chord
    campfire.on('tick', function(cursor) {
      //var midSwung82 = (swung82+even8DelayMS) / 2;/////].sum() /2;
      var thisIdx = cursor.chordIdx;
      var node = cursor;


      for (var i = 0; i < 16 && node.chordIdx == thisIdx; i += 1) { //at most, make 16 attempts.
        node = node.next;
      }

      var nextChord = node.chord;

      //LAST QUARTER NOTE OF MEASURE
      if (BSD.noteResolution == 4 && cursor.chordNoteIdx + 1 == cursor.totQuarterNoteBeats) {
        setTimeout(function() {
          campfire.publish('play-chord', {
            chord: nextChord,
            duration: BSD.durations.chord
          });
        }, delayMS.swung81);
      }

      if (BSD.noteResolution == 2 && cursor.chordNoteIdx == 1) {
        setTimeout(function() {
          campfire.publish('play-chord', {
            chord: nextChord,
            duration: BSD.durations.chord
          });
        }, delayMS.even4DelayMS + swung81);
      }

      if (cursor.totQuarterNoteBeats == 4) {
        if (BSD.noteResolution == 1 && cursor.chordNoteIdx === 0) {
          setTimeout(function() {
            campfire.publish('play-chord', {
              chord: nextChord,
              duration: BSD.durations.chord
            });
          }, delayMS.even1 - delayMS.swung82);
        }
        if (BSD.noteResolution == 8 && cursor.chordNoteIdx == 6) {
          //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
          setTimeout(function() {
            campfire.publish('play-chord', {
              chord: nextChord,
              duration: BSD.durations.chord
            });
          }, delayMS.swung81);
        }

        if (BSD.noteResolution == 16 && cursor.chordNoteIdx == 12) {
          //queue up next chord just before its note will sound. 2/3 to give a swung "and of 4" feel.
          setTimeout(function() {
            campfire.publish('play-chord', {
              chord: nextChord,
              duration: BSD.durations.chord
            });
          }, delayMS.swung81);
        }
      }

    });

    campfire.on('tick', function(cursor) {
      //hihat
      if (!BSD.options.hihat.enabled) {
        return false;
      }
      if (BSD.noteResolution == 4 && cursor.chordNoteIdx == 1) {
        hihat();
      }
      if (BSD.noteResolution == 4 && cursor.chordNoteIdx + 1 == cursor.totQuarterNoteBeats) {
        hihat();
      }
    });

    campfire.on('opened-midi-out-port', function(port) {})


    campfire.on('reset-sequence-next', function() {

      var last = false;
      BSD.sequence.forEach(function(s) {
        if (last) {
          last.next = s;
        }
        last = s;
      });
      last.next = BSD.sequence[0];
    });

    campfire.on('tick', function(cursor) {
      BSD.barIdx = cursor.barIdx;
    });


    var btnLoopStart = DOM.from('.btn-loop-start');
    btnLoopStart.on('click', function() {

      if (BSD.loopEnd !== 0 && !BSD.loopEnd) {
        BSD.loopEnd = BSD.sequence.length - 1;
      }
      BSD.loopStart = BSD.barIdx;
      btnLoopStart.html('A: ' + (BSD.loopStart + 1));


      campfire.publish('reset-sequence-next');
      BSD.loop = BSD.sequence.select(function(o) {
        //FIXME: insisting on cycleIdx == 0 for now... is there a better way?      
        return o.cycleIdx == 0 && o.barIdx >= BSD.loopStart && o.barIdx <= BSD.loopEnd;
      });

      BSD.loop[BSD.loop.length - 1].next = BSD.loop[0];
      tick(BSD.loop[0]);
    });
    var btnLoopEnd = DOM.from('.btn-loop-end');
    btnLoopEnd.on('click', function() {
      if (BSD.loopStart !== 0 && !BSD.loopStart) {
        BSD.loopStart = 0;
      }
      BSD.loopEnd = BSD.barIdx;
      btnLoopEnd.html('B: ' + (BSD.loopEnd + 1));

      campfire.publish('reset-sequence-next');
      BSD.loop = BSD.sequence.select(function(o) {
        //FIXME: insisting on cycleIdx == 0 for now... is there a better way?
        return o.cycleIdx == 0 && o.barIdx >= BSD.loopStart && o.barIdx <= BSD.loopEnd;
      });

      BSD.loop[BSD.loop.length - 1].next = BSD.loop[0];
      tick(BSD.loop[0]);
    });



    BSD.options.hihat.volume = BSD.options.hihat.volume || 0.7;
   function createSyntheticHiHat() {
      var bufferSize = 4096;
      var brownNoise = (function() {
        var lastOut = 0.0;
        var node = context.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
          var output = e.outputBuffer.getChannelData(0);
          for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.32;
            lastOut = output[i];
            output[i] *= Math.PI; //3.5; // (roughly) compensate for gain
          }
        }
        return node;
      })();
      var gn = context.createGain();
      gn.gain.value = 0;
      gn.connect(mixer.common);
      brownNoise.connect(gn);
      return { 
        play: function() {
          gn.gain.setTargetAtTime(BSD.options.hihat.volume, context.currentTime, 0); //do it now...
          gn.gain.linearRampToValueAtTime(0, context.currentTime + 0.015);
        }
      };
    }
    var syntheticHiHat = createSyntheticHiHat();
    function hihat() {
      if (router && router.outPort && BSD.options.hihat.midi) {
        let noteOnChannel = MIDI_CONST.NOTE_ON + (BSD.options.hihat.channel - 1);
        let noteOffChannel = MIDI_CONST.NOTE_OFF + (BSD.options.hihat.channel - 1);
        let noteNum = BSD.options.hihat.noteNumber;
        let vel = BSD.options.hihat.volume * BSD.volume; 
        vel = Math.floor(127 * vel);////[0..1] -> [0..127]

        router.outPort.send([noteOnChannel, noteNum, vel]);
        return setTimeout(function() {
          router.outPort.send([noteOffChannel, noteNum, vel]);
        }, BSD.durations.hihat);
      }

      syntheticHiHat.play();
    }

    // midi functions

    var bank = {};

    let outMonitor;



    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    function getRandomRGBA() {
      var rgb = [192, 192, 192].map(max => getRandomInt(max) + 63);
      var a = Math.random() * (1 - 0.9) + 0.9;
      a = Math.round(a * 100) / 100;
      return [...rgb, a];
    }

    function getRandomColor() {
      var vRGBA = getRandomRGBA();
      var result = `rgba(${vRGBA.join(',')})`;
      ///console.log(result);
      return result;
    }

    var fred;

    campfire.on('guitar-data-loaded', function() {
      fred = SVGFretboard()
        .on('wake-up', () => console.log('WOKE!!'))
        .relay('fret-hover',campfire);

      svgWrap.append(
        fred.ui()
      );
      fred.bootup();
    });

    DOM.from('.color-palette-wrap').append(
      ColorPalette('woo')
      .on('color-chosen', color => {
        BSD.chosenColor = color;
        console.log('chosen!!', color);
      })
      .relay('color-chosen',campfire)
      .redraw()
      .ui()
    );


    //
    let chords = ['D-7', 'G7', 'Cmajor7'];
    let wheely = spinner(chords, chordName => {
        fred.clearFretted();
        getFrets({
          chord: chordName,
          strings: BSD.options.stringSet.split('').map(o => +o),
          fretRange: BSD.options.fretRange,
        }).forEach(fret => fred.plotFret(fret, BSD.options.defaultSVGCircleAttrs))
      },
      5500);

    var fretPlotterInput = DOM.from('.fret-plotter-input');
    var btnClear = DOM.from('.btn-clear');

    DOM.from('.btn-chord').on('click', function() {
      var str = fretPlotterInput.val();
      let chordNames = str.split(/\ +|\+|,/g)
        .filter(o => o)
        .map(o => o.trim());
      chordNames.forEach((name, i) => {
        var chord = makeChord(name);
        fred.plotHelper(
          {
            svgAlpha: BSD.svgAlpha,
            chordOrScale: chord,
            stringSet: BSD.options.stringSet,
            fretRange: BSD.options.fretRange
          }
        );
      })
    });
    DOM.from('.btn-scale').on('click', function() {
      var scale = makeScale(fretPlotterInput.val());
      fred.plotHelper({
        chordOrScale: scale,
        svgAlpha: BSD.svgAlpha,
        stringSet: BSD.options.stringSet,
        fretRange: BSD.options.fretRange
      });
    });
    btnClear.on('click', () => {
      fred.clearFretted();
      //fretPlotterInput.val(null);
    });

    BSD.svgAlpha = 0.7
    let svgAlphaInput = DOM.from('.svg-alpha');
    svgAlphaInput.on('change', e => {
      BSD.svgAlpha = +e.target.value;
    });

    var btnColor = DOM.from('.btn-color');
    btnColor.on('click', () => {
      let rc = lightbox('Choose Color', function(wrap) {
        BSD.chosenColors = []
        btnColor.find('span')
          .remove();
        wrap.append(
          ColorPalette()
          .on('color-chosen', color => {
            BSD.chosenColor = color;
            BSD.chosenColors.push(color);
            console.log('chosen!!', color);
            console.log('all chosen', BSD.chosenColors);
            btnColor.append(
              DOM.span('&nbsp;&nbsp;')
              .css('background-color', '#' + color.toHex())
            )
            //rc.hide();
          })
          .redraw()
          .ui()
        )
      })
    });




    let events = [];
    window.events = events;
    let freak = FreakySeq({
      events
    });
    window.freak = freak;
    freak.on('note-on', function(event) {
      campfire.publish('play-note', {
        note: Note(event.noteNumber),
        duration: BSD.durations.note
      });
    });


    campfire.on('tempo-change', freak.tempoChange)
    freak.tempoChange(BSD.options.tempo);



    let pianoRoll = PianoRoll({
      ...freak.opts,
      events: events
    })
    pianoRoll.relay('tempo-change', campfire);

    let midiOutMonitor = MIDIOutMonitor({
      port: router.outPort
    });
    DOM.from('.monitor-wrap').append(midiOutMonitor.ui())


    pianoRoll.on('note-hover', function(noteNumber) {
      BSD.currentNote = Note(noteNumber);
    });
    pianoRoll.on('note-preview', function(noteNumber) {
      campfire.publish('play-note', {
        note: Note(noteNumber),
        duration: BSD.durations.note
      });


    });
    pianoRoll.on('is-playing', function(isPlaying) {
      //isPlaying shows the new going-forward wish
      isPlaying ? freak.play() : freak.stop();
    });




    let w = Vindow({
      title: "Piano Roll",
      className: 'noprint'
    });
    let [toolbar, pane] = pianoRoll.ui();
    w.appendToToolbar(toolbar);
    w.append(pane);
    w.renderOn(DOM.from('.piano-roll-wrap'));



    let datWrap = DOM.from('.dg.ac');
    datWrap.addClass('noprint')
      //fix some hard-wired inline styles
      .css({
        position: 'absolute',
        float: 'inherit',
        right: 'inherit'
      })

    Draggable(datWrap.raw);

    
    let TAU = Math.PI * 2;
    let biggerIsSlower = 500000 // 1_000_000
    let magicHueRadians = (Date.now() / biggerIsSlower) % TAU;
    document.querySelectorAll('.vindow .header').forEach(elem => {
      setBackgroundHue(elem, magicHueRadians)
    });


    function myAutoArrange() {
      var br = document.body.getBoundingClientRect();
      var origin = Point(0,50); //x ignored for now.
      var corner = Point(br.right,0);//y ignored for now.
      autoArrange(allVindows, origin, corner);
    }

    var btnAutoArrange = DOM.from('.btn-auto-arrange');
    btnAutoArrange.on('click',myAutoArrange);
    //myAutoArrange();




    let midiInfo = MIDIInfo({
      router,
      channel: BSD.options.improv.channel,
      patch: BSD.options.improv.patch
    });
    var vMIDIInfo = Vindow({
      title: 'MIDI Info',
      className: 'noprint'
    });
    let [miToolbar, miPane] = midiInfo.ui();
    vMIDIInfo.appendToToolbar(miToolbar),
      vMIDIInfo.append(miPane);
    vMIDIInfo.renderOn(body);
  </script>

<?php
});

get_footer();
