import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import {remap} from "./Lerpy.js";
import {makeChord} from "./js-music-theory.js";

async function loadGuitarData() {
    async function inner() {
      var resp = await fetch(BSD.baseURL + '/data/guitar.json');
      var json = await resp.json();
      return json;
    }
    return await inner();
}

var guitarData = await loadGuitarData();


function getFrets(spec) {
    return guitarData
    .filter(fret => {
        let chord = typeof spec.chord == 'string' ? makeChord(spec.chord) : spec.chord;
        return spec.strings.includes(fret.string) &&
            fret.fret >= Math.min(...spec.fretRange) &&
            fret.fret <= Math.max(...spec.fretRange) &&
            chord
            .abstractNoteValues()
            .includes(fret.noteValue % 12)
    });
}





function SVGFretboard(spec) {

    var colors = {
        fretboard: []
    };

    var self = PubSub({});
    let rects = [];
    var gFrets = DOM.g().attr({ class: 'frets' });
    var gStrings = DOM.g().attr({ class: 'strings' });
    var gFretted = DOM.g().attr({ class: 'fretted' });
    var gInlays = DOM.g().attr({ class: 'inlays' });
    let fretX = 0;

    var svg = DOM.from(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
    );

    svg
        .attr({
            class: 'baz svg-board',
            'vector-effect': "non-scaling-stroke",
            preserveAspectRatio: 'xMidYMid meet',
            width: "100%",
            height: "80",
        })
        .append(
            DOM.rect() //bg
            .attr({
                class: 'bg',
            }),
            gFrets,
            gInlays,
            gStrings,
            gFretted,
        )

    self.testCircle = function() {
        gFretted.append(DOM.circle()
            .attr({
                cx: 25,
                cy: 25,
                r: '1.5%'
            }));
    };

    self.plotFingerboardFrets = function() {
        gFrets
            .attr({
                class: 'gfrets base-board',
            })
            .append(
                guitarData //fixme. pass this in with context or props
                .filter(fret => fret.string == 1)
                .map( (fret,i,frets) => {
                    //fretX = vlerp([+fretX],[100],100/22/100);
                    var totW = 100;
                    var h = (100 / 6);
                    var inverseFret = frets[frets.length-(i+1)];

                    //console.log({ fret, inverseFret})
                    let xIdx = fret.fret;
                    //xIdx = inverseFret.fret;

                    let fretXCoeff = Math.pow(1 + 100 / spec.fps / 100, xIdx + 1) - 1;
                    //fretXCoeff *= 1.56;
                    let fretX = fretXCoeff * totW;
                    //console.log('fretX',fretX);
                    let rectOpts = {
                        class: `string-${fret.string} fret-${fret.fret}`,
                        fill: 'rgba(0,0,0,0.1)', //getRandomColor(),
                        x: spec.fretStarts[xIdx] + '%',
                        y: (fret.string - 1) * spec.fretHeights + '%',
                        width: spec.fretWidths[xIdx] + '%',
                        height: '100%' //fretHeights + '%'
                    };

                    rectOpts = Object.assign({
                        stroke: 'black',
                        'stroke-width': 0.5,
                        'stroke-opacity': 0.5,
                        'stroke-fill': '#777',
                    }, rectOpts);
                    if (fret.fret == 0) {
                        rectOpts = Object.assign(rectOpts, {
                            fill: 'none',
                            stroke: 'none',
                            'stroke-fill': 'none'
                        });
                    }
                    let rect = DOM.rect()
                        .attr(rectOpts);
                    rects.push(rect);
                    return rect;
                })
            )



    };


/*
https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line
*/

    self.plotStrings = function() {
        [1, 2, 3, 4, 5, 6].forEach(string => {
            var stringGap = 14,
                nudge = -2,
                stringY = (string * stringGap) - stringGap / 2 + nudge;
            gStrings.append(
                /**
                DOM.path()
                .attr({
                    d: `M 0 ${stringY} L 600 ${stringY}`,
                    stroke: 'black'
                }),
                ***/
                DOM.line()
                    .attr({
                        x1: 0,
                        x2: '100%',
                        y1: stringY,
                        y2: stringY
                    })
                    .css({
                        //stroke: 'rgb(234,243,0)',
                        stroke: 'grey',
                        strokeWidth: remap(1,6,1,2.5,string),
                    })
            )
        });
    }

    self.plotInlays = function() {
        [3, 5, 7, 9, 12, 15, 17, 19, 21].forEach(function(fret) {
            gInlays.append(DOM.rect()
                .attr({
                    fill: 'rgba(0,0,0,0.1)',
                    stroke: 'none',
                    x: spec.fretStarts[fret] + spec.fretWidths[fret] / 6 + '%',
                    y: '10%',
                    rx: 5,
                    //r: '1.5%',
                    width: spec.fretWidths[fret] * 0.6 + '%',
                    height: 80 + '%'
                }));

        });
    }

    self.plotFrets = (frets, opts) => frets
        .forEach(fret => self.plotFret(fret, opts))


    self.plotFret = function(fret, opts) {
        var x = spec.fretStarts[fret.fret] + spec.fretWidths[fret.fret] / 2;
        ///var radius = utils.map(fret.fret, 0, spec.fps, 1.5, 0.75);
        var radius = remap(0, spec.fps, 1.5, 0.75,fret.fret);
        var fill = opts.fill || 'rgba(0,0,0,0.1)';



        opts = Object.assign({
            //////class: 'fretted',
            cx: x + '%',
            cy: (fret.string - 1) * spec.fretHeights + spec.fretHeights / 2 + '%',
            fill: fill,
            WASr: '1.5%',
            r: radius + '%',
            'stroke-width': 0.5,
            'stroke': 'black'
        }, opts);
        opts.class = 'fretted ' + (opts.class || '');

        gFretted.append(DOM.circle()
            .attr(opts));
    };
    self.clearFretted = function() {
        gFretted.empty();
        return self;
    }


    self.ui = function() {
        return svg;
    }

    return self;
};
export default SVGFretboard;