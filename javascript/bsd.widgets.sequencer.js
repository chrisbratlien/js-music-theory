BSD.Widgets.Sequencer = function(spec) {
  var self = BSD.PubSub({});

  var tempoMillis, tickMillis;
  self.tempo = spec.tempo ? spec.tempo : 60;

  var timerQueue = [];
  
  self.paused = true;
  self.setTempo = function(bpm) {
    self.tempo = bpm;
    var mpb = 1 / self.tempo;
    
    tempoMillis = mpb * 60 * 1000;
    tickMillis = tempoMillis / 2;
  };

  self.enqueue = function(o) { //o must obey { when: millis, callback: function } contract
    o.fired = false;
    timerQueue.push(o);
  };
  self.tick = function(){
    //////console.log('tick',Math.random(),timerQueue);
    setTimeout(self.tick,tickMillis); //queue up next tick    
    if (self.paused) {    return false; }
    var now = (new Date).getTime();
    var overdue = timerQueue.select(function(o){
      return o.when < now; 
    });
    overdue.each(function(o){
      o.callback();
      o.fired = true;
    });

    timerQueue = timerQueue.select(function(o){
      return o.when >= now;
    });
  };
  self.start = function() {
    self.paused = false;    
  };
  self.resume = self.start; //alias
  
  self.stop = function() {
    self.paused = true;
  };
  self.setTempo(self.tempo);
  self.tick();
  return self;
}