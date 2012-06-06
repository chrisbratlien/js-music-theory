if (typeof JSMT == "undefined") { alert('timer.js not loaded in proper order'); }
JSMT.Timer = function(spec){
  
  var interface = {}

  var callback = spec.callback || function (){ return false; };
  var delay = spec.delay || 1000; //millis

  interface.spin = function(  ) {
    setTimeout(function() {
      callback();
      interface.spin();
    },delay);  
  };

  return interface;

};