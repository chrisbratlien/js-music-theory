var closeEnough = function(x,y) { 
	return Math.abs(x - y) < 0.01; 
};


var sqrt = function(x) { 
	return fixedPoint(averageDamp(function(y) { 
		return x / y; 
	}),1); 
};






var average = function(x,y) { 
	return (x + y) / 2; 
}

var averageDamp = function(f) { //returns a function
	return function(x) { 
		return average(f(x),x); 
	}; 
}

var fixedPoint = function(f,start) { 
	var iter = function(old,newz) { 
		if (closeEnough(old,newz)) { 
			return newz; 
		} else { 
			return iter(newz,f(newz)); 
		} 
	}; 
	return iter(start,f(start)); 
};

