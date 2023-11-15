import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import {remap} from "./Lerpy.js";
import {makeChord, twelveBitMask} from "./js-music-theory.js";
import {vlerp} from "./VectorLerpy.js";

//FIXME/NOTE: vlerp is external from js/la.js

const STRING_GAP = 14; //probably not percent?


async function loadGuitarData() {
    async function inner() {
      var resp = await fetch(BSD.baseURL + '/data/guitar.json');
      var json = await resp.json();
      return json;
    }
    return await inner();
}

//NOTE: this happens immediately before usage elsewhere
const guitarData = await loadGuitarData();


let firstStringFrets, fps, fretStarts, fretWidths, fretHeights;
fretHeights = 100 / 6;
firstStringFrets = guitarData
    .filter(o => o.string == 1);
fps = firstStringFrets.length;
fretStarts = [];
firstStringFrets.forEach(fret => {
    let last = fretStarts.length ? fretStarts[fretStarts.length - 1] : 0;
    fretStarts.push(vlerp([last], [100], 100 / fps / 100)[0]);
});

fretStarts = fretStarts.map(o => o * 1.56);
fretWidths = fretStarts.map((s, i) => {
    var result = i ? s - fretStarts[i - 1] : s;
    return result;
});
fretStarts.unshift(0);//put 0 as the first


export function getFretsByChromaticHash(selectHash)  { 
    return guitarData
        .filter(fret => {
        let fretHash = twelveBitMask[fret.chromaticValue];
        return (fretHash & selectHash) == fretHash;
    });
}

export function getIntervalFill(idx) {
    let colorHash =  '#FF0000-#E6DF52-#FFDD17-#4699D4-#4699D4-#FFAAAA-#000000-#000000-#bbbbbb-#67AFAD-#8C64AB-#8C64AB'.split(/-/);
    if (idx < 0) {
      idx += 12;
    }
    if (idx == 4) {
        var x = 111;
    }

    let fill = colorHash[idx];
    return fill;
}


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
    var gWillFret = DOM.g().attr({ class: 'will-fret' });   
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
            xmlns: "http://www.w3.org/2000/svg"
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
            gWillFret
        )


    self.swapGroups = function() {
        let tmp = gFretted;
        gFretted = gWillFret;
        gWillFret = tmp;
    }

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

                    let fretXCoeff = Math.pow(1 + 100 / fps / 100, xIdx + 1) - 1;
                    //fretXCoeff *= 1.56;
                    let fretX = fretXCoeff * totW;
                    //console.log('fretX',fretX);
                    let rectOpts = {
                        class: `string-${fret.string} fret-${fret.fret}`,
                        fill: 'rgba(0,0,0,0.1)', //getRandomColor(),
                        x: fretStarts[xIdx] + '%',
                        y: (fret.string - 1) * fretHeights + '%',
                        width: fretWidths[xIdx] + '%',
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
            var stringGap = STRING_GAP,
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
                        ///stroke: 'grey',
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
                    x: fretStarts[fret] + fretWidths[fret] / 6 + '%',
                    y: '10%',
                    rx: 5,
                    //r: '1.5%',
                    width: fretWidths[fret] * 0.6 + '%',
                    height: 80 + '%'
                }));

        });
    }

    self.plotFrets = (frets, opts, fretGroup) => frets
        .forEach(fret => self.plotFret(fret, opts, fretGroup))


    self.plotFret = function(fret, opts, fretGroup) {

        if (!fretGroup) {
            fretGroup = gFretted
        }

        var x = fretStarts[fret.fret] + fretWidths[fret.fret] / 2;
        ///var radius = utils.map(fret.fret, 0, fps, 1.5, 0.75);

        var maxCircleRadiusPercent = opts.maxCircleRadiusPercent || 1.25;
        var minCircleRadiusPercent = opts.minCircleRadiusPercent || 0.75;

        var radius = remap(
            0, fps, 
            maxCircleRadiusPercent, 
            minCircleRadiusPercent,
            fret.fret, 
            true);

        var ry = remap(
            0,fps,
            7, //% radius compared to height when frets are low
            3, //% radius compared to height when frets are high
            fret.fret
        );

        var fillFromInterval = (fret.interval || fret.interval === 0) ? getIntervalFill(fret.interval) : false;
        var fill = fillFromInterval ? fillFromInterval : opts.fill;
        fill = fill ? fill : 'rgba(0,0,0,0.1)';


        opts = {
            //////class: 'fretted',
            cx: x + '%',
            cy: (fret.string - 1) * fretHeights + fretHeights / 2 + '%',
            ///WASr: '1.5%',
            //rx: 'auto',
            ry: ry + '%',
            'stroke-width': 0.5,
            'stroke': 'black',
            ...opts,
            fill: fill,
        };

        opts.class = 'fretted ' + (opts.class || '');

        fretGroup.append(DOM.ellipse()
            .attr(opts));
    };
    self.clearFretted = function(fretGroup) {
        if (!fretGroup) {
            fretGroup = gFretted
        }
        fretGroup.empty();
        return self;
    }
    self.getFretGroups = function() {
        return {
            gFretted,
            gWillFret
        }
    }



    self.plotHelper = function({ chordOrScale, opts, fretRange, stringSet, svgAlpha }) {

        //let myColor = BSD.chosenColors[0];
        //BSD.chosenColors.push(BSD.chosenColors.shift());
  
        //console.log('BSD.options',BSD.options);
  
        //var fr = BSD.options.fretRange;
        const fr = fretRange;
        //const strings = stringSet;
        const strings = stringSet.split('').map(o => +o);
        var hash = chordOrScale.chromaticHash();
        var frets = getFretsByChromaticHash(hash)
          .filter(fret => fret.fret >= fr[0] && fret.fret <= fr[1])
          .filter(fret => strings.includes(fret.string))
          .map(fret => {
            var interval = fret.chromaticValue - chordOrScale.rootNote.chromaticValue();
            return {
              ...fret,
              interval
            };
          });
        
        opts = opts || {};
        opts = {...opts,
          //fill: '#' + myColor.toHex(),
          'fill-opacity': svgAlpha      
        }
        self.plotFrets(frets, opts);
      }
  




    self.ui = function() {
        return svg;
    }

    return self;
};
export default SVGFretboard;