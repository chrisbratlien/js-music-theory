BSD.Widgets.SimplePlayer = function(spec) {

  var bank = {};

  var self = BSD.PubSub({});
  self.spec = spec;

  var out = context.createGain();
  out.gain.value = 0.08;
  out.connect(spec.destination);
  self.out = out;



  self.subscribe('set-master-volume',function(magnitude) {
    //console.log('MAG BEFORE',magnitude,volume);
    ///volume = magnitude;
    self.out.gain.value = magnitude;    
    ////console.log('MAG AFTER',magnitude,volume);
  });



  self.getOsc = function(freq) {
    var osc = context.createOscillator();/////BufferSource();
    osc.frequency.value = freq;
    osc.type = 'sine';
    return osc;
  };

  self.getEnviron = function(freq,gainValue) { //environ has just one osc. and one gain.
  	var env = {};
    //for now, just one osc...
    ///var ampAttack = Math.random() / 10;
  	var ampDecay = Math.random() + 0.2; 
    //ampAttack = Math.random() * 0.4 + 0.01;
   	var ampAttack = Math.random() * 0.2;


    var time = context.currentTime;






    var osc = self.getOsc(freq);

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


  var items = [
    { title: 'fundamental', freq: midi2Hertz(v,0), volumeRange: [0.5,1.0] },
    { title: 'octave', freq: midi2Hertz(v+12,0), volumeRange: [0.1,0.2] },
    { title: 'dominant', freq: midi2Hertz(v+19,0), volumeRange: [0.0,0.13] },
    { title: 'dominant+fourth(octave2)', freq: midi2Hertz(v+24,0), volumeRange: [0.0,0.02] },
    ///{ title: 'third', freq: midi2Hertz(semitone+28,detuneSemis), volumeRange: [0.0,0.02] },
    //{ title: '6/b7', freq: midi2Hertz(semitone+33.5,detuneSemis), volumeRange: [0.0,0.08] },

    ];

    var environments = items.map(function(item) {
    		return self.getEnviron(item.freq,BSD.randomInRange(item.volumeRange[0],item.volumeRange[1]));
    });
  	
  	environments.forEach(function(env){
	    env.start();
	    if (duration) { setTimeout(env.stop,duration); }
  	});
  
    result.stop = function() {
	  	environments.forEach(function(env) {
        env.stop();
    });
		return result;
  };
  self.playChord = function(chord,duration) {
    chord.notes().forEach(function(note){
      self.playNote(note,duration);
    });
  };

  return self;
};