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


BSD.randomPalette = function(size,threshold) {
  var results = [];
  results.push(BSD.randomDarkColor());
  while(results.length < size) {
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



BSD.randomPalette2 = function(size,threshold) {
  var results = [];
  
  var first = BSD.randomColor();  
  results.push(first);

  var last = first;    
  while(results.length < size) {
    var test = BSD.randomColor();
    var distance = Math.abs(test.distanceTo(last));
    while (distance < (threshold - threshold*0.1) || distance > (threshold + threshold*0.1)) {
      var test = BSD.randomColor();  
      var distance = Math.abs(test.distanceTo(last));
    }    
    ////console.log('distance',distance);
    results.push(test);    
    last = test;
  }      
  return results;
};


BSD.Color = function(spec){
  var self = {};
  self.r = spec.r;
  self.g = spec.g;
  self.b = spec.b;

  self.brightness = function() {
    return self.r + self.g + self.b;
  };
  
  self.isBright = function() {
    return self.brightness() > 384;
  };
  self.isDark = function() {
    return ! self.isBright();
  };  
  self.isSomewhatDark = function() {
    var b = self.brightness();
    
    return (b > 128 && b < 480);
    ///return self.brightness() < 256;
    ///return self.brightness() < 300;
  };
  self.isReallyDark = function() {
    return self.brightness() < 192;
  };
  self.distanceTo = function(other) {
    var dr = self.r - other.r;
    var dg = self.g - other.g;
    var db = self.b - other.b;
    return Math.sqrt(dr*dr + dg*dg + db*db);
  };
  
  
  self.complement = function() {
    return BSD.Color({
      r: 255 - self.r,
      g: 255 - self.g,
      b: 255 - self.b
    });
  }
  
  
  
  
  self.equals = function(other) {
    return (
      self.r == other.r &&
      self.g == other.g &&
      self.b == other.b
    );  
  };

  self.minus = function(other) {
    return BSD.Color({  
      r: self.r - other.r,
      g: self.g - other.g,
      b: self.b - other.b
    });  
  };
  
  self.plus = function(other) {
    return BSD.Color({  
      r: self.r + other.r,
      g: self.g + other.g,
      b: self.b + other.b
    });  
  };

  self.dividedBy = function(x) {
    return BSD.Color({  
      r: self.r / x,
      g: self.g / x,
      b: self.b / x
    });  
  };
  self.delta = function(other) {
    return other.minus(self);
  };
  self.upTo = function(other,steps) {
    
    var result = [];
    var delta = self.delta(other).dividedBy(steps);  
    ////console.log(delta,'delta');
    var next = self;

    result.push(next);
    for(var i = 0; i < steps; i += 1) {
      next = next.plus(delta);
      result.push(next);
    }
    return result;
  };
  self.toHex = function(prefixHash) {
    var result = ('00' + Math.floor(self.r).toString(16)).substr(-2) + ('00' + Math.floor(self.g).toString(16)).substr(-2) + ('00' + Math.floor(self.b).toString(16)).substr(-2);
    ///console.log(result);
    return result;
  };
  
  
  self.renderOn = function(html) {
  
    var str = self.toHex();
    ////console.log(str,'str');
  
    jQuery(html).css('background-color','#' + str);
  }
  
  return self;
}