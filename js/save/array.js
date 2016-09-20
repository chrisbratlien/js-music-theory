///////////Array prototype versions //////////
Array.prototype.collect = Array.prototype.map;

Array.prototype.reject = function(test) { //return all but those which pass the test
  return this.select(function(element) { return !test(element); });
}


//select returns an array containing only the elements which pass the test
Array.prototype.select = function(test) {
  var result = [];
  for (var i = 0; i < this.length; i += 1) {
    if (test(this[i])) {
      result.push(this[i]);
    }
  }
  
  return result;
};

//detect returns the first element which passes the test, or false. aka "find"
Array.prototype.detect = function(test) {
  for (var i = 0; i < this.length; i += 1) {
    if (test(this[i])) {
      return this[i];
    }
  }
  
  return false;
};


Array.prototype.contains = function(x) { //does the array contain x?
  var result = this.detect(function(n) { return n == x; });    
  return (result !== false);
};


//each runs a block of code on each element
Array.prototype.each = Array.prototype.forEach; // now native JS!


Array.prototype.atRandom = function() {
if (this.length === 0) { return false; }
  var i = Math.floor(Math.random()*this.length);
  return this[i];
};
