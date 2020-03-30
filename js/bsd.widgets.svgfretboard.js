
BSD.Widgets.SVGFretboard = function(spec) {

  var self = BSD.PubSub({});
  let rects = [];
  var gFrets = DOM.g();
  var gFretted = DOM.g().attr({ class: 'fretted' });
  let fretX = 0;
  var svg = jQuery(
      document.createElementNS("http://www.w3.org/2000/svg", "svg")
  )
  .addClass("baz svg-board")
  .append(
    DOM.rect()//bg
      .attr({
        class: 'bg',
        width: '100%',
        height: '100%',
        fill: '#fee'
      }),
    /**
    DOM.text('Blahhhhhh')
      .attr({
        x: 50,
        y: 50
      }),
    **/
    gFrets.append(
      BSD.guitarData.map( fret => {
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
            height: fretHeights + '%'
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
    }),
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
          'stroke': '#f77'
    },opts);
    opts.class = 'fretted ' + opts.class;

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