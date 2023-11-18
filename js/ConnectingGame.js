import Vindow from "./Vindow.js";
import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import Note from "./js-music-theory.js";
import { ascending, tempoToMillis, fretDistance } from "./Utils.js";
import SVGFretboard from "./SVGFretboard.js";
import { remap } from "./Lerpy.js";
import {parseProgression} from "./Progression.js";
import { StringSetChooser } from "./StringSetChooser.js";

//REFACTOR THIS
const vscale = (v,factor) => v.map(n => n * factor)
const vadd = (a,b) => a.map((asubi,i) => asubi + b[i]) // a-> + b-> 
const vdiff = (a,b) => vadd(a,vscale(b,-1));
const vlerp = (a,b,factor) => vadd(a,vscale(vdiff(b,a),factor))


const UP = 1
const DOWN = -1
const NOT_FOUND = null;

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

const hues = [0,30,60,90,120,150];

async function loadGuitarData() {
    async function inner() {
      var resp = await fetch(BSD.baseURL + '/data/guitar.json');
      var json = await resp.json();
      return json;
    }
    return await inner();
}

var guitarData = await loadGuitarData();

function ConnectingGame({noteBounds, direction = UP }) {    


    let [low,high] = noteBounds;
    let noteRange = range(high - low + 1, low); //upper deck

    let currentDirection = direction;

    //abstract/chromatic 12-tones on or off. C..B 0..11
    let enabled = [0,0,0,0,0,0,0,0,0,0,0,0];

    //next note Range index in direction that is enabled
    function advance(currentNoteNumber, dir = UP) {
        for (var nn = currentNoteNumber; nn <= high && nn >= low; nn += dir) {
            if (nn !== currentNoteNumber && enabled[nn % 12]) { 
                return nn;
            }
        }
        return NOT_FOUND;
    }

    function nextValidNoteNumber(currentNoteNumber) {
        if (currentNoteNumber > high) { return "nvnn: OOB"}
        if (currentNoteNumber < low) { return "nvnn: OOB"}
        let candidate = advance(currentNoteNumber, currentDirection);
        if (candidate == NOT_FOUND) {
            currentDirection *= -1; //switch directions
            candidate = advance(currentNoteNumber, currentDirection);        
        }
        return candidate;
    }

    function tick(currentNoteNumber) {
        //if (!currentNoteNumber) { return "tick: OOB"; }
        if (currentNoteNumber < low || currentNoteNumber > high) { return "OOB"; }
        return nextValidNoteNumber(currentNoteNumber);
    }

    function enableNoteValues(arrayOfNoteValues, clearExisting = true) {
        if (clearExisting) {
            clearEnabled();
        }
        arrayOfNoteValues.forEach(nv => { enabled[nv % 12] = 1; })
        return enabled;
    }

    function clearEnabled() {
        enabled = enabled.map(n => 0);
    }

    function updateNoteBounds(newBounds) {
        [low,high] = newBounds;
        noteRange = range(high - low + 1, low); //upper deck
    }

    function test() {
        let g = new ConnectingGame({
            noteBounds: [60,71],
            direction: DOWN,
        });    
        g.enableNoteValues([60,64,67,70])
        let nn = 60;
        ///nn = g.tick(nn);
        console.log('now playing',nn = g.tick(nn));
        console.log('now playing',nn = g.tick(nn));
        console.log('now playing',nn = g.tick(nn));
        console.log('now playing',nn = g.tick(nn));
        console.log('update...', g.enableNoteValues([60,63,67,70]))
        console.log('now playing',nn = g.tick(nn));
        console.log('now playing',nn = g.tick(nn));
        console.log('now playing',nn = g.tick(nn));
        console.log('now playing',nn = g.tick(nn));

    }

    return {
        currentDirection,
        enabled,
        enableNoteValues,
        test,
        tick,
        updateNoteBounds
    }
}


function LabeledTextInput(props) {
    var self = PubSub();
    var label = DOM.label()
        .text(props.label);
    var input = DOM.input()
        .attr('type',props.type)
        .val(props.value || 4)
        .on('change',(e) => self.emit('change',e.target.value))
    var wrap = DOM.div()
        .addClass('flex-row align-items-center space-between')
        .append([label,input])
    self.ui = () => wrap;
    return self;
}


export function ConnectingGameVindow(props) {

    
    let loops = 1;
    //let ticksPerChord = 4;
    let ticksPerBar = 4;
    let tempo = 60;
    let fromFret = 1;
    let toFret = 5;


    var cgHandle;

    var g = props.game;

    var tick = -1;
    var chordIdx = -1;
    var progIdx = -1;

    let stringSet = new Set([6,5,4,3,2,1]);

    function stopSeq() {
        clearInterval(cgHandle);
        playing = false;
    }

    function startSeq() {

        var hueDeg = 0;

        ///return alert('START SEQ')
        ///var noteValue;
        if (!props.chords) { return alert('chords!')}
        playing = true;
        var noteValue = props.chords[0].rootNote.value();

        let fretsWithinFromTo = guitarData            
            .filter(fret => fret.fret >= fromFret)
            .filter(fret => fret.fret <= toFret)
            .filter(fret => stringSet.has(fret.string));
        let noteValuesWithinFrets = fretsWithinFromTo
            .map(fret => fret.noteValue)
        let low = Math.min(...noteValuesWithinFrets)
        let high = Math.max(...noteValuesWithinFrets)
        let noteBounds = [low, high];
        while (noteValue < low) { noteValue += 12; }
        while (noteValue > high) { noteValue -= 12; }
        ///tick = -1;
        let saveFrets = [0,0,0,0];
        let saveStrings = [0,0,0,0];        
        var ticksPerChord = props.prog[0].halfBar ? (ticksPerBar / 2) : ticksPerBar;

        const doATick = () => {
            cgHandle = setTimeout(doATick,tempoToMillis(tempo));

            var fretAvg = saveFrets.reduce((accum,n) => { return accum + n; },0) / saveFrets.length;
            var stringAvg = saveStrings.reduce((accum,n) => { return accum + n; },0) / saveStrings.length;

            var virtAvgFret = { fret: fretAvg, string: stringAvg };


            fretsWithinFromTo = guitarData
                .filter(fret => fret.fret >= fromFret)
                .filter(fret => fret.fret <= toFret)
                .filter(fret => stringSet.has(fret.string));
            
            if (props.chords.length == 0) {return false; }
            tick += 1;            
            if (tick % ticksPerChord == 0) {
                progIdx += 1;
                progIdx %= props.prog.length;
                ticksPerChord = props.prog[progIdx].halfBar ? (ticksPerBar / 2) : ticksPerBar;
                chordIdx += 1; 
                chordIdx %= props.chords.length;
                hueDeg = remap(0,props.chords.length,0,360,chordIdx) + 15;
                ///var chord = props.chords[chordIdx];
                var chord = props.prog[progIdx].chord;
                uiChord
                    .text(chord.fullAbbrev())
                    .css({ color: `hsl(${hueDeg}deg,50%,70%)`});
                g.enableNoteValues(chord.noteValues());
            }
            noteValue = g.tick(noteValue);


            self.emit('note-value',noteValue);
            var frets = fretsWithinFromTo
                .filter(fret => fret.noteValue == noteValue)

            noteValuesWithinFrets = fretsWithinFromTo
                .map(fret => fret.noteValue);
            low = Math.min(...noteValuesWithinFrets);
            high = Math.max(...noteValuesWithinFrets);            
            g.updateNoteBounds([low, high])

            //
            var stopHere = false;

            var lastFretObj = {
                fret: saveFrets[saveFrets.length-1],
                string: saveStrings[saveStrings.length-1]
            };
            frets.forEach(fret => { 
                var score;
                if (fret.noteValue == 60) {
                    stopHere = true;
                }
                let actualFretDist = Math.abs(fret.fret - saveFrets[saveFrets.length-1]);
                let actualStringDist = Math.abs(fret.string - saveStrings[saveStrings.length-1]);                
                if (actualFretDist == 0) { 
                    fret.score = -1; //prefer same fret to same string...slight advantage
                    return score; 
                }
                var avgDist = fretDistance(fret,virtAvgFret);
                fret.score = avgDist;

                return fret.score;
            });
            let sorted = frets.sort(ascending(fret => fret.score));
            let chosenFret = sorted[0];
            if (stopHere) {
                var x = 3;
                var whereMyCsAt = frets.filter(fret => fret.noteValue == 60)
                /**
                 * console.log('whereMyCsAt',{
                    saveStrings,
                    saveFrets,
                    whereMyCsAt, 
                    sorted
                });
                ***/
    
            }

            fred.clearFretted();
            fred.plotFret(chosenFret, { fill: `hsl(${hueDeg}deg,50%,50%)`, fill2: 'rgba(255,0,0,1)'});
            saveFrets.shift(); //remove from beginning
            saveFrets.push(chosenFret.fret); //push onto end
            saveStrings.shift();
            saveStrings.push(chosenFret.string);

            tabEnabled && props.tablatureHelper && props.tablatureHelper.update(chosenFret)
        };
        doATick();
    }

    const progressionHistory = [];
    var phUI = DOM.div()
        .addClass('flex-row cursor-pointer');

    function updateProgression(progStr) {
        var prog = parseProgression(progStr);
        console.log("prog",prog);
        props.chords = prog.map(o => o.chord);
        props.prog = prog;
    }
    function handleProgressionChange(e) {
        var progStr = e.target.value;
        updateProgression(progStr);
        progressionHistory.push(progStr);

        var icon = DOM.span("⏰")
        .on('click',function(){
            updateProgression(progStr);
            txtProgression.val(progStr);
        });        
        phUI.append(icon);
        txtProgression.val(progStr);
        self.emit('progression-history',progressionHistory)
    }


    const self = Vindow({
        title: "Connecting Game",
        className: 'connecting-game'
    });
    const inTicksPerBar = LabeledTextInput({
        type: 'number',
        value: ticksPerBar,
        label: "Ticks Per Bar",
    })
    .on('change',function(val){
        ticksPerBar = Number(val);
    })
    const inNumLoops = LabeledTextInput({
        type: 'number',
        value: loops,
        label: "Loops",
    })
    .on('change',function(val){
        loops = Number(val);
    })
    const inTempo = LabeledTextInput({
        type: 'number',
        value: tempo,
        label: 'Tempo',
    })
    .on('change',function(val){
        tempo = Number(val);
    })


    const inFromFret = LabeledTextInput({
        type: 'number',
        value: fromFret,
        label: 'From Fret',
    })
    .on('change',function(val){
        fromFret = Number(val);
    })

    const inToFret = LabeledTextInput({
        type: 'number',
        value: toFret,
        label: 'To Fret',
    })
    .on('change',function(val){
        toFret = Number(val);
    })

    let tabEnabled = false;

    const inStringSet = StringSetChooser();
    inStringSet.on('change',(stringNumbers) => { stringSet = new Set(stringNumbers) })


    function handleTabItClick(){
        if (!props.chords || props.chords.length == 0) {
            alert('no chords!!');
        }
        tabEnabled = !tabEnabled;
        btnTabIt.val(tabEnabled ? "Stop Tab" : "Start Tab")
    }


    const btnTabIt = DOM.input()
        .attr('type','button')
        .val('Start Tab')
        .on('click',handleTabItClick)

    var playing = false;
    var iconStartStop = DOM.i()
        .addClass('fa fa-play');
    const btnStartStop = DOM.button()
        .text(playing ? 'Stop' : 'Start')
        .on('click',() => { 
            (playing ? stopSeq : startSeq)();
            btnStartStop.text(playing ? 'Stop' : 'Start')

        });

        const btnNudgeTickForward = DOM.button()
            .addClass('btn btn-sm')
            .append(DOM.i().addClass('fa fa-plus'))
            .on('click',() => { 
                tick += 1;
            });
        const btnNudgeTickBackward = DOM.button()
            .addClass('btn btn-sm')
            .append(DOM.i().addClass('fa fa-minus'))
            .on('click',() => { 
                tick -= 1;
            });

    const txtProgression = DOM.textarea()
        .addClass('progression full-width')
        .on('change',handleProgressionChange);

        
    self.appendToToolbar([
        inNumLoops.ui(),
        inTicksPerBar.ui(),
        inTempo.ui(),
        inFromFret.ui(),
        inToFret.ui(),
        inStringSet.ui(),
        btnTabIt,
        btnStartStop,
        btnNudgeTickBackward,
        btnNudgeTickForward,
        txtProgression,
        phUI
        //btnStop
    ]);

    var fretHeights = 100 / 6;

    var firstStringFrets = guitarData.filter(o => o.string == 1);
    var fps = firstStringFrets.length;
    var fretStarts = [];
    firstStringFrets.forEach(fret => {
      let prevStart = fretStarts.length ? fretStarts[fretStarts.length - 1] : 0;
      fretStarts.push(vlerp([prevStart], [100], 100 / fps / 100)[0]);
    });
    fretStarts = fretStarts.map(o => o * 1.56);
    var fretWidths = fretStarts.map((start, i) => {
      var result = i ? start - fretStarts[i - 1] : start;
      return result;
    });
    fretStarts.unshift(0);//add 0 to front of array
    var svgFretboard =  SVGFretboard({
        foo: 'bar',
        fps,
        fretStarts,
        fretWidths,
        fretHeights
      })
      .on('wake-up', () => console.log('WOKE!!'))
    var fred = svgFretboard;


    var uiChord = DOM.div()
      .addClass('chord-name')

    //content
    self.append(uiChord, svgFretboard.ui());
    
    fred.bootup();


    self.update = function(newProps) {
        props = {
            ...props,
            ...newProps
        }
    }

    if (props.storage) {
        props.storage.getItem('connecting-game-progressions',function(err,data){
            if (err) { return console.log(err) }
            var progs = JSON.parse(data);
            var progStr = progs[0];
            var fakeEvent = { target: { value: progStr }};
            handleProgressionChange(fakeEvent);
        });
    }



    return self;

}

export default ConnectingGame;