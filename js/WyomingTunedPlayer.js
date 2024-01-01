import PubSub from "./PubSub.js";
import { randomInRange } from "./Utils.js";
import { lerp } from "./Lerpy.js";

export default function WyomingTunedPlayer(spec) {

  var bank = {};

  var self = PubSub({});
  self.spec = spec;

  var out = context.createGain();
  out.gain.value = 0.0008;
  out.connect(spec.destination);
  self.out = out;



  self.subscribe('set-master-volume', function (magnitude) {
    if (isNaN(magnitude) || typeof magnitude !== "number") { throw "bad magnitude" }
    //console.log('MAG BEFORE',magnitude,volume);
    ///volume = magnitude;
    self.out.gain.value = magnitude;    
    ////console.log('MAG AFTER',magnitude,volume);
  });



  self.getOsc = function(freq, type) {
    var osc = context.createOscillator();/////BufferSource();
    osc.frequency.value = freq;
    osc.type = type
    return osc;
  };

  self.getEnviron = function({ frequency, gainValue, type }) { //environ has just one osc. and one gain.
  	var env = {};
    //for now, just one osc...
    ///var ampAttack = Math.random() / 10;
  	var ampDecay = Math.random() + 0.2; 
    //ampAttack = Math.random() * 0.4 + 0.01;
   	var ampAttack = Math.random() * 0.2;


    var time = context.currentTime;

    var osc = self.getOsc(frequency, type);

    var gain = context.createGain();
    gain.gain.value = gainValue;//0;
    
    env.start = function() {
		    osc.connect(gain);
		    gain.connect(out);

    		//gain.gain.linearRampToValueAtTime(gainValue, context.currentTime + ampAttack);    

        ///gain.gain.setTargetAtTime(gainValue, context.currentTime, 0.0001);

        gain.gain.setTargetAtTime(gainValue, time, ampAttack);
        gain.gain.setTargetAtTime(0, time + ampAttack, ampDecay);



		    osc.start(0);      
    };
    env.stop = function() {
    	var releaseMillis = 10; //100ms
			////gain.gain.linearRampToValueAtTime(0.0, releaseMillis/1000); //fade to 0 over 0.1 seconds
      //gain.gain.setTargetAtTime(0, context.currentTime, 0.0001);

			setTimeout(function(){
        osc.disconnect();
        osc.stop();
        osc = null;
        gain.disconnect();
        gain = null;
			},releaseMillis*2);

    };
    return env;
  };

  self.playNote = function(note,duration,velocity) {
    var result = {};
    var v = note.value();
    while (v > spec.range[1]) {
      v -= 12;
    }
    while (v < spec.range[0]) {
      v += 12;
    }
    ///console.log('v?',v);
    ////////var freq = midi2Hertz(v);

  let detuneHz = lerp(0, 2, Math.random()); //max 2 Hz detune
  let detuneSplitT = Math.random(); //give some detune up, some down.
  let detuneUpHz = lerp(0,detuneHz, detuneSplitT);
  let detuneDownHz = lerp(0,detuneHz, 1 - detuneSplitT);

  var items = [
    { title: 'fundamental-square',  frequency: midi2Hertz(v,0), gainValue: 0.02, type: 'square' },
    { title: 'fundamental-sine', frequency: midi2Hertz(v,0), gainValue: 0.35, type: 'sine' },
    { title: 'detune-down', frequency: midi2Hertz(v,0) - detuneDownHz, gainValue: 0.02, type: 'square' },
    { title: 'detune-up', frequency: midi2Hertz(v,0) + detuneUpHz, gainValue: 0.02, type: 'square' }
  ];

    // if (spec.itemTitles) {
    //   items = items.filter(function(item){  
    //     return spec.itemTitles.indexOf(item.title) > -1;
    //   });
    // }

    var environments = items.map(function(item) {
    		return self.getEnviron(item);
    });
  	
  	environments.forEach(function(env){
	    env.start();
	    if (duration) { setTimeout(env.stop,duration); }
  	});
  
    result.stop = function() {
	  	environments.forEach(function(env) {
        env.stop();
      });
    };
		return result;
  };
  self.playChord = function(chord,duration) {
    chord.notes().forEach(function(note){
      self.playNote(note,duration);
    });
  };

  return self;
};

