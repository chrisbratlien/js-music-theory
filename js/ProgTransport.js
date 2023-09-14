import PubSub from "./PubSub.js"
import DOM from "./DOM.js"


let songCyclePosition, songFormPosition;

export default function ProgTransport() {
    const self = PubSub();
    const wrap =
        DOM.div()
            .addClass('song-form-position-wrap noprint')
            .append([
                DOM.div()
                    .addClass('song-form-position-wrap')
                    .append([
                        'Cycle',
                        DOM.div('A')
                            .addClass('btn btn-default btn-loop-start'),
                        DOM.div('B')
                            .addClass('btn btn-default btn-loop-end'),
                        songCyclePosition = DOM.div()
                            .addClass('song-cycle-position'),
                        'Bar',
                        songFormPosition = DOM.div()
                            .addClass('song-form-position')
                    ])
            ])
    self.ui = () => wrap; 
    self.clear = () => "not implemented"

    self.reset = function({totalBars}) {
        songCyclePosition.empty();
        songFormPosition.empty();
        var range = [];

        for (var i = 0; i < BSD.totalBars; i += 1) {
            range.push(i);
          }
          range.forEach(function(i) {
            var div = DOM.div(i + 1).addClass('bar bar-' + i);
            songFormPosition.append(div);
    
            div.on('click', function() {
              BSD.clickedBar = i;
              var event = BSD.sequence.find(function(o) {
                return o.barIdx == i && o.cycleIdx == BSD.currentCycleIdx;
              });
              console.log('event', event);
              self.emit('tick',event);
              //tick(event);
            });
          });
    
          BSD.totalCycles = BSD.sequence[BSD.sequence.length - 1].cycleIdx + 1;
          range = [];
          for (var i = 0; i < BSD.totalCycles; i += 1) {
            range.push(i);
          }
          range.forEach(function(i) {
            var div = DOM.div(i + 1).addClass('cycle cycle-' + i);
            songCyclePosition.append(div);
    
            div.on('click', function() {
              BSD.clickedCycle = i;
              var event = BSD.sequence.find(function(o) {
                return o.cycleIdx == i && o.barIdx == BSD.currentBarIdx;
              });
              console.log('event', event);
              self.emit('tick',event);
            });
          });
    }


    self.updatePosition = function(event) {


        let tmp;

        tmp = songFormPosition.find('.active')
        tmp && tmp.removeClass('active');
        tmp = songFormPosition.find('.bar-' + event.barIdx);
        tmp && tmp.addClass('active');
        ///songCycleIndicator.html(o.cycleIdx+1);
  
        tmp = songCyclePosition.find('.active');
        tmp && tmp.removeClass('active');
        tmp = songCyclePosition.find('.cycle-' + event.cycleIdx);
        tmp && tmp.addClass('active');
  
    }


    return self;
}