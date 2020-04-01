
BSD.Widgets.SVGFretboard = function(spec) {


  var colors = {
    fretboard: []
  };

  var self = BSD.PubSub({});
  let rects = [];
  var gFrets = DOM.g().attr({ class: 'frets'});
  var gStrings = DOM.g().attr({ class: 'strings' });
  var gFretted = DOM.g().attr({ class: 'fretted' });
  var gInlays = DOM.g().attr({ class: 'inlays' });
  let fretX = 0;
  var svg = jQuery(
      document.createElementNS("http://www.w3.org/2000/svg", "svg")
  )
  .attr({ 
    class: 'baz svg-board',
    viewBox: "0 0 100 100",
    'vector-effect': "non-scaling-stroke"
  })
  .append(
    DOM.rect()//bg
      .attr({
        class: 'bg',
        width: '100%',
        height: '100%',
      }),
    /**
    DOM.text('Blahhhhhh')
      .attr({
        x: 50,
        y: 50
      }),
    **/
    gFrets,
    gInlays,
    gStrings,
    gFretted,
  ).attr({ 
      //baseProfile: 'full',
      class: 'baz',
      width: "100%", 
      height: "80",
      //xmlns: "http://www.w3.org/2000/svg" 
  });

  self.testCircle = function(){
    gFretted.append(DOM.circle()
        .attr({
          cx: 25,
          cy: 25,
          r: '1.5%'
        }));
  };

  self.plotFingerboardFrets = function() {
    gFrets.append(
      BSD.guitarData
        .filter(fret => fret.string == 1)
        .map( fret => {
        //fretX = vlerp([+fretX],[100],100/22/100);
        var totW = 100;
        var h = (100 / 6);
        let fretXCoeff = Math.pow(1 + 100/fps/100,fret.fret+1) - 1;
        //fretXCoeff *= 1.56;
        let fretX = fretXCoeff * totW;
        //console.log('fretX',fretX);
        let rectOpts = {
            class: `string-${fret.string} fret-${fret.fret}`,
            fill: 'rgba(0,0,0,0.1)',//getRandomColor(),
            x: fretStarts[fret.fret] + '%',
            y: (fret.string-1) * fretHeights + '%',
            width: fretWidths[fret.fret] + '%',
            height: '100%'//fretHeights + '%'
          };

        rectOpts = Object.assign({
            stroke: 'black',
            'stroke-width': 0.5,
            'stroke-opacity': 0.5,
            'stroke-fill': '#777',
        },rectOpts);
        if (fret.fret == 0) {
          rectOpts = Object.assign(rectOpts,{
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
    .attr({ 
      class: 'base-board',
      width: '100%'
    })
  };

  self.plotStrings = function() {
    [1,2,3,4,5,6].forEach(string => {
      var stringGap = 14,
        nudge = -2,
        stringY = (string * stringGap) - stringGap/2 + nudge;
      gStrings.append(
        DOM.path()
          .attr({
            d: `M 0 ${stringY} L 600 ${stringY}`,
            stroke: 'black'
          })
      )
    });
  }

  self.plotInlays = function() {
    [3,5,7,9,12,15,17,19,21].forEach(function(fret){
      gInlays.append(DOM.rect()
        .attr({
          fill: 'rgba(0,0,0,0.1)',
          stroke: 'none',
          x: fretStarts[fret] + fretWidths[fret]/6 + '%',
          y: '10%',
          rx: 5,
          //r: '1.5%',
          width: fretWidths[fret] * 0.6 + '%',
          height: 80 + '%'
        }));      

    });
  }

  self.plotFret = function(fret,opts){
    var x = fretStarts[fret.fret] + fretWidths[fret.fret]/2;
    var radius = utils.map(fret.fret,0,fps,1.5,0.75);

    opts = Object.assign({
          //////class: 'fretted',
          cx:  x + '%',
          cy: (fret.string-1) * fretHeights + fretHeights/2 + '%',
          fill: 'rgba(0,0,0,0.1)',
          WASr: '1.5%',
          r: radius + '%',
          'stroke-width': 0.5,
          'stroke': 'black'
    },opts);
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
  ///self.on('wake-up', () => console.log('WOKE!'))

  return self;
};