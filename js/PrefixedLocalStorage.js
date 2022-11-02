let PrefixedLocalStorage = function (prefix) {
  if (!prefix) { 
    throw('configuration error: PrefixedLocalStorage needs prefix'); 
    return false;
  }

  var self = {};
  self.setItem = function(k,v) {
    if (typeof v !== "string") {
      v = JSON.stringify(v);
    }
    return localStorage.setItem(prefix + k,v);
  };

  self.getItem = function(k,cb) {
    let fullKey = prefix + k;
    let v = localStorage.getItem(fullKey);
    //success
    if (v && cb) {
      return cb(null,v);
    }
    //error or no callback

    //callback, so it must be an error
    if (cb) { 
      return cb(v);
    }
    //no callback, it's an error
    return v;
  };
  
  self.removeItem = function(k) {
    return localStorage.removeItem(prefix + k);
  };
    
  return self;
}
export default PrefixedLocalStorage;