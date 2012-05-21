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

BSD.randHex = function() {
  return ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'].atRandom();
};
BSD.randomColor = function() {
  var result = '#';
  for (var i = 0; i < 6; i += 1) {
    result += BSD.randHex();
  }
  return BSD.colorFromHex(result);
};

BSD.randomDarkColor = function() {
  var color = BSD.randomColor();
  while (! color.isSomewhatDark()) {
    color = BSD.randomColor();  
  }
  /////console.log('#' + color.toHex());
  return color;
};


BSD.play = function(threshold) {
  
  var results = [];
  results.push(BSD.randomDarkColor());
  while(results.length < 7) {
    var test = BSD.randomDarkColor();
    var distances = results.collect(function(rc) { return rc.distanceTo(test); });
    distances.sort(function(a,b) { return a > b; });
    var closest = distances[0];
    //console.log(distances,'distances');
    //console.log(closest,'closest');

    if (closest < threshold) {
      ////console.log('skipping',test.toHex(),closest);  
    }
    else {
      results.push(test);    
    }
  } 
  return results;
}




BSD.Color = function(spec){
  var interface = {};
  interface.r = spec.r;
  interface.g = spec.g;
  interface.b = spec.b;

  interface.brightness = function() {
    return interface.r + interface.g + interface.b;
  };
  
  interface.isBright = function() {
    return interface.brightness() > 384;
  };
  interface.isDark = function() {
    return ! interface.isBright();
  };  
  interface.isSomewhatDark = function() {
    var b = interface.brightness();
    
    return (b > 128 && b < 480);
    ///return interface.brightness() < 256;
    ///return interface.brightness() < 300;
  };
  interface.isReallyDark = function() {
    return interface.brightness() < 192;
  };
  interface.distanceTo = function(other) {
    var dr = interface.r - other.r;
    var dg = interface.g - other.g;
    var db = interface.b - other.b;
    return Math.sqrt(dr*dr + dg*dg + db*db);
  };
  
  
  
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