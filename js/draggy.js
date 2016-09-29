var Point = function(specX,specY) {
  //private
  var x = specX || 0;
  var y = specY || 0;

  //interface
  var that = {};
  that.x = function() { return x; };
  that.y = function() { return y; };

  that.minus = function(other) {
    return Point(x - other.x(), y - other.y());
  };
  that.plus = function(other) {
    return Point(x + other.x(), y + other.y());
  };
  
  that.toString = function() {
    return '(' + that.x() + ',' + that.y() + ')';
  };
  that.scaleBy = function(other) {
    return Point( x * other.x(), y * other.y());
  };
  return that;
};



Touchy = function(elem,spec) {
  var interface = {};

  var starter = function(event) {
    event.preventDefault();
    //console.log('starrrt….touuuuuch');
    spec.ontouchstart(event);
    elem.bind('touchmove',mover);
  };
  var mover = function(event) {
    //console.log('mover');
    spec.ontouchmove(event);
    elem.bind('touchend',ender);
  };
  var ender = function(event) {
    spec.ontouchend(event);
    ////console.log('ender');
  };
  interface.hookupEvents = function() {
    elem.bind('touchstart',starter);
  };
  return interface;
}



Mousey = function(elem,spec) {
  var interface = {};
  var jDoc = jQuery(document);
  var starter = function(event) {
    //console.log('starrrt…..mouuuuuse');
    spec.onmousedown(event);    
    jDoc.bind('mousemove',mover);
    //so that the letting go can happen off-element. cursor could slide off element due to other constraints
    jDoc.bind('mouseup',ender); 
    return false;
  };
  var mover = function(event) {
    //console.log('mouse mover');
    spec.onmousemove(event);
    return false;
  };
  var ender = function(event) {
    spec.onmouseup(event);
    ////console.log('mouse ender');
    jDoc.unbind('mousemove',mover);
    jDoc.unbind('mouseup',ender);
    return false;
  };
  
  interface.hookupEvents = function() {
    elem.bind('mousedown',starter);
  };
  return interface;
};


var Draggy = function(elem,spec) {

  var onUpdate = spec.onUpdate || function() {};


  var isPointSafe = spec.isPointSafe || function(point) { return true; };


  //interface
  var that = {};
  elem.draggable = true; //assignment
  var lastPoint = Point(0,0);

  var touched = Touchy(jQuery(elem),{
    ontouchstart: function(event) {
      lastPoint = that.pointOfTouchEvent(event);
    },
    ontouchmove: function(event) {
      that.nowBeHere(that.pointOfTouchEvent(event));
    },
    ontouchend: function(event) {
      that.nowBeHere(that.pointOfTouchEvent(event));
    }
  });
  
  var moused = Mousey(jQuery(elem), {
    onmousedown: function(event) {
      lastPoint = that.pointOfMouseEvent(event);
    },
    onmousemove: function(event) {
      that.nowBeHere(that.pointOfMouseEvent(event));
    },
    onmouseup: function(event) {
      that.nowBeHere(that.pointOfMouseEvent(event));
    }
  
  });
  
  
  that.hookupEvents = function() {
    touched.hookupEvents();
    moused.hookupEvents();
  };
  

  that.whereAmI = function() {
    var left = parseInt(elem.style.left,10) || 0;
    var top = parseInt(elem.style.top,10) || 0;
    return Point(left,top);
  };
  that.nowBeHere = function(newPoint) {
    var diff = newPoint.minus(lastPoint);
    
    
    var possibleFuturePoint = that.whereAmI().plus(diff);
    //RETRIES make it more user-friendly and forgiving while still enforcing the contraints
    var retry = 9;
    while(!isPointSafe(possibleFuturePoint) && retry > 0) {
      diff = diff.scaleBy(Point(0.5,0.5));  //half the distance
      possibleFuturePoint = that.whereAmI().plus(diff);
      retry -= 1;
    }
    
    if (!isPointSafe(possibleFuturePoint)) { return false; }
    var where = that.whereAmI();


    that.updateElementPoint(possibleFuturePoint); ///Point(where.x() + (newPoint.x() - lastPoint.x()),where.y() + (newPoint.y() - lastPoint.y())));
    lastPoint = newPoint;
  };


  that.updateElementPointX = function(aPoint) { //assignment
    elem.style.left = aPoint.x() + 'px';
    onUpdate(that.whereAmI()); //private onUpdate callback, must be sent in constructor spec
  };

  that.updateElementPointY = function(aPoint) { //assignment
    elem.style.top = aPoint.y() + 'px';    
    onUpdate(that.whereAmI()); //private onUpdate callback, must be sent in constructor spec
  };

  that.updateElementPointXY = function(aPoint) { //assignment
    that.updateElementPointX(aPoint);
    that.updateElementPointY(aPoint);
    onUpdate(that.whereAmI()); //private onUpdate callback, must be sent in constructor spec
  };
  

  var directionMap = {
    'x': that.updateElementPointX,
    'y': that.updateElementPointY,
    'xy': that.updateElementPointXY
  };

  that.updateElementPoint = directionMap[spec.direction] || that.updateElementPointXY;//ka-chow


  
  //mouse
  that.pointOfMouseEvent = function(event) {
  	if (event == null) { event = window.event; } //IE7
	   return Point(event.clientX,event.clientY);
  };

  //touch
  that.pointOfTouchEvent = function(event) {
  	if (event == null) { event = window.event; } //IE7
    if (typeof event.targetTouches == "undefined") {
      event = event.originalEvent; 
    }  	
  	var touch = event.targetTouches[0];
  	return Point(touch.pageX,touch.pageY);
  };

  //generic
  that.pointOfEvent = function(event) {
    if (typeof Touch != "undefined") {
      return that.pointOfTouchEvent(event);
    }
    else {
      return that.pointOfMouseEvent(event);    
    }
  };
    
  return that;

};
