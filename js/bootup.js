if (typeof BSD == "undefined") { var BSD = {}; }

BSD.iOS = (navigator.userAgent.match(/(iPod|iPhone|iPad)/));

BSD.keycodes = {
  d: 68,
  f: 70
};

BSD.toDataURI = function(content) {
    var result = 'data:text/html;base64,' + Base64.encode(content);
    return result;
};


BSD.fromDataURI = function(s) {
  var parts = s.split(/base64,/);
  if (parts.length < 2) { return "cannot parse"; }
  var base64 = parts[1];
  var content = Base64.decode(base64);
  return content;
}

BSD.currentFretDiv = false;

function midi2Hertz(x,detuneSemitoneOffset) {
  if (typeof detuneSemitoneOffset == "undefined") {
    detuneSemitoneOffset = 0;
  }
  return Math.pow(2,(x+ detuneSemitoneOffset-69)/12)*440;
}


BSD.randomInRange = function(min, max) {
    return Math.random() * (max-min) + min;
};  




BSD.range = function(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};



BSD.parseProgression = function(progString) {
    var lastChordName = false;
    var barStrings = progString.split(/\|/);
    barStrings = barStrings.map(function(o){  return o.trim(); });
    barStrings = barStrings.select(function(o){ return o.length > 0; });

    if (barStrings.length == 1) {
      barStrings = barStrings[0].split(/\ +/);      
      barStrings = barStrings.map(function(o){  return o.trim(); });
      barStrings = barStrings.select(function(o){ return o.length > 0; });
    }
    //console.log('barStrings',barStrings);
    
    var barIndex = 0;
    var chordIndex = 0;
    var barChordIndex = 0;

    var flat = [];
    
    barStrings.each(function(barString){
      var chordNames = barString.split(/,|\ +/);
      var halfBar = false;
      if (chordNames.length == 2) {
        halfBar = true;
      }
      
      
      chordNames.forEach(function(chordName,barChordIndex){
        if (chordName == '%') {
          chordName = lastChordName;
        }
        var origChord = makeChord(chordName);        
        var lowerChord = origChord.plus(-12);  
        
        flat.push({
          barIndex: barIndex,
          barChordIndex: barChordIndex,
          chordIndex: chordIndex,
          chord: lowerChord,
          halfBar: halfBar
        });
        chordIndex += 1;        
        lastChordName = chordName;
      });
      barIndex += 1;
    });

    return flat;
  };






  BSD.parseProgressionIntoBars = function(progString) {
    var barStrings = progString.split('|');
    
    
    barStrings = barStrings.select(function(o){ return o.trim().length > 0; });
    ///console.log('barStrings',barStrings);
    
    var bars = barStrings.map(function(barString){
      var chordNames = barString.split(/,|\ +/);
      chordNames = chordNames.select(function(o){ return o.trim().length > 0; });
      
      ///console.log('chordNames',chordNames);
      
      var chords = chordNames.map(function(o){
        var origChord = makeChord(o);
        return origChord;/////.plus(-12);
      });
      return chords;
    });
    
    ////console.log('bars???',bars);
    
    return bars;
  };














BSD.importJSON = function(url,callback,error) {
    jQuery.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: callback,
      error: error
    });
};

var campfire = BSD.PubSub({});
var storage = BSD.Storage('JSMT::');
BSD.remoteStorage = BSD.RemoteStorage({ 
  prefix: 'JSMT::',
  url: BSD.baseURL + '/ws'
});

   
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


function midi2Hertz(x) {
  return Math.pow(2,(x-69)/12)*440;
}

BSD.hzTable = [];
var a = 440; // a is 440 hz...
for (var x = 0; x <= 127; ++x)
{
BSD.hzTable[x] = midi2Hertz(x);
}



function loadImpulseResponse(url, convolver) {
    // Load impulse response asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() { 
        convolver.buffer = context.createBuffer(request.response, false);
        isImpulseResponseLoaded = true;
    }
    request.onerror = function() { 
        alert("error loading reverb");
    }

    request.send();
}



BSD.tempoToMillis = function(bpm) {
    var minutesPerBeat = 1 / bpm;
    var secs = minutesPerBeat * 60;
    var millis = secs * 1000;
    return millis;
};



var context = (window.AudioContext) ? new AudioContext : new webkitAudioContext;
BSD.audioContext = context;


BSD.allMIDIValues = [];
for(var i = 0; i < 128; i += 1) {
    BSD.allMIDIValues[i] = i;
} 


BSD.sorter = function(selectorFunc) {
    var sortFunc = function(a,b) {
      var sA = selectorFunc(a);
      var sB = selectorFunc(b);
      if (sA < sB) { return -1; }
      if (sA > sB) { return 1; }
      return 0;
    };
    return sortFunc;
};




