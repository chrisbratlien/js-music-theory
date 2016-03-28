if (typeof BSD == "undefined") { var BSD = {}; }
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




BSD.importJSON = function(url,callback) {
    jQuery.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: callback
    });
};

var campfire = BSD.PubSub({});
var storage = BSD.Storage('JSMT::');


   
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





var context;


BSD.allMIDIValues = [];
for(var i = 0; i < 128; i += 1) {
    BSD.allMIDIValues[i] = i;
} 

