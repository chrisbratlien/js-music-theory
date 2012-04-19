if (typeof BSD == "undefined") {
  BSD = {};
}


BSD.colorFromHex = function(hex) {
  var h = hex.replace('#','');
  return BSD.Color({
    r: parseInt(h.substr(0,2),16),
    g: parseInt(h.substr(2,2),16),
    b: parseInt(h.substr(4,2),16)
  });
};

BSD.Color = function(spec){
  var interface = {};
  interface.r = spec.r;
  interface.g = spec.g;
  interface.b = spec.b;
  
  interface.minus = function(other) {
    return BSD.Color({  
      r: interface.r - other.r,
      g: interface.g - other.g,
      b: interface.b - other.b,
    });  
  };
  
  interface.plus = function(other) {
    return BSD.Color({  
      r: interface.r + other.r,
      g: interface.g + other.g,
      b: interface.b + other.b,
    });  
  };

  interface.dividedBy = function(x) {
    return BSD.Color({  
      r: interface.r / x,
      g: interface.g / x,
      b: interface.b / x
    });  
  };
  interface.delta = function(other) {
    return other.minus(interface);
  };
  interface.upTo = function(other,steps) {
    
    var result = [];
    var delta = interface.delta(other).dividedBy(steps);  
    ////console.log(delta,'delta');
    var next = interface;

    result.push(next);
    for(var i = 0; i < steps; i += 1) {
      next = next.plus(delta);
      result.push(next);
    }
    return result;
  };
  interface.toHex = function() {
    var result = ('00' + Math.floor(interface.r).toString(16)).substr(-2) + ('00' + Math.floor(interface.g).toString(16)).substr(-2) + ('00' + Math.floor(interface.b).toString(16)).substr(-2);
    ///console.log(result);
    return result;
  };
  
  
  interface.renderOn = function(html) {
  
    var str = interface.toHex();
    ////console.log(str,'str');
  
    jQuery(html).css('background-color','#' + str);
  }
  
  return interface;
}