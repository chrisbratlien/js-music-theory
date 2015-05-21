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


