BSD.StringOscillator = function(spec) {
  var self = BSD.PubSub({});
  var destination = spec.destination;
  var context = spec.context;


  var oscillatorBank = {}; //oscillators by semitone map.

  var worlds = {};


  var gainBank = {};


  self.playing = false;
  self.id = spec.id; ///just in case this is still needed...

  var SINE = 0, SQUARE = 1, SAWTOOTH = 2, TRIANGLE = 3, CUSTOM = 4;




  var volume = 0;
  var detuneSemis = 0;

  self.subscribe('set-master-volume',function(magnitude) {
    //console.log('MAG BEFORE',magnitude,volume);
    volume = magnitude;
    
    ////console.log('MAG AFTER',magnitude,volume);
  });
  

  self.subscribe('set-detune-semis',function(magnitude) {
    detuneSemis = magnitude;
    console.log('DETUNE-MAG AFTER',detuneSemis);
  });


  
  
  
  
  function randomInRange(min, max) {
    return Math.random() * (max-min) + min;
  }  
  

  self.play = function(semitone,duration,velocity)  {
    var env = {
      oscillators: [],
      gains: []
    }; //environment, not envelope
    ///console.log('play>>>',semitone,duration);

    var detune1 = 4.5;    
    var time = context.currentTime;
    var ampAttack = Math.random() / 10; //////[0.056,0.099,0.07,0.5].atRandom();
    var ampDecay = Math.random() + 0.2; 


    //ampAttack = Math.random() * 0.4 + 0.01;
    ampAttack = Math.random() * 0.2;

    var ampEnvelope = gainBank[semitone];
    if (!ampEnvelope) {
      gainBank[semitone] = context.createGain();
      ampEnvelope = gainBank[semitone];
    }


    ampEnvelope.connect(destination);





    var myGain = volume;
    if (velocity) {
      myGain *= (velocity / 128);
    }

    //attack
    //ampEnvelope.gain.linearRampToValueAtTime(myGain, time + ampAttack);    
    //decay
    //ampEnvelope.gain.exponentialRampToValueAtTime(myGain * 0.9, time + ampAttack + ampDecay);    
    ///immediate
    ///ampEnvelope.gain.value = volume;////0.0; // default value
    ampEnvelope.gain.value = myGain;////0.0; // default value









    var items = [
    { title: 'fundamental', freq: midi2Hertz(semitone,detuneSemis), volumeRange: [0.5,1.0] },
    { title: 'octave', freq: midi2Hertz(semitone+12,detuneSemis), volumeRange: [0.1,0.2] },
    //{ title: 'dominant', freq: midi2Hertz(semitone+19,detuneSemis), volumeRange: [0.0,0.13] },
    
    //{ title: 'dominant+fourth(octave2)', freq: midi2Hertz(semitone+24,detuneSemis), volumeRange: [0.0,0.04] },
    ///{ title: 'third', freq: midi2Hertz(semitone+28,detuneSemis), volumeRange: [0.0,0.02] },
    //{ title: '6/b7', freq: midi2Hertz(semitone+33.5,detuneSemis), volumeRange: [0.0,0.08] },

    ];

    items.forEach(function(o){
  

      var osc = context.createOscillator();/////BufferSource();
      var gain = context.createGain();
      
      var myVolume = randomInRange(o.volumeRange[0],o.volumeRange[1]);

      myVolume *= volume; //our established volume (0-1)

      if (velocity) {
        myVolume *= (velocity / 128);
      }


      osc.connect(gain);
      gain.connect(ampEnvelope);
      
      gain.gain.value = myVolume;
    
      var rate = o.freq * Math.pow(2.0, -detune1/1200);
      osc.frequency.value = rate;
      //////osc.type = (Math.random() > 0.9) ? SINE : TRIANGLE;/////].atRandom();//SINE;
      osc.type = 'sine';
  
      osc.start(0);/////noteOn(0);
      self.playing = true;


      env.oscillators.push(osc);
      env.gains.push(gain);
      env.stop = function() {

        env.oscillators.forEach(o => self.stopOsc(o));
        env.gains.forEach(g => {
          g.gain.setTargetAtTime(0,0);
          //g.gain.linearRampToValueAtTime(0.0,0); //do it now....              
        });
        
      };

      

      if (duration) { //meaning that we have time to plan stuff...
        ampEnvelope.gain.linearRampToValueAtTime(0.0, time + ampAttack + duration);    
        setTimeout(env.stop,duration);
      }
    });

    return env;
  };

  self.stopOsc = function(osc) {
    osc.stop();   
    osc.disconnect();
    self.playing = false;   
  };


  
  self.playNote = function(note,duration,velocity) {
    return self.play(note.value(),duration);  
  };

  return self;
};
