import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import JSMT, { Note } from "./js-music-theory.js";
import RootNoteWithIntervals from "./RootNoteWithIntervals.js";

//TODO/FIXME: lots more refactoring needed for the global BSD object


const RulerItem = function(spec) {
    var self = spec;


    return self;
};


Array.prototype.rotate = function(count) {
    if (count == 0) { return this; }
    if (count > 0) { this.push(this.shift()); }
    if (count < 0) { this.unshift(this.pop()) }
    return this;
}


BSD.rulerPalette = BSD.randomPalette2(120, 70);



export function Ruler(spec) {
    //console.log('spec', spec);

    ////spec.items.reverse(); //get things in the right order now.
    var self = PubSub({});

    var twelve = JSMT.twelveNotes();

    var allMIDIValues = [];
    var divs = []; // to match state;
    for (var i = 0; i < 128; i += 1) {
        allMIDIValues[i] = i;
        var div = DOM.div().addClass('note');
        divs[i] = div;
    }

    //MIDI note value on/off table
    var state = spec.state || [];
    self.defaultState = function() {
        state = [];
        for (var i = 0; i < 128; i += 1) {
            state.push(false);
        }
    };
    if (state.length == 0) {
        self.defaultState(); //go ahead and default it.
    }


    var palette = BSD.rulerPalette; ///BSD.randomPalette2(128,70);


    self.allMIDINotes = function() {
        return allMIDIValues.map(function(v) { return Note(v); });
    };

    self.allMIDIValuesCurrentlyOn = function() {
        //console.log('state',state);
        var hits = allMIDIValues.select(function(v) { return state[v]; });
        return hits;
    };

    self.allMIDINotesCurrentlyOn = function() {
        return self.allMIDIValuesCurrentlyOn().map(function(v) { return Note(v); });
    };

    self.allDivsCurrentlyOn = function() {
        var result = self.allMIDIValuesCurrentlyOn().map(function(v) { return divs[v]; });
        /////console.log('**RESULT**',result);
        return result;
    };


    self.rootNote = spec.rootNote || Note('C');


    var rulerDiv = DOM.div().addClass('ruler');
    rulerDiv.css('display', 'inline');
    rulerDiv.css('position', 'relative');
    rulerDiv.css('float', 'left');


    self.shiftUp = function() {
        state.rotate(-1);
        palette.rotate(-1);
        self.reload();
    };
    self.shiftDown = function() {
        state.rotate(1);
        palette.rotate(1);
        self.reload();
    };

    self.updateStateFromNoteValues = function(values) {
        state = BSD.allMIDIValues.map(function(o) {
            return false;
        });
        values.each(function(o) {
            state[o] = true;
        });
    };

    self.onValues = function() {
        ///console.log('state', state);
        var on = state.map(function(o, i) {
            if (o) { return i; }
            return false;
        });
        var values = on.select(function(o) { return o; });
        return values;
    };

    self.drop2 = function() {
        ///console.log('state',state);
        var on = self.onValues();
        var newGuy = JSMT.rnwiFromNoteValues(on);
        var droppedGuy = newGuy.drop2();
        self.updateStateFromNoteValues(droppedGuy.noteValues());
        self.reload();
    };

    self.invertUp = function() {
        var on = self.onValues();
        var newGuy = JSMT.rnwiFromNoteValues(on);
        var droppedGuy = newGuy.invertUp();
        self.updateStateFromNoteValues(droppedGuy.noteValues());
        self.reload();
    };

    self.invertDown = function() {
        var on = self.onValues();
        var newGuy = JSMT.rnwiFromNoteValues(on);
        var droppedGuy = newGuy.invertDown();
        self.updateStateFromNoteValues(droppedGuy.noteValues());
        self.reload();
    };






    self.renderOn = function(wrap) {
        self.reload();
        wrap.append(rulerDiv);
    };


    self.chord = function() {
        /////var them = twelve.select(function(tone){ return state[tone.value()];  });
        var them = self.allMIDINotesCurrentlyOn();
        var rootNote = them[0];
        var intervals = them.map(function(tone) { return tone.value() - rootNote.value(); });
        var result = RootNoteWithIntervals({
            rootNote: rootNote,
            intervals: intervals
        });

        ////console.log('result (chord) note names',result.noteNames());
        return result;
    };


    self.colorize = function() {
        ////console.log('colorize');
        divs.forEach(function(div, offset) {
            ///console.log('offset',offset,'palette',palette);
            if (state[offset]) {
                var color = palette[offset];
                ///console.log('offset',offset,'color',color);
                div.css('background-color', '#' + color.toHex());
                div.css('color', 'white');
            } else {
                div.css('background-color', '#fff');
                div.css('color', 'black');
            }
            //OR//
            /***
            ////console.log('what?',console.log(spec.onColor));
            div.css('background-color','#fff');
            div.css('color','black');
            ***/
        });
    };

    self.close = function() {
        rulerDiv.remove();
        self.emit('destroy',self);
    }

    self.reload = function() {
        rulerDiv.empty();

        var classes = spec.classes || [];
        classes.each(function(c) {
            rulerDiv.addClass(c);
        });



        var close = DOM.div().addClass('control block close');
        rulerDiv.append(close);
        close.on('click', function() {
            if (!confirm('confirm removal of this ruler?')) {
                return false;
            }
            self.close();
        });


        var btnPlayAll = DOM.div().addClass('control block play-all');
        rulerDiv.append(btnPlayAll);
        btnPlayAll.on('click', function() {
            self.publish('play-chord', self.chord());
        });
        btnPlayAll.on('mouseover',
            function() {
                self.publish('current-chord', self.chord());
            });
        btnPlayAll.on('mouseout',
            function() {
                self.publish('current-chord', false);
            }
        );


        var btnShiftUp = DOM.div('+').addClass(' control block shift-up');
        rulerDiv.append(btnShiftUp);
        btnShiftUp.on('click', function() {
            self.shiftUp();
        });

        var btnShiftDown = DOM.div('-').addClass('control block shift-down');
        rulerDiv.append(btnShiftDown);
        btnShiftDown.on('click', function() {
            self.shiftDown();
        });

        var btnDrop2 = DOM.div('drop2').addClass('control block btn-drop2');
        rulerDiv.append(btnDrop2);
        btnDrop2.on('click', function() {
            self.drop2();
        });

        var btnInvertUp = DOM.div()
            .append([
                'inv',
                DOM.i()
                .addClass("fa fa-level-up")
            ]).addClass('control block btn-invert-up');
        rulerDiv.append(btnInvertUp);
        btnInvertUp.on('click', function() {
            self.invertUp();
        });

        var btnInvertDown = DOM.div()
            .append([
                'inv',
                DOM.i()
                .addClass("fa fa-level-down")
            ]).addClass('control block btn-invert-down');
        rulerDiv.append(btnInvertDown);
        btnInvertDown.on('click', function() {
            self.invertDown();
        });

        //do I need to replace this?
        //close.bind('touchend', function() { close.trigger('click'); }); //touchstart could cause too many things to accidentally get touched if the DOM shifts neighbors over

        ///console.log('state',state);

        var filtered = self.allMIDINotes().select(function(n) {
            var v = n.value();
            //return v >= 30 && v <= 90;
            return v >= 40 && v <= 72;
        });


        filtered.reverse().forEach(function(note, i) {
            //console.log('note',note,'name',note.name(),'ih?',i);
            //var div = DOM.div(note.name() + ' ' + note.value()).addClass('note');
            var midiValue = note.value();
            div = divs[midiValue];
            div.html(note.name());
            var priorColors = [];


            div.on('click', function() {
                state[midiValue] = !state[midiValue];
                if (state[midiValue]) {
                    self.publish('click', note);
                }
                self.colorize();
            });

            self.colorize();



            rulerDiv.append(div);



        });

    };
    return self;
};


const notePattern = [
    { name: 'A', names: ['A'], on: false },
    { name: 'Bb', names: ['A#', 'Bb'], on: false },
    { name: 'B', names: ['B'], on: false },
    { name: 'C', names: ['C'], on: false },
    { name: 'Db', names: ['C#', 'Db'], on: false },
    { name: 'D', names: ['D'], on: false },
    { name: 'Eb', names: ['D#', 'Eb'], on: false },
    { name: 'E', names: ['E'], on: false },
    { name: 'F', names: ['F'], on: false },
    { name: 'Gb', names: ['F#', 'Gb'], on: false },
    { name: 'G', names: ['G'], on: false },
    { name: 'Ab', names: ['G#', 'Ab'], on: false }
];

const twoOctavePattern = [
    { name: '1', names: ['1'], on: false },
    { name: 'b2', names: ['b2'], on: false },
    { name: '2', names: ['2', ], on: false },
    { name: 'b3', names: ['b3', '#2'], on: false },
    { name: '3', names: ['3'], on: false },
    { name: '4', names: ['4'], on: false },
    { name: 'b5', names: ['b5'], on: false },
    { name: '5', names: ['5'], on: false },
    { name: 'b6', names: ['b6'], on: false },
    { name: '6', names: ['6'], on: false },
    { name: 'b7', names: ['b7'], on: false },
    { name: '7', names: ['7'], on: false },
    { name: '8', names: ['8'], on: false },
    { name: 'b9', names: ['b9'], on: false },
    { name: '9', names: ['9'], on: false },
    { name: 'b10', names: ['b10', '#9'], on: false },
    { name: '10', names: ['10'], on: false },
    { name: '11', names: ['11'], on: false },
    { name: 'b12', names: ['b12'], on: false },
    { name: '12', names: ['12'], on: false },
    { name: 'b13', names: ['b13'], on: false },
    { name: '13', names: ['13'], on: false },
    { name: 'b14', names: ['b14'], on: false },
    { name: '14', names: ['14'], on: false }

];


const modifiedPattern = function(notes) {
    var startPattern = twoOctavePattern;
    ////console.log('startPattern',startPattern);

    var modified = startPattern.collect(function(item) {
        var hit = notes.detect(function(n) {
            ////console.log('item',item,item.names,item.name);
            var hit2 = item.names.detect(function(name) {
                return name == n;
            });
            return (hit2 != false);
        });

        return { name: item.name, names: item.names, on: (hit != false) }
    });

    ///console.log('modified',modified);
    return modified;
};

BSD.rulers = [];
BSD.noteRulers = [];

BSD.rulerSnapSize = 20;

export function DegreeRuler(spec) {
    var pattern = modifiedPattern((spec.degrees).split(','));
    var state = BSD.allMIDIValues.map(function(v) {
        if (typeof pattern[v - 60] == "undefined") { return false; }
        return pattern[v - 60].on;
    });
    //console.log('state',state);

    var self = Ruler({
        state: state,
        foo: 'bar'
    });
    BSD.rulers.push(self);
    return self;
};

export function NoteRuler(spec) {
    //console.log('note ruler');
    var pattern = notePattern;
    var myItems = pattern.concat(pattern).concat(pattern);
    var myRulerItems = myItems.map(function(i) { return RulerItem(i); });

    var self = Ruler({
        onUpdate: function() {},
        showDegrees: true,
        title: 'notes',
        items: myRulerItems,
        classes: ['chromatic', 'notes', 'scale'],
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

export function NullRuler() {
    return DegreeRuler({
        title: '(empty)',
        degrees: '',

    });
};



export function MajorScaleRuler() {
    return DegreeRuler({ title: 'M', degrees: '1,2,3,4,5,6,7,8,9,10,11,12,13,14', classes: ['scale', 'major'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};
export function MinorScaleRuler() {
    return DegreeRuler({ title: '-', degrees: '1,2,b3,4,5,b6,b7,8,9,b10,11,12,b13,b14', classes: ['scale', 'minor'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};
export function HarmonicMinorScaleRuler() {
    return DegreeRuler({ title: 'HM', degrees: '1,2,b3,4,5,b6,7,8,9,b10,11,12,b13,14', classes: ['scale', 'harmonic-minor'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};


export function MajorPentatonicScaleRuler() {
    return DegreeRuler({ title: 'MP', degrees: '1,2,3,5,6,8,9,10,12,13', classes: ['scale', 'major-pentatonic'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};
export function MinorPentatonicScaleRuler() {
    return DegreeRuler({ title: 'mP', degrees: '1,b3,4,5,b7,8,b10,11,12,b14', classes: ['scale', 'minor-pentatonic'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};
export function BluesScaleRuler() {
    return DegreeRuler({ title: 'blues', degrees: '1,b3,4,b5,5,b7,8,b10,11,b12,12,b14', classes: ['scale', 'blues'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};
export function MajorPentatonicPatternRuler() {
    return DegreeRuler({ title: 'MPP', degrees: '1,b3,3,5,6,8,b10,10,12,13', classes: ['scale', 'major-pentatonic-pattern'], isScale: true, onColor: BSD.colorFromHex('#88bb88') });
};






export function MajorSixChordRuler() {
    return DegreeRuler({ title: '6', degrees: '1,3,5,6' });
};
export function MajorSixNineChordRuler() {
    return DegreeRuler({ title: '6/9', degrees: '1,2,3,5,6,9' });
};

export function MinorSixChordRuler() {
    return DegreeRuler({ title: '-6', degrees: '1,b3,5,6' });
};




//major/minor
export function MajorChordRuler() {
    return DegreeRuler({ title: '', degrees: '1,3,5' });
};
export function MinorChordRuler() {
    return DegreeRuler({ title: '-', degrees: '1,b3,5' });
};



//sevenths

export function Minor7ChordRuler() {
    return DegreeRuler({ title: '-7', degrees: '1,b3,5,b7' });
};
export function Minor7Flat5ChordRuler() {
    return DegreeRuler({ title: '-7b5', degrees: '1,b3,b5,b7' });
};


export function Dominant7ChordRuler() {
    return DegreeRuler({ title: '7', degrees: '1,3,5,b7' });
};
export function Dominant7Flat5ChordRuler() {
    return DegreeRuler({ title: '7b5', degrees: '1,3,b5,b7' });
};
export function Dominant7Flat9ChordRuler() {
    return DegreeRuler({ title: '7b9', degrees: '1,b2,3,5,b7,b9' });
};
export function Dominant7Sharp9ChordRuler() {
    return DegreeRuler({ title: '7#9', degrees: '1,#2,3,5,b7,#9' });
};
export function Major7ChordRuler() {
    return DegreeRuler({ title: 'M7', degrees: '1,3,5,7' });
};
export function Diminished7ChordRuler() {
    return DegreeRuler({ title: 'o7', degrees: '1,b3,b5,6' });
};



export function Minor9ChordRuler() {
    return DegreeRuler({ title: '-9', degrees: '1,b3,5,b7,9' });
};

export function Dominant9ChordRuler() {
    return DegreeRuler({ title: '9', degrees: '1,3,5,b7,9' });
};

export function Major9ChordRuler() {
    return DegreeRuler({ title: 'M9', degrees: '1,3,5,7,9' });
};








export function Minor13ChordRuler() {
    return DegreeRuler({ title: '-13', degrees: '1,b3,5,b7,9,11,13' });
};

export function Dominant13ChordRuler() {
    return DegreeRuler({ title: '13', degrees: '1,3,5,b7,9,11,13' });
};

export function Major13ChordRuler() {
    return DegreeRuler({ title: 'M13', degrees: '1,3,5,7,9,11,13' });
};