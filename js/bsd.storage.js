if (!BSD) {
  var BSD = {}; 
}

BSD.Storage = function (prefix) {
  if (!prefix) { 
    throw('configuration error: set BSD.Storage needs prefix'); 
    return false;
  }

  var self = {};
  self.setItem = function(k,v) {
    return localStorage.setItem(prefix + k,v);
  };

  self.getItem = function(k,success,error) {
    var result = localStorage.getItem(prefix + k);
    if (success && result) { 
      success(result); 
      return result;
    }

    if (error) {
      error(result);     
    }
    return result;
  };
  
  self.removeItem = function(k) {
    return localStorage.removeItem(prefix + k);
  };
  
  
  self.clear = function() {
    localStorage.clear();
  }
  
  return self;
};