function eachify(ary) {
  ary.eachPCN = function() { //gives your callback a view of previous, current, and next
  
    ///var length = ary.length;
    var c,p,n = false;
    var timeout = false;
    var timeoutFunction = false;
    var callback = arguments[0];
    
    if (arguments.length > 1) { 
      timeout = arguments[1]; 
    }
       
    function wait() {
      if (timeout == false) { return false; }
      
      if (typeof timeout == "number") { return timeout; }
      if (typeof timeout == "function") { return timeout(); }
    }
    
    function iterate() {
      if (ary.length > 0) {
        callback({ prev: ary[p], current: ary[c], next: ary[n], p: p, c: c, n: n, length: ary.length });    
        c += 1; c %= ary.length;
        n += 1; n %= ary.length;
        p += 1; p %= ary.length;
      }
      
      ////console.log('p/c/n/',p,c,n);
      
    }
    function spin() {
      iterate();
      setTimeout(spin,wait());
    }
    switch(ary.length) {
        case 0:
          ///console.log('err-OR! does not compute. ');
          c = 0; n = 0; p = 0;
          break;
        case 1:
          c = 0; n = 0; p = 0;
          break;
        case 2: 
          c = 0; n = 1; p = 1;
          break;
        default:
          c = 0; n = 1; p = ary.length - 1;
          break;
    }    
    
    if (timeout) { spin(); }
    else {
        for(var i = 0; i < ary.length; i += 1) { iterate(); }      
    }
  };
  return ary;
}