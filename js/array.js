///////////Array prototype versions //////////


//some ES-native aliases for Chris's Smalltalk-like Collection coding habits
Array.prototype.collect = Array.prototype.map;
Array.prototype.each = Array.prototype.forEach;
Array.prototype.select = Array.prototype.filter;
Array.prototype.detect = Array.prototype.find;


Array.prototype.tee = function(callback) { callback(this); return this; };

Array.prototype.reject = function(test) {
	return this.select(function(element) { return !test(element); });
	
}

Array.prototype.contains = function (x) { //does the array contain x?
	var result = this.detect(function (n) { return n == x; });
	return (result !== false);
};

Array.prototype.inject = function (acc, fn) {
	var result = acc;
	this.each(function (e) {
		result = fn(result, e);
	});
	return result;
};





Array.prototype.atRandom = function () {
	if (this.length === 0) { return false; }
	var i = Math.floor(Math.random() * this.length);
	return this[i];
};

Array.prototype.shuffle = function(){ 
	var result = this.collect(function(x) { return x; });  //make a copy, do all state changing on the new copy.
	for(var j, x, i = result.length; i; j = parseInt(Math.random() * i), x = result[--i], result[i] = result[j], result[j] = x);
	return result;
};

Array.prototype.integrate = function (fn) {
	return this.inject(0, function (acc, i) { return acc + fn(i); });
};
Array.prototype.sum = function () {
	return this.integrate(function (x) { return x; });
}; 

Array.prototype.average = function() {
	return this.sum() / this.length;
};


/* IE doesn't support Array.indexOf, so here, hold my hand while we cross the street */
if (!Array.indexOf) {
Array.prototype.indexOf = function (obj) {
for (var i = 0; i < this.length; i++) {
if (this[i] == obj) {
return i;
}
}
return -1;
}
}

Array.prototype.eachPCN = function(callback) { //gives your callback a view of previous, current, and next

var length = this.length;
var c,p,n = false;
switch(length) {
case 0:
console.log('err-OR! does not compute. ');
break;
case 1:
c = 0; n = 0; p = 0;
break;
case 2: 
c = 0; n = 1; p = 1;
break;
default:
c = 0; n = 1; p = length - 1;
break;
}    

for(var i = 0; i < length; i += 1) {
callback({ prev: this[p], current: this[c], next: this[n], p: p, c: c, n: n, length: length });
c += 1; c %= length;
n += 1; n %= length;
p += 1; p %= length;
}
};



Array.prototype.unique = function()
{
var n = {},r=[];
for(var i = 0; i < this.length; i++) 
{
if (!n[this[i]]) 
{
n[this[i]] = true; 
r.push(this[i]); 
}
}
return r;
}

