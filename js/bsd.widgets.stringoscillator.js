BSD.StringOscillator = function(spec) {
  var self = BSD.PubSub({});
  var destination = spec.destination;
  var context = spec.context;


  var oscillatorBank = {}; //oscillators by semitone map.

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
  

  self.play = function(semitone,duration)  {


    ///console.log('play>>>',semitone,duration);

    var detune1 = 4.5;    
    var time = context.currentTime;
    var ampAttack = Math.random() / 10; //////[0.056,0.099,0.07,0.5].atRandom();
    var ampDecay = Math.random() + 0.2; 


    //ampAttack = Math.random() * 0.4 + 0.01;
    ampAttack = Math.random() * 0.2;


    ////var 

    var ampEnvelope = gainBank[semitone];
    if (!ampEnvelope) {
      gainBank[semitone] = context.createGain();
      ampEnvelope = gainBank[semitone];
    }

    ampEnvelope.gain.value = 0.0; // default value
    ampEnvelope.connect(destination);


    ///ampEnvelope.gain.setTargetAtTime(volume, time, ampAttack);
    ///ampEnvelope.gain.exponentialRampToValueAtTime(volume,time+ampAttack);
    //ampEnvelope.gain.exponentialRampToValueAtTime(0.1,time+ampAttack+duration);
    //attack
    ampEnvelope.gain.linearRampToValueAtTime(volume, time + ampAttack);    
    //decay
    ampEnvelope.gain.exponentialRampToValueAtTime(volume * 0.9, time + ampAttack + ampDecay);    
    
    //release
    ampEnvelope.gain.linearRampToValueAtTime(0.0, time + ampAttack + duration);    

    
    /*    
    ampAttack = 1 - (semitone / 74);

    ampAttack = Math.random() + 0.2;

    if (ampAttack <= 0) { ampAttack = 0.01;}
      
    **/
    ////console.log('ampAttack',ampAttack);

    
    
    [
    { title: 'fundamental', freq: midi2Hertz(semitone,detuneSemis), volumeRange: [0.5,1.0] },
    { title: 'octave', freq: midi2Hertz(semitone+12,detuneSemis), volumeRange: [0.1,0.2] },
    { title: 'dominant', freq: midi2Hertz(semitone+19,detuneSemis), volumeRange: [0.0,0.15] }
    ].each(function(o){
      
      oscillatorBank[semitone] = context.createOscillator();/////BufferSource();
      var osc = oscillatorBank[semitone];

      var gain = context.createGain();
      
      var myVolume = randomInRange(o.volumeRange[0],o.volumeRange[1]) * volume;

      osc.connect(gain);
      gain.connect(ampEnvelope);
    
      var rate = o.freq * Math.pow(2.0, -detune1/1200);
      osc.frequency.value = rate;
      //////osc.type = (Math.random() > 0.9) ? SINE : TRIANGLE;/////].atRandom();//SINE;
      osc.type = 'sine';
  
      gain.gain.setTargetAtTime(myVolume, time, ampAttack);
      gain.gain.setTargetAtTime(0, time + ampAttack, ampDecay);
      ///gain.gain.exponentialRampToValueAtTime(0.1,time+ampAttack);



      osc.start(0);/////noteOn(0);
      self.playing = true;
      
      setTimeout(function(){ 
        osc.stop();   
        osc.disconnect();
        self.playing = false;
      },duration);
    });
  };
  
  self.playNote = function(note,duration) {
    self.play(note.value(),duration);  
  };
  
  return self;
};
