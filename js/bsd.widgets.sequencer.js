BSD.Widgets.Sequencer = function(spec) {
  var self = BSD.PubSub({});

  var tempoMillis, tickMillis;
  self.tempo = spec.tempo ? spec.tempo : 60;

  var timerQueue = [];
  
  self.paused = true;
  
  self. tempoToMillis = function(bpm) {
    var mpb = 1 / bpm;
    tempms = mpb * 60 * 1000;
    return tempms;
  };
  
  self.setTempo = function(bpm) {
    self.tempo = bpm;
    tempoMillis = self.tempoToMillis(bpm);
    tickMillis = tempoMillis / 4;
  };
  self.flush = function() {
    timerQueue = [];
  };


  self.enqueue = function(o) { //o must obey { when: millis, callback: function } contract
    console.log('enqueueing',o);
    o.fired = false;
    timerQueue.push(o);
  };
  self.tick = function(){
    ///console.log('tick',Math.random(),timerQueue);
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
  self.pause = self.stop;
  
  
  self.setTempo(self.tempo);
  self.tick();
  return self;
}