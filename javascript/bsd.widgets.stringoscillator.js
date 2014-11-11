BSD.StringOscillator = function(spec) {
  var self = BSD.PubSub({});
  var destination = spec.destination;
  var context = spec.context;

  self.playing = false;
  self.id = spec.id; ///just in case this is still needed...

  var SINE = 0, SQUARE = 1, SAWTOOTH = 2, TRIANGLE = 3, CUSTOM = 4;


  var ampEnvelope = context.createGain();
  ampEnvelope.gain.value = 0.0; // default value
  ampEnvelope.connect(destination);


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


    ////console.log('play',semitone,duration);

    var detune1 = 4.5;    
    var time = context.currentTime;
    var ampAttack = [0.056,0.099].atRandom();
    var ampDecay = 0.7; 





    ampEnvelope.gain = volume;
    ampEnvelope.gain.setTargetAtTime(volume, time, ampAttack);
    //ampEnvelope.gain.exponentialRampToValueAtTime(1,time+duration);
    
    
    
    ampAttack = 1 - (semitone / 74);
    if (ampAttack < 0) { ampAttack = 0;}
    
    
    [
    { title: 'fundamental', freq: midi2Hertz(semitone,detuneSemis), volumeRange: [0.5,1.0] },
    { title: 'octave', freq: midi2Hertz(semitone+12,detuneSemis), volumeRange: [0.1,0.2] },
    { title: 'dominant', freq: midi2Hertz(semitone+19,detuneSemis), volumeRange: [0.0,0.15] }
    ].each(function(o){
      var osc = context.createOscillator();/////BufferSource();
      var gain = context.createGain();
      
      var myVolume = randomInRange(o.volumeRange[0],o.volumeRange[1]) * volume;

      osc.connect(gain);
      gain.connect(ampEnvelope);
    
      var rate = o.freq * Math.pow(2.0, -detune1/1200);
      osc.frequency.value = rate;
      osc.type = (Math.random() > 0.9) ? SINE : TRIANGLE;/////].atRandom();//SINE;
  
      gain.gain.setTargetAtTime(myVolume, time, ampAttack);
      gain.gain.setTargetAtTime(0, time + ampAttack, ampDecay);
      ///gain.gain.exponentialRampToValueAtTime(0.1,time+ampAttack);



      osc.start(0);/////noteOn(0);
      self.playing = true;
      
      setTimeout(function(){ 
        osc.stop();   
        osc.disconnect();
        self.playing = false;
      },duration*5);
    });
  };
  
  self.playNote = function(note,duration) {
    self.play(note.value(),duration);  
  };
  
  return self;
};
