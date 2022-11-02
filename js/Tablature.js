import PubSub from "./PubSub.js";
import DOM from "./DOM.js";
import {sorter} from "./Utils.js";

function Tablature(props) {
    const self = PubSub();

    let table, tbody, debugDiv, textarea;
    const pane = DOM.div()
        .addClass('tablature-pane flex-column full-width')
        .append([
            table = DOM.table()
                .append(tbody = DOM.tbody()),
            textarea = DOM.textarea(),
            debugDiv = DOM.div()
                .addClass('debug')
        ]);

    var fromFret = 1;
    var toFret = 5; 
    var txtFrom = DOM.input()
        .addClass('from')
        .attr('type','number')
        .attr('min',0)
        .val(fromFret)

    var txtTo = DOM.input()
        .addClass('from')
        .attr('type','number')
        .attr('min',5)
        .val(toFret)

    var toolbar = DOM.div()
        .addClass('flex-row full-width')
        .append([
            txtFrom,
            txtTo
        ]);

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

    const STRING_RANGE = range(1,6,1);

    function debug(o,label = 'unlabeled') {
        debugDiv
            //.empty()
            .append([
                DOM.h5(label),
                DOM.pre(
                    (typeof o === "string") ? o : JSON.stringify(o,null,4)
                )
            ])
    }

    self.ui = function() {
        return [null, pane];

    }

    var fretZeroNoteNumbers = [
        null,//string 0
        64, //string 1
        59,//string 2
        55,//string 3
        50,//string 4
        45,//string 5
        40//string 6
    ];
    let fznn = fretZeroNoteNumbers;
    let myEvents = [];
    let tickRange;

    function moveToString(evt,newString) {
        if (newString > 6 || newString < 1) {return false; }
        let newFret = evt.noteNumber - fznn[newString];
        if (newFret < 0) { return false; }
        evt.string = newString;
        evt.fret = newFret;
    }

    self.populateMyEvents = function() {
        myEvents = props.events.map(evt => {
            evt.string = STRING_RANGE.find(str => fznn[str] <= evt.noteNumber)
            //debug(string,'string');
            evt.fret = evt.noteNumber - fznn[evt.string];
            if (evt.fret < fromFret) {
                moveToString(evt, evt.string + 1);
            }
            return evt;
        });
        //debug(myEvents,'myEvents');

        tickRange.map(tickIdx =>{
            let eventsForTick = myEvents.filter(evt => evt.tickIdx === tickIdx);
            STRING_RANGE.map(str => {
                let eventsForString = eventsForTick
                    .filter(evt => evt.string === str)
                    .sort(sorter(evt => evt.fret))
                    
                //eventsForString.length > 1 && debug(eventsForString,'dupe');

                while (eventsForString.length > 1) {
                    let first = eventsForString.shift();
                    //debug(first,'first before fix')
                    first.string += 1;
                    first.fret = first.noteNumber - fznn[first.string]
                    //debug(first,'first after fix')
                }
            })

        })
    }
    self.walkStringTime = function(callback) {
        STRING_RANGE.forEach(aString => {
            tickRange.forEach(tickIdx => {
                let eventsForStringTick = myEvents
                    .filter(evt => evt.tickIdx === tickIdx)
                    .filter(evt => evt.string === aString)
                let evt = eventsForStringTick.find(o => o)
                callback(evt)
            })
        })
    }

    function paginate(str,pageSize) {
        const accum = [];
        function helper(s) {
          if (s.length <= pageSize) { return accum.push(s) }
          accum.push(s.slice(0,pageSize));
          helper(s.slice(pageSize))
        }
        helper(str)
        return accum;
    }
    function isBarTick(tickIdx) {
        return (tickIdx % (props.PPQ * props.QPBAR) == 0);
    }

    self.tabString = function() {

        let kernel = 3;

        let stringText = STRING_RANGE.reduce(
            (accum,str)=>{
                accum[str] = tickRange.map((o,tickIdx) => {
                    let pop = '-------'.slice(0,kernel);
                    if (isBarTick(tickIdx)) {
                        pop = '|' + pop.slice(1);
                    }        
                    return pop;
                })
                .join("")


                return accum;
            },{});

        self.walkStringTime(function(evt) {
            if (!evt) { return false; }
            let start = kernel * evt.tickIdx;



            let pop = ('-----' + evt.fret).slice(-1 * kernel);
            if (isBarTick(evt.tickIdx)) {
                pop = '|' + pop.slice(1);
            }
            let stext = stringText[evt.string];
            stext = stext.slice(0,start) + pop + stext.slice(start+kernel);
            stringText[evt.string] = stext;
        });
        ///var pageSize = kernel * props.PPQ * props.QPBAR * 2;
        var pageSize = 96;
        var paginated = STRING_RANGE.reduce(
            (accum,strNum) => {
                accum[strNum] = paginate(stringText[strNum], pageSize)
                return accum;
            },{})
        //debug(stringText,'stringText object');
        //debug(paginated, 'paginated');
        //let final = Object.values(stringText)
        //    .join("\n");
        //debug(final,'Final')
        //determine pages based on first string.

        const numPages = paginate(stringText[1],pageSize).length;
        const pageRange = range(0,numPages,1);

        const resultText = pageRange.map(pageNum => {
            var pageText = STRING_RANGE.map(strNum => {
                    return paginated[strNum][pageNum];
                },[])
                .join("|\n") + "|\n";
            return pageText;
        })
        .join("\n\n\n");
        textarea
            .empty()
            //.val(final)
            .val("\n\n" + resultText)
    }

    self.refresh = function() {
        self.tabString();
        let tabIndex=123;
        tbody.empty();
        STRING_RANGE.forEach(aString => {
            let row = DOM.tr();
            tickRange.forEach(tickIdx => {
                tabIndex++;
                let eventsForStringTick = myEvents
                    .filter(evt => evt.tickIdx === tickIdx)
                    .filter(evt => evt.string === aString)
                let cell = DOM.td('&nbsp;');
                if (eventsForStringTick.length > 1) {
                    debug(eventsForStringTick,'still dupe')
                }
                let evt = eventsForStringTick.find(o => o)
                if (evt) {
                        cell.html(evt.fret)
                }
                cell.on('click',function(e){
                    if (!evt) { return false; }
                    e.target.tabIndex = 333;
                    e.target.focus();
                    e.target.addEventListener('keyup',function(e){
                        var actions = {
                            ArrowDown: () => moveToString(evt,evt.string+1),
                            ArrowUp: () =>  moveToString(evt,evt.string-1)
                        }
                        let action = actions[e.key];
                        if (action) {
                            action();
                            self.refresh();
                        }
                    });
                })



                row.append(cell)

            })

            tbody.append(row)
        })
    }


    self.update = function(data) {
        ////console.log('tabl',data);
        props = data;
        tickRange = range(0,props.TPLOOP,1);
        self.populateMyEvents();
        debugDiv.empty()
        self.refresh();
    }


    return self;
}

export function TablatureHelper(tablature) {
    var tick = -1;
    var TPBAR = 4;
    var tabTemplate = {
      BARS: 16,
      BPM: 100,
      PPQ: 1,
      QPBAR: 4,
      TPBAR,
      TPLOOP: 64,
      events: []
    }
    var tabEvents = [];
    var barIdx = 0;

    function update(noteValues) {
        if (!Array.isArray(noteValues)){
            noteValues = [noteValues];
        }
        noteValues.forEach(function(noteValue){
            tick += 1;
            barIdx = Math.floor(tick / 4); 
            //console.log('nv',noteValue);
            tabEvents.push({
              noteNumber: noteValue,
              tickIdx: tick
            });
        });

        var BARS = barIdx + 1;
        var TPLOOP = BARS * TPBAR;
        tabTemplate = {
          ...tabTemplate,
          BARS,
          TPLOOP
        }
        tablature.update({
          ...tabTemplate,
          events: tabEvents
        })
    }
    return {
        update
    }
}


export default Tablature;